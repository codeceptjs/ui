const {URL} = require('url');

const extractBaseUrl = str => {
    const parsed = new URL(str);
    return `${parsed.protocol}//${parsed.host}${parsed.port ? ':' : ''}${parsed.port ? parsed.port : ''}`;
}
  
const extractUrlWithPath = str => {
    const parsed = new URL(str);
    const pathname = parsed.pathname[parsed.pathname.length - 1] === '/' ? parsed.pathname.slice(1, parsed.pathname.length - 1) : parsed.pathname;
    return `${parsed.protocol}//${parsed.hostname}${parsed.port ? ':' : ''}${parsed.port ? parsed.port : ''}${pathname ? '/' : ''}`;
}

module.exports = snapshot => {
    const parsed = new URL(snapshot.pageUrl);
    const pageBaseUrl = extractBaseUrl(snapshot.pageUrl);
    const pageUrlWithPath = extractUrlWithPath(snapshot.pageUrl);

    // Fix up css and script links
    let processedSource = snapshot.source;

    processedSource = processedSource.replace(/(href="\/\/)/gi, `href="${parsed.protocol}//`); // hrefs starting with //

    processedSource = processedSource.replace(/(href="\/)([^/])/gi, `href="${pageBaseUrl}/$2`); // hrefs starting with /
    processedSource = processedSource.replace(/(src="\/)([^/])/gi, `src="${pageBaseUrl}/$2`);

    // Case: <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
    processedSource = processedSource.replace(/href="([^h][^t][^t][^p][^/]+)/gi, `href="${pageUrlWithPath}/$1`);

    // Disable all script tags
    processedSource = processedSource.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    snapshot.source = processedSource;  

    console.log(processedSource);

    return snapshot;
}