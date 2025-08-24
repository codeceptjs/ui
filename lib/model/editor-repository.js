const fs = require('fs');
const path = require('path');
const debug = require('debug')('codeceptjs:editor-repository');

/**
 * Parser for CodeceptJS test files using AST parsing
 * Handles modern CodeceptJS 3.x syntax including:
 * - Scenario() with async/await
 * - Before/After hooks
 * - Feature() blocks
 * - Data-driven tests with multiple scenarios
 */

/**
 * Simple regex-based parser for CodeceptJS scenarios
 * More reliable than full AST parsing for this use case
 */
class EditorRepository {
  /**
   * Extract scenario content from file based on line number
   * @param {string} filePath - Path to the test file
   * @param {number} lineNumber - Starting line number of the scenario
   * @returns {Object} - { source, startLine, endLine }
   */
  getScenarioSource(filePath, lineNumber) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Find the scenario starting at or near the line number
      let startIndex = Math.max(0, lineNumber - 1);
      let foundScenario = false;
      
      // Search for the closest Scenario definition to the target line
      let bestMatch = null;
      let bestDistance = Infinity;
      
      for (let i = Math.max(0, startIndex - 5); i < Math.min(lines.length, startIndex + 5); i++) {
        const line = lines[i].trim();
        if (line.startsWith('Scenario(') || line.startsWith('Scenario.only(') || line.startsWith('Scenario.skip(')) {
          const distance = Math.abs(i - (lineNumber - 1));
          if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = i;
          }
        }
      }
      
      if (bestMatch === null) {
        throw new Error(`No Scenario found near line ${lineNumber}`);
      }
      
      startIndex = bestMatch;
      foundScenario = true;
      
      // Find the end of the scenario by matching braces
      let braceCount = 0;
      let endIndex = startIndex;
      let inScenario = false;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        
        // Count opening and closing braces
        for (let char of line) {
          if (char === '{') {
            braceCount++;
            inScenario = true;
          } else if (char === '}') {
            braceCount--;
          }
        }
        
        // When we've closed all braces and we're in a scenario, we're done
        if (inScenario && braceCount === 0) {
          endIndex = i;
          break;
        }
      }
      
      const scenarioLines = lines.slice(startIndex, endIndex + 1);
      const source = scenarioLines.join('\n');
      
      debug(`Extracted scenario from lines ${startIndex + 1} to ${endIndex + 1}`);
      
      return {
        source,
        startLine: startIndex + 1,
        endLine: endIndex + 1,
        fullContent: content
      };
    } catch (error) {
      debug(`Error extracting scenario: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Update scenario content in file
   * @param {string} filePath - Path to the test file
   * @param {number} lineNumber - Starting line number of the original scenario
   * @param {string} newScenarioCode - New scenario code to replace
   * @returns {boolean} - Success status
   */
  updateScenario(filePath, lineNumber, newScenarioCode) {
    try {
      const originalData = this.getScenarioSource(filePath, lineNumber);
      const { startLine, endLine, fullContent } = originalData;
      
      const lines = fullContent.split('\n');
      
      // Validate the new code contains Scenario definition
      if (!newScenarioCode.trim().includes('Scenario(')) {
        throw new Error('New code must contain a Scenario() definition');
      }
      
      // Replace the scenario content
      const newLines = [
        ...lines.slice(0, startLine - 1),
        ...newScenarioCode.split('\n'),
        ...lines.slice(endLine)
      ];
      
      const newContent = newLines.join('\n');
      
      // Create backup
      const backupPath = `${filePath}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, fullContent);
      debug(`Created backup at ${backupPath}`);
      
      // Write the new content
      fs.writeFileSync(filePath, newContent);
      debug(`Updated scenario in ${filePath} at lines ${startLine}-${endLine}`);
      
      // Clean up old backups (keep only last 5)
      this.cleanupBackups(filePath);
      
      return true;
    } catch (error) {
      debug(`Error updating scenario: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get full file content for editing
   * @param {string} filePath - Path to the test file
   * @returns {string} - File content
   */
  getFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      debug(`Error reading file: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Update full file content
   * @param {string} filePath - Path to the test file  
   * @param {string} content - New file content
   * @returns {boolean} - Success status
   */
  updateFileContent(filePath, content) {
    try {
      // Create backup
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const backupPath = `${filePath}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, originalContent);
      debug(`Created backup at ${backupPath}`);
      
      // Write new content
      fs.writeFileSync(filePath, content);
      debug(`Updated file content in ${filePath}`);
      
      // Clean up old backups
      this.cleanupBackups(filePath);
      
      return true;
    } catch (error) {
      debug(`Error updating file: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Clean up old backup files (keep only the last 5)
   * @param {string} filePath - Original file path
   */
  cleanupBackups(filePath) {
    try {
      const dir = path.dirname(filePath);
      const basename = path.basename(filePath);
      const files = fs.readdirSync(dir);
      
      const backupFiles = files
        .filter(f => f.startsWith(`${basename}.backup.`))
        .map(f => ({
          name: f,
          path: path.join(dir, f),
          timestamp: parseInt(f.split('.backup.')[1]) || 0
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      
      // Remove old backups (keep only 5 most recent)
      backupFiles.slice(5).forEach(backup => {
        try {
          fs.unlinkSync(backup.path);
          debug(`Cleaned up old backup: ${backup.name}`);
        } catch (err) {
          debug(`Error cleaning backup ${backup.name}: ${err.message}`);
        }
      });
    } catch (error) {
      debug(`Error cleaning up backups: ${error.message}`);
    }
  }
  
  /**
   * Get CodeceptJS autocomplete suggestions
   * @returns {Array} - Autocomplete suggestions for modern CodeceptJS
   */
  getAutocompleteSuggestions() {
    return {
      // Modern CodeceptJS 3.x methods for Playwright helper
      playwright: [
        'I.amOnPage(url)',
        'I.click(locator)',
        'I.doubleClick(locator)',
        'I.rightClick(locator)',
        'I.fillField(field, value)',
        'I.appendField(field, value)',
        'I.selectOption(select, option)',
        'I.attachFile(locator, pathToFile)',
        'I.checkOption(field)',
        'I.uncheckOption(field)',
        'I.grabTextFrom(locator)',
        'I.grabValueFrom(field)',
        'I.grabAttributeFrom(locator, attribute)',
        'I.grabHTMLFrom(locator)',
        'I.grabCssPropertyFrom(locator, property)',
        'I.see(text, locator)',
        'I.dontSee(text, locator)',
        'I.seeInField(field, value)',
        'I.dontSeeInField(field, value)',
        'I.seeCheckboxIsChecked(field)',
        'I.dontSeeCheckboxIsChecked(field)',
        'I.seeElement(locator)',
        'I.dontSeeElement(locator)',
        'I.seeElementInDOM(locator)',
        'I.dontSeeElementInDOM(locator)',
        'I.seeInSource(text)',
        'I.dontSeeInSource(text)',
        'I.seeCurrentUrlEquals(url)',
        'I.dontSeeCurrentUrlEquals(url)',
        'I.seeInCurrentUrl(url)',
        'I.dontSeeInCurrentUrl(url)',
        'I.seeInTitle(text)',
        'I.dontSeeInTitle(text)',
        'I.grabTitle()',
        'I.grabCurrentUrl()',
        'I.switchTo(locator)',
        'I.switchToNextTab()',
        'I.switchToPreviousTab()',
        'I.closeCurrentTab()',
        'I.closeOtherTabs()',
        'I.openNewTab()',
        'I.wait(sec)',
        'I.waitForVisible(locator, sec)',
        'I.waitForInvisible(locator, sec)',
        'I.waitForElement(locator, sec)',
        'I.waitForText(text, sec, locator)',
        'I.waitInUrl(urlPart, sec)',
        'I.waitUrlEquals(url, sec)',
        'I.waitForNavigation()',
        'I.executeScript(fn)',
        'I.executeAsyncScript(fn)',
        'I.scrollTo(locator)',
        'I.scrollPageToTop()',
        'I.scrollPageToBottom()',
        'I.pressKey(key)',
        'I.resizeWindow(width, height)',
        'I.drag(srcElement, destElement)',
        'I.dragAndDrop(srcElement, destElement)',
        'I.saveScreenshot(fileName)',
        'I.setCookie(cookie)',
        'I.clearCookie(name)',
        'I.seeCookie(name)',
        'I.dontSeeCookie(name)',
        'I.grabCookie(name)'
      ],
      // Test structure
      structure: [
        'Feature(\'feature name\')',
        'Scenario(\'scenario name\', async ({ I }) => {})',
        'Scenario.only(\'scenario name\', async ({ I }) => {})',
        'Scenario.skip(\'scenario name\', async ({ I }) => {})',
        'Before(async ({ I }) => {})',
        'After(async ({ I }) => {})',
        'BeforeSuite(async ({ I }) => {})',
        'AfterSuite(async ({ I }) => {})',
        'Data().Scenario(\'data driven test\', async ({ I, current }) => {})'
      ],
      // Common patterns
      patterns: [
        'within(\'selector\', () => {})',
        'session(\'name\', () => {})',
        'pause()',
        'secret(value)',
        'locate(\'selector\')',
        'locate(\'selector\').withText(\'text\')',
        'locate(\'selector\').at(position)'
      ]
    };
  }
}

module.exports = new EditorRepository();