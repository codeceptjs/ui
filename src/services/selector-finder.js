import finder from '@medv/finder';


const findByCssOrXPath = (doc, sel) => {
  let els;
  try {
    els = doc.querySelectorAll(sel);
  } catch (err) {
    // eslint-disable-next-line
      // console.warn(err);
  }

  if (!els || els.length === 0) {
    try {
      let res = doc.evaluate(sel, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
      els = [res.singleNodeValue];
    } catch (err) {
      // eslint-disable-next-line
          // console.warn(err);
    }
  }

  return els;
};

export const highlightInIframe = (doc, win, sel) => {
  let els = findByCssOrXPath(doc, sel);

  if (!els || els.length === 0) {
    try {
      let res = doc.evaluate(`//*[contains(text(),'${sel}')]`, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
      els = [res.singleNodeValue];
    } catch (err) {
      // eslint-disable-next-line
          // console.warn(err);
    }
  }

  if (els) {
    els.forEach(el => {
      highlightElement(el, doc, win);
    });
  }
};

export const findShortSelector = (doc, el) => { 
  try {
    return finder(el, {
      root: doc,
      className: (name) => !name.startsWith('ng-') && !name.startsWith('css-'),
      tagName: (name) => !['div', 'span'].includes(name) && !name.startsWith('ng-'),
      attr: (name) => ['title', 'name', 'data-test', 'placeholder'].includes(name),
      seedMinLength: 1,
      optimizedMinLength: 2,
      threshold: 1000
    });
  } catch(_) {
    return '';
  }
};

export const dehighlightAll = doc => {
  try {
    const oldOutlines = doc.querySelectorAll('.codepress-outline');
    oldOutlines.forEach(ol => ol.remove());
  } catch (err) {
    // eslint-disable-next-line
      // console.warn(err);
  }
};

export const highlightElement = (el, doc, win) => {
  if (!el) return;
  if (!doc) return;
  if (!win) return;

  const rect = el.getBoundingClientRect();

  const shortestSelector = findShortSelector(doc, el);

  const highlightColor = 'hsl(348, 100%, 61%)';

  var newOutline = doc.createElement('div');
  newOutline.className = 'codepress-outline';
  newOutline.style.position = 'absolute';
  newOutline.style['z-index'] = '9999999999';
  newOutline.style['color'] = 'white';
  //   newOutline.style['border-radius'] = '2px';
  //   newOutline.style.border = `2px solid ${highlightColor}`
  //   newOutline.style['padding'] = '1px';
  newOutline.style['pointer-events'] = 'none'; // be able to click through this element
  newOutline.style.opacity = 0.2;
  newOutline.style['background-color'] = highlightColor;

  newOutline.style.width = rect.width + 'px';
  newOutline.style.height = rect.height + 'px';
  newOutline.style.top = rect.top + win.pageYOffset + 'px';
  newOutline.style.left = rect.left + win.pageXOffset + 'px';

  const textContainer = doc.createElement('div');
  textContainer.className = 'codepress-outline';
  textContainer.append(doc.createTextNode(shortestSelector));
  textContainer.style.position = 'absolute';
  textContainer.style['z-index'] = '9999999999';
  textContainer.style['pointer-events'] = 'none'; // be able to click through this element
  textContainer.style['font-size'] = '.8em';
  textContainer.style['background-color'] = highlightColor;
  textContainer.style.color = 'white';
  textContainer.style.padding = '2px';
  textContainer.style.top = rect.top + win.pageYOffset + 'px';
  textContainer.style.left = rect.left + win.pageXOffset + 'px';

  const docBody = doc.querySelector('body');
  docBody.appendChild(newOutline);
  docBody.appendChild(textContainer);

  return shortestSelector;
};

// export default {
//   highlightElement,
//   dehighlightAll,
//   highlightInIframe,
//   findShortSelector,
// }