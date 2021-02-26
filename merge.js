const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dirs = ['漫画', '动漫', '阅读', '有声'];

function mkdirs(dirpath) {
    if (fs.existsSync(dirpath)) return;
    if (!fs.existsSync(path.dirname(dirpath))) {
        mkdirs(path.dirname(dirpath));
    }
    fs.mkdirSync(dirpath);
}

function writeFileSync(nodePath, data) {
    const dirPath = path.dirname(nodePath);
    if (!fs.existsSync(dirPath)) mkdirs(dirPath);
    fs.writeFileSync(nodePath, data);
}


function listOtaku(dirpath) {
    if (fs.existsSync(dirpath)) {
        let files = fs.readdirSync(dirpath);
        return files.filter(f => f.endsWith('.otaku'));
    }
    return [];
}

function parseOtaku(dirpath) {
    let list = listOtaku(dirpath);
    if (!dirpath.endsWith('/')) {
        dirpath += '/';
    }
    return list.map(e => JSON.parse(fs.readFileSync(dirpath + e)));
}

function connectDiv(site, link) {
    return `
<div>
    <p>
        <a href='${link}' target='_blank'>${site.name}-${site.version}</a>
    </p>
    <p>${site.info}</p>
</div>`;
}

function createHtml(dirpath, title, data) {
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">
    <title>${title}-合集</title>
</head>
<body">
    ${data.join('')}
</body>
</html>`;
    writeFileSync(dirpath + '/index.html', html);
}

function connectLink(name, version, author, data) {
    return `otaku://${name}-${version}-${author}@@${new Buffer.from(zlib.gzipSync(data)).toString('base64')}`;
}

function mergeSite(dirpath) {
    let sites = parseOtaku(dirpath);
    let list = [];
    sites.forEach(site => {
        var data = JSON.stringify(site);
        var author = site.author;
        if (site.data == null) {
            author = site.author.name;
        }
        let link = connectLink(site.name, site.version, author, data);
        link = connectDiv(site, link);
        list.push(link);
    });
    createHtml(dirpath, dirpath.substring(dirpath.length - 2), list);
    return list;
}

(async => {
    var total = [];
    dirs.forEach(dir => {
        total.push(...mergeSite(`./${dir}`));
    });
    createHtml('./', "ACG Store", total);
    console.log('done');
})();