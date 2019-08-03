<template>
    <div class="SnapshotSource">
        <div class="SnapshotSource-mouseInterceptor"></div>
        <iframe id="source" :src="buildSnapshotUrl(snapshotId)" :width="viewportSize.width" frameborder="0"></iframe>
    </div>
</template>

<script>
import finder from '@medv/finder';
import copy from 'copy-text-to-clipboard';

const throttled = (delay, fn) => {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

const getIframeDoc = iframeId => {
    const iframe = document.getElementById(iframeId);
    if (!iframe) return;
    const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
    return {iframe, doc, contentWindow: iframe.contentWindow};
}

const findShortSelector = (doc, el) => { 
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
}

const dehighlightAll = doc => {
    try {
        const oldOutlines = doc.querySelectorAll('.codepress-outline')
        oldOutlines.forEach(ol => ol.remove())
    } catch (err) {
        // eslint-disable-next-line
        // console.warn(err);
    }
}

const highlightElement = el => {
    if (!el) return;

    const doc = el.ownerDocument;
    const rect = el.getBoundingClientRect()

    const shortestSelector = findShortSelector(doc, el);

    const highlightColor = 'hsl(348, 100%, 61%)';

    var newOutline = doc.createElement('div')
    newOutline.className = 'codepress-outline'
    newOutline.style.position = 'absolute'
    newOutline.style['color'] = 'white';
    newOutline.style['border-radius'] = '2px';
    newOutline.style.border = `2px solid ${highlightColor}`
    newOutline.style['padding'] = '1px';
    newOutline.style['z-index'] = '999999999';
    newOutline.style['pointer-events'] = 'none'; // be able to click through this element
    newOutline.style.opacity = 0.2;
    newOutline.style['background-color'] = highlightColor

    newOutline.style.width = rect.width + 'px'
    newOutline.style.height = rect.height + 'px'
    newOutline.style.top = rect.top + window.scrollY + 'px'
    newOutline.style.left = rect.left + window.scrollX + 'px'

    const textContainer = doc.createElement('div');
    textContainer.className = 'codepress-outline'
    textContainer.append(doc.createTextNode(shortestSelector));
    textContainer.style.position = 'absolute';
    textContainer.style['font-size'] = '.8em';
    textContainer.style['background-color'] = highlightColor;
    textContainer.style.color = 'white';
    textContainer.style.padding = '2px';
    textContainer.style.top = rect.top + window.scrollY + 'px'
    textContainer.style.left = rect.left + window.scrollX + 'px'
    textContainer.style['pointer-events'] = 'none'; // be able to click through this element
    textContainer.style['z-index'] = '999999999';

    doc.querySelector('body').appendChild(newOutline)
    doc.querySelector('body').appendChild(textContainer)

    return shortestSelector;
}

const findByCssOrXPath = (doc, sel) => {
    let els;
    try {
        els = doc.querySelectorAll(sel)
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
}

const highlightInIframe = (doc, sel) => {
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
            highlightElement(el);
        })
    }
}

export default {
    name: 'SnapshotSource',
    props: ['snapshotId', 'snapshotScrollPosition', 'viewportSize', 'highlight'],
    methods: {
        buildSnapshotUrl(snapshotId) {
            return `/api/snapshots/html/${snapshotId}`;
        }
    },

    updated() {
        const {iframe, doc, contentWindow} = getIframeDoc('source');
        setTimeout(() => {
            const {doc} = getIframeDoc('source');
            highlightInIframe(doc, this.$props.highlight);
        }, 300);
        iframe.onload = () => {
            if (contentWindow) {
                contentWindow.scrollTo(this.$props.snapshotScrollPosition.x, this.$props.snapshotScrollPosition);
            }
            highlightInIframe(doc, this.$props.highlight);
        }

        // Intercept mouse events and highlight in iframe
        const mouseInterceptor = document.querySelector('.SnapshotSource-mouseInterceptor');
        mouseInterceptor.addEventListener('mousemove', throttled(200, e => {
            const {doc} = getIframeDoc('source');

            const el = doc.elementFromPoint(e.offsetX, e.offsetY);
            dehighlightAll(doc);
            highlightElement(el);
        }));
        mouseInterceptor.addEventListener('click', e => {
            const {doc} = getIframeDoc('source');

            const el = doc.elementFromPoint(e.offsetX, e.offsetY);
            const shortestSelector = highlightElement(el);
            copy(shortestSelector);
        });
        mouseInterceptor.addEventListener('mouseout', throttled(500, () => {
            const {doc} = getIframeDoc('source');
            dehighlightAll(doc);
            highlightInIframe(doc, this.$props.highlight); // highlight step locator again
        }));
    }
}
</script>

<style>
.SnapshotSource {
  position: relative; 
  padding-bottom: 75%;
  height: 0; 
  overflow: hidden; 
  max-width: 100%;
  height: auto;    
}

.SnapshotSource-mouseInterceptor {
    position: absolute;
    top: 0;
    left: 0;
    height: 90%;
    width: 100%;
    z-index: 9999999999;
}

#source {
    position: absolute;
    top: 0;
    left: 0;
    height: 90%;
    max-width: 100%;
    border: none;
}
</style>


