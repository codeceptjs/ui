const { URL } = require('url');
const cheerio = require('cheerio');

const extractBaseUrl = str => {
  const parsed = new URL(str);
  return `${parsed.protocol}//${parsed.host}`;
};

const extractUrlWithPath = str => {
  const parsed = new URL(str);
  const pathname = parsed.pathname && !parsed.pathname.startsWith('/') ? `/${parsed.pathname}` : parsed.pathname;
  return `${parsed.protocol}//${parsed.hostname}${parsed.port ? ':' : ''}${parsed.port ? parsed.port : ''}${pathname}`;
};

const isDataUrl = linkValue => {
  return linkValue.startsWith('data:');
};

const isSameResource = linkValue => {
  return (linkValue[0] !== '/' && !linkValue.startsWith('http'));
};

const isSameDomain = linkValue => {
  return linkValue[0] === '/' && linkValue[1] !== '/';
};

const isSameProtocol = linkValue => {
  return linkValue[0] === '/' && linkValue[1] === '/';
};

const mapAttr = ($, snapshot, attrName) => {
  const parsed = new URL(snapshot.pageUrl);
  const protocolHostPort = extractBaseUrl(snapshot.pageUrl);
  const protocolHostPortPath = extractUrlWithPath(snapshot.pageUrl);

  return function () {
    const linkValue = $(this).attr(attrName);
    if (!linkValue) return;

    if (isDataUrl(linkValue)) {
      return;
    }
    if (isSameResource(linkValue)) {
      $(this).attr(attrName, `${protocolHostPortPath}/${linkValue}`);
    }
    if (isSameDomain(linkValue)) {
      $(this).attr(attrName, `${protocolHostPort}${linkValue}`);
    }
    if (isSameProtocol(linkValue)) {
      $(this).attr(attrName, `${parsed.protocol}${linkValue}`);
    }
  };
};

module.exports = snapshot => {
  // disable script tags
  snapshot.source = snapshot.source || '';
  let $ = cheerio.load(snapshot.source.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''));

  // Convert links
  $('link').map(mapAttr($, snapshot, 'href'));
  $('img').map(mapAttr($, snapshot, 'src'));
  $('script').map(mapAttr($, snapshot, 'src'));

  snapshot.source = $.html();

  return snapshot;
};
