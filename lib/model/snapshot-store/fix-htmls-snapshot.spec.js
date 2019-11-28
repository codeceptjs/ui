const test = require('ava');
const fixHtmlSnapshot = require('./fix-html-snapshot');

const makeHtml = snippet => {
  return `<html><head>${snippet}</head><body></body></html>`;
};

test('Relative Url: same resource', (t) => {
  const pageUrl = 'http://foo/some/path';
  const fixedSnapshot = fixHtmlSnapshot({
    pageUrl,
    source: makeHtml('<link rel="stylesheet" href="node_modules/todomvc-common/base.css">')
  });
  t.is(fixedSnapshot.source, makeHtml('<link rel="stylesheet" href="http://foo/some/path/node_modules/todomvc-common/base.css">'));
});

test('Relative Url: same protocol', (t) => {
  const pageUrl = 'http://www.check24-test.de';
  const fixedSnapshot = fixHtmlSnapshot({
    pageUrl,
    source: makeHtml('<link rel="stylesheet" href="//www.check24-test.de/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b">')
  });
  t.is(fixedSnapshot.source, makeHtml('<link rel="stylesheet" href="http://www.check24-test.de/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b">'));
});

test('Relative Url: same domain', (t) => {
  const pageUrl = 'http://foo:1234';
  const fixedSnapshot = fixHtmlSnapshot({
    pageUrl,
    source: makeHtml('<link rel="stylesheet" href="/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b">')
  });
  t.is(fixedSnapshot.source, makeHtml('<link rel="stylesheet" href="http://foo:1234/versicherungsordner/vertraege/ueberblick/app.css?v=0b33e70097c27112a29b">'));
});

test('script tags are removed', (t) => {
  const pageUrl = 'http://foo:1234';
  const fixedSnapshot = fixHtmlSnapshot({
    pageUrl,
    source: makeHtml('<script src="test"></script>')
  });
  t.is(fixedSnapshot.source, makeHtml(''));
});