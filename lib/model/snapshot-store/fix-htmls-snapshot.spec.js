const test = require('ava');
const fixHtmlSnapshot = require('./fix-html-snapshot');

test('fix relative links', (t) => {
    const pageUrl = 'http://foo';
    const fixedSnapshot = fixHtmlSnapshot({
        pageUrl,
        source: '<link rel="stylesheet" href="node_modules/todomvc-common/base.css">'
    });
    t.is(fixedSnapshot.source, '<link rel="stylesheet" href="http://foo/node_modules/todomvc-common/base.css">')
})

test('fix // links (protocol relative urls)', (t) => {
    const pageUrl = 'http://www.check24-test.de';
    const fixedSnapshot = fixHtmlSnapshot({
        pageUrl,
        source: '<link rel="stylesheet" href="//www.check24-test.de/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b" media="all" rel="stylesheet">'
    });
    t.is(fixedSnapshot.source, '<link rel="stylesheet" href="http://www.check24-test.de/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b" media="all" rel="stylesheet">')
});

test('fix / links (relative urls)', (t) => {
    const pageUrl = 'http://www.check24-test.de';
    const fixedSnapshot = fixHtmlSnapshot({
        pageUrl,
        source: '<link rel="stylesheet" href="/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b" media="all" rel="stylesheet">'
    });
    t.is(fixedSnapshot.source, '<link rel="stylesheet" href="http://www.check24-test.de/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b" media="all" rel="stylesheet">')
});