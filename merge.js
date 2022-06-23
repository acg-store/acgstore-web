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


function listPluginJSON(dirpath) {
    if (fs.existsSync(dirpath)) {
        let files = fs.readdirSync(dirpath);
        return files.filter(f => f != 'index.json' && f.endsWith('.json'));
    }
    return [];
}

function listPluginJS(dirpath) {
    if (fs.existsSync(dirpath)) {
        let files = fs.readdirSync(dirpath);
        return files.filter(f => f.endsWith('.js'));
    }
    return [];
}


function parsePlugin(dirpath) {
    let jsonList = listPluginJSON(dirpath);
    let jsList = listPluginJS(dirpath);

    if (!dirpath.endsWith('/')) {
        dirpath += '/';
    }
    return jsonList.map(e => {
        var site = JSON.parse(fs.readFileSync(dirpath + e));
        try {
            let jsFileName = e.substring(0, e.length - 2);
            if (jsList.indexOf(jsFileName) != -1) {
                var js = fs.readFileSync(dirpath + jsFileName);
                site.script.code = new Buffer.from(js).toString('base64');
                createJSON(dirpath, `/${e}`, site);
            }
        } catch (e) {
            console.error(`合并${site.name}插件出错，${e}`);
            return site;
        }
        return site;
    });
}

function enXor(data) {
    let key = '@';
    let length = data.length;
    var result = [];
    for (var i = 0; i < length; i++) {
        let msgCode = data.charCodeAt(i);
        let keyCode = key.charCodeAt(i % key.length);
        var res = msgCode ^ keyCode;
        result.push(res);
    }
    return String.fromCharCode(...result);
}

function connectDiv(site, link) {
    return `
            <van-grid-item>
                <div class="site-item">
                    <van-image src="${site.logo}" width="48" height="48"></van-image>
                        <h4>${site.name}</h4>
                        <p>${site.author.name}</p>
                        <p>${site.version}</p>
                        <p class="site-info van-multi-ellipsis--l3">${site.info}</p>
                        <p>
                            <van-button type="primary" url="${link}" target="_blank">导入</van-button>
                        </p>
                </div>
            </van-grid-item>`;
}

function createHtml(dirpath, title, data) {
    let html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css" />
</head>

<body>
    <div id="app">
        <van-grid direction="horizontal">
            ${data.join('')}
        </van-grid>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vant@2.12/lib/vant.min.js"></script>
    <script>
    new Vue({
        el: '#app',
        data: {
        },
    })
    Vue.use(vant.Lazyload)
    </script>
    <style type="text/css">
    .site-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 30px;
    }
    </style>
</body>

</html>`;
    writeFileSync(dirpath + '/index.html', html);
}

function createJSON(dirpath, filename, data) {
    writeFileSync(dirpath + filename, JSON.stringify(data));
}

function connectLink(name, version, author, data) {
    return `acg-store://${name}-${version}-${author}￥${encodeURIComponent(new Buffer.from(zlib.gzipSync(enXor(data))).toString('base64'))}`;
}

function mergeSiteJSON(dirpath) {
    let sites = parsePlugin(dirpath);
    createJSON(dirpath, '/index.json', sites);
    return sites;
}

function mergeSiteHtml(dirpath) {
    let sites = parsePlugin(dirpath);
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
    var html = [];
    var json = [];

    dirs.forEach(dir => {
        html.push(...mergeSiteHtml(`./${dir}`));
        json.push(...mergeSiteJSON(`./${dir}`));
    });
    createJSON('./', '/index.json', json);
    console.info('done');
})();