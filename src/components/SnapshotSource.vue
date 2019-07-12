<template>
    <div class="SnapshotSource">
        <div class="SnapshotSource-mouseInterceptor"></div>
        <iframe id="source" :src="buildSnapshotUrl(stepId)" frameborder="0"></iframe>
    </div>
</template>

<script>
import finder from '@medv/finder';

const getIframeDoc = iframeId => {
    const iframe = document.getElementById(iframeId);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    return {iframe, doc};
}

const findShortSelector = (doc, el) => { 
    try {
        return finder(el, {
            root: doc,
            className: (name) => !name.startsWith('ng-'),
            tagName: (name) => !['div', 'span'].includes(name) && !name.startsWith('ng-'),
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
        console.warn(err);
    }
}

const highlightElement = el => {
    if (!el) return;

    const doc = el.ownerDocument;
    const rect = el.getBoundingClientRect()

    const highlightColor = 'hsl(348, 100%, 61%)';

    var newOutline = doc.createElement('div')
    newOutline.className = 'codepress-outline'
    newOutline.style.position = 'absolute'
    newOutline.style['color'] = 'white';
    newOutline.style['border-radius'] = '2px';
    newOutline.style.border = `2px solid ${highlightColor}`
    newOutline.style['padding'] = '1px';
    newOutline.style['z-index'] = '10000';
    newOutline.style['pointer-events'] = 'none'; // be able to click through this element
    newOutline.style.opacity = 0.2;
    newOutline.style['background-color'] = highlightColor

    newOutline.style.width = rect.width + 'px'
    newOutline.style.height = rect.height + 'px'
    newOutline.style.top = rect.top + window.scrollY + 'px'
    newOutline.style.left = rect.left + window.scrollX + 'px'

    const textContainer = doc.createElement('div');
    textContainer.className = 'codepress-outline'
    textContainer.append(doc.createTextNode(findShortSelector(doc, el)));
    textContainer.style.position = 'absolute';
    textContainer.style['background-color'] = highlightColor;
    textContainer.style.color = 'white';
    textContainer.style.padding = '2px';
    textContainer.style.top = rect.top + window.scrollY + 'px'
    textContainer.style.left = rect.left + window.scrollX + 'px'
    textContainer.style['pointer-events'] = 'none'; // be able to click through this element

    doc.querySelector('body').appendChild(newOutline)
    doc.querySelector('body').appendChild(textContainer)
}

const findByCssOrXPath = (doc, sel) => {
    let els;
    try {
        els = doc.querySelectorAll(sel)
    } catch (err) {
        console.warn(err);
    }

    if (!els || els.length === 0) {
        try {
            let res = doc.evaluate(sel, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
            els = [res.singleNodeValue];
        } catch (err) {
            console.warn(err);
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
        } catch (_) {}
    }

    if (els) {
        els.forEach(el => {
            highlightElement(el);
        })
    }
}

export default {
    name: 'SnapshotSource',
    props: ['stepId', 'highlight'],
    methods: {
        buildSnapshotUrl(stepId) {
            return `/api/snapshots/html/${stepId}`;
        }
    },

    updated() {
        const {iframe, doc} = getIframeDoc('source');
        setTimeout(() => {
            const {doc} = getIframeDoc('source');
            highlightInIframe(doc, this.$props.highlight);
        }, 300);
        iframe.onload = () => {
            highlightInIframe(doc, this.$props.highlight);
        }

        // Intercept mouse events and highlight in iframe
        const mouseInterceptor = document.querySelector('.SnapshotSource-mouseInterceptor');
        mouseInterceptor.addEventListener('mousemove', e => {
            const {doc} = getIframeDoc('source');

            const el = doc.elementFromPoint(e.offsetX, e.offsetY);
            dehighlightAll(doc);
            highlightElement(el);
        });
        mouseInterceptor.addEventListener('mouseout', () => {
            const {doc} = getIframeDoc('source');
            dehighlightAll(doc);
            highlightInIframe(doc, this.$props.highlight);
        })
    }
}
</script>

<style>
.SnapshotSource {
  position: relative; 
  padding-bottom: 75%;
  height: 0; 
  overflow: hidden; 
  width: 100%;
  height: auto;    
}

.SnapshotSource-mouseInterceptor {
    position: absolute;
    top: 0;
    left: 0;
    height: 90%;
    width: 100%;
    z-index: 1000;
}

#source {
    position: absolute;
    top: 0;
    left: 0;
    height: 90%;
    width: 100%;
    border: none;
}
</style>


