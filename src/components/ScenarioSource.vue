<template>
  <div class="ScenarioSource">
    <!-- Read-only view -->
    <div
      v-if="!isEditing"
      class="source-view"
    >
      <pre v-highlightjs="displaySource"><code class="javascript" /></pre>
      <div class="source-actions">
        <b-button
          v-if="file"
          type="is-light is-small"
          @click="editFile()"
          class="mr-2"
        >
          <i class="fas fa-edit" /> Edit in External Editor
        </b-button>
        <b-button
          type="is-primary is-small"
          @click="startEditing()"
          :disabled="isLoading"
          :loading="isLoading"
        >
          <i class="fas fa-code" /> Edit Code
        </b-button>
      </div>
    </div>

    <!-- Monaco Editor view -->
    <div
      v-if="isEditing"
      class="editor-view"
    >
      <div class="editor-header">
        <div class="columns is-vcentered is-gapless">
          <div class="column">
            <h5 class="title is-6 mb-1">
              <i class="fas fa-code mr-2" />
              Editing: {{ file }}
            </h5>
            <p class="is-size-7 has-text-grey">
              Lines {{ currentStartLine }}-{{ currentEndLine }} | CodeceptJS {{ mode }} Mode
            </p>
          </div>
          <div class="column is-narrow">
            <div class="buttons">
              <b-button 
                type="is-light"
                size="is-small"
                @click="cancelEditing()"
                :disabled="isSaving"
              >
                Cancel
              </b-button>
              <b-button
                type="is-success"
                size="is-small"
                @click="saveChanges()"
                :disabled="!hasChanges || isSaving"
                :loading="isSaving"
              >
                <i class="fas fa-save mr-1" />
                Save Changes
              </b-button>
            </div>
          </div>
        </div>
      </div>
      
      <div
        class="editor-container"
        ref="editorContainer"
      >
        <monaco-editor
          v-model="editorContent"
          :options="editorOptions"
          @editorDidMount="onEditorMounted"
          language="javascript"
          theme="vs-light"
          height="400"
        />
      </div>
      
      <div class="editor-footer">
        <div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <b-field grouped>
                <b-field>
                  <b-switch
                    v-model="enableAutoComplete"
                    size="is-small"
                  >
                    CodeceptJS Autocomplete
                  </b-switch>
                </b-field>
                <b-field>
                  <b-switch
                    v-model="enableLiveValidation"
                    size="is-small"
                  >
                    Live Validation
                  </b-switch>
                </b-field>
              </b-field>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <p class="is-size-7 has-text-grey">
                <i class="fas fa-info-circle mr-1" />
                Ctrl+S to save • Ctrl+Z to undo • Ctrl+Y to redo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error handling -->
    <EditorNotFound
      :error="error"
      :is-opened="!!error"
      @close="error = null"
    />
    
    <!-- Save notification -->
    <b-notification
      v-if="saveSuccess"
      type="is-success"
      has-icon
      auto-close
      @close="saveSuccess = false"
    >
      <strong>Saved!</strong> Your changes have been saved successfully.
    </b-notification>
  </div>
</template>

<script>
import axios from 'axios';
import EditorNotFound from './EditorNotFound';

export default {
  name: 'ScenarioSource',
  props: {
    source: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    scenario: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    EditorNotFound,
    // Monaco Editor will be loaded dynamically
  },
  data() {
    return {
      isEditing: false,
      isLoading: false,
      isSaving: false,
      error: null,
      saveSuccess: false,
      
      // Editor state
      editorContent: '',
      originalContent: '',
      currentStartLine: 0,
      currentEndLine: 0,
      
      // Editor settings
      enableAutoComplete: true,
      enableLiveValidation: true,
      mode: 'scenario', // 'scenario' or 'file'
      
      // Monaco Editor options
      editorOptions: {
        fontSize: 14,
        fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        minimap: { enabled: true },
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        renderWhitespace: 'boundary',
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        quickSuggestions: true,
        parameterHints: { enabled: true }
      }
    };
  },
  computed: {
    displaySource() {
      return this.source || '// No source code available';
    },
    
    hasChanges() {
      return this.editorContent !== this.originalContent;
    }
  },
  mounted() {
    // Load Monaco Editor dynamically
    this.loadMonacoEditor();
    
    // Set up keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts);
  },
  
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeyboardShortcuts);
  },
  
  methods: {
    async loadMonacoEditor() {
      try {
        // Dynamic import of Monaco Editor component
        const { default: MonacoEditor } = await import('vue-monaco');
        this.$options.components.MonacoEditor = MonacoEditor;
      } catch (error) {
        console.error('Failed to load Monaco Editor:', error);
        this.error = {
          message: 'Code editor not available',
          description: 'Monaco Editor failed to load. Please try refreshing the page.'
        };
      }
    },

    editFile() {
      axios
        .get(`/api/tests/${encodeURIComponent(this.file)}/open`)
        .then(() => {
          this.error = null;
        })
        .catch((error) => {
          this.error = error.response?.data || {
            message: 'Failed to open external editor',
            description: 'Unable to launch external editor'
          };
        });
    },

    async startEditing() {
      this.isLoading = true;
      this.error = null;
      
      try {
        let response;
        
        if (this.scenario && this.scenario.line) {
          // Edit specific scenario
          response = await axios.get(
            `/api/editor/scenario/${encodeURIComponent(this.file)}/${this.scenario.line}`
          );
          this.mode = 'scenario';
        } else {
          // Edit full file
          response = await axios.get(`/api/editor/file/${encodeURIComponent(this.file)}`);
          this.mode = 'file';
        }
        
        const { data } = response.data;
        this.editorContent = data.source || data.content;
        this.originalContent = this.editorContent;
        this.currentStartLine = data.startLine || 1;
        this.currentEndLine = data.endLine || this.editorContent.split('\n').length;
        
        this.isEditing = true;
        
        // Setup autocomplete after editor is mounted
        this.$nextTick(() => {
          if (this.enableAutoComplete) {
            this.setupAutocomplete();
          }
        });
        
      } catch (error) {
        console.error('Error loading editor:', error);
        this.error = {
          message: 'Failed to load code for editing',
          description: error.response?.data?.message || 'Unable to load source code'
        };
      } finally {
        this.isLoading = false;
      }
    },

    async saveChanges() {
      this.isSaving = true;
      this.error = null;
      
      try {
        let endpoint;
        let payload;
        
        if (this.mode === 'scenario' && this.scenario && this.scenario.line) {
          endpoint = `/api/editor/scenario/${encodeURIComponent(this.file)}/${this.scenario.line}`;
          payload = { source: this.editorContent };
        } else {
          endpoint = `/api/editor/file/${encodeURIComponent(this.file)}`;
          payload = { content: this.editorContent };
        }
        
        await axios.put(endpoint, payload);
        
        this.originalContent = this.editorContent;
        this.saveSuccess = true;
        this.isEditing = false;
        
        // Emit event to trigger file watcher refresh
        this.$emit('code-updated', {
          file: this.file,
          content: this.editorContent
        });
        
      } catch (error) {
        console.error('Error saving changes:', error);
        this.error = {
          message: 'Failed to save changes',
          description: error.response?.data?.message || 'Unable to save code changes'
        };
      } finally {
        this.isSaving = false;
      }
    },

    cancelEditing() {
      if (this.hasChanges) {
        const confirmed = confirm('You have unsaved changes. Are you sure you want to cancel?');
        if (!confirmed) return;
      }
      
      this.isEditing = false;
      this.editorContent = '';
      this.originalContent = '';
      this.error = null;
    },

    onEditorMounted(editor) {
      // Configure editor
      this.editor = editor;
      
      // Add keyboard shortcuts (monaco is available globally when editor is mounted)
      if (window.monaco) {
        editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_S, () => {
          if (this.hasChanges && !this.isSaving) {
            this.saveChanges();
          }
        });
      }
      
      // Focus editor
      editor.focus();
    },

    async setupAutocomplete() {
      if (!this.enableAutoComplete || !window.monaco) return;
      
      try {
        const response = await axios.get('/api/editor/autocomplete');
        const suggestions = response.data.data;
        
        // Register autocomplete provider
        window.monaco.languages.registerCompletionItemProvider('javascript', {
          provideCompletionItems: (model, position) => {
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
            };
            
            const items = [];
            
            // Add CodeceptJS suggestions
            Object.entries(suggestions).forEach(([category, methods]) => {
              methods.forEach(method => {
                items.push({
                  label: method,
                  kind: window.monaco.languages.CompletionItemKind.Function,
                  insertText: method,
                  range,
                  documentation: `CodeceptJS ${category} method`
                });
              });
            });
            
            return { suggestions: items };
          }
        });
        
      } catch (error) {
        console.error('Failed to setup autocomplete:', error);
      }
    },

    handleKeyboardShortcuts(event) {
      // Global shortcuts when editing
      if (this.isEditing) {
        // Escape to cancel
        if (event.key === 'Escape' && !this.isSaving) {
          this.cancelEditing();
          event.preventDefault();
        }
      }
    }
  }
};
</script>

<style scoped>
.ScenarioSource {
  font-size: .9rem;
}

.ScenarioSource pre {
  padding: 1rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
}

.ScenarioSource code {
  overflow: hidden;
}

.source-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.editor-view {
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  background: white;
}

.editor-header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.editor-container {
  height: 400px;
  overflow: hidden;
}

.editor-footer {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .editor-header,
  .editor-footer {
    background: #2b2b2b;
    border-color: #404040;
  }
  
  .editor-view {
    border-color: #404040;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .editor-container {
    height: 300px;
  }
  
  .source-actions {
    flex-direction: column;
  }
  
  .editor-footer .level {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .editor-footer .level-right {
    margin-top: 0.5rem;
  }
}
</style>


