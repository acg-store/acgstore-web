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
            <div class="site-item" >
                <div class="site-top">
                    <van-image round fit="cover" src="${site.logo}" width="60px" height="60px">
                        <template v-slot:error><van-image round fit="cover" src="https://files.catbox.moe/790n4j.png"></van-image></template>
                    </van-image>
                    <div class="site-info">
                        <h4 class="info">${site.name}</h4>
                        <p class="info">${site.author.name}</p>
                        <p class="info">Lv.${site.grade}</p>
                        <p class="info">${site.version}</p>
                    </div>
                </div>
                <p class="site-desc van-multi-ellipsis--l3">${site.info}</p>
                <p>
                    <van-button style="width: 120px" type="primary" ${site.disable ? "disabled" : ""} url="${link}" target="_blank">导入</van-button>
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
    <link rel="stylesheet" href="https://unpkg.com/vant@2.12/lib/index.css" />
</head>

<body>
    <div id="app">
        <van-grid :border="true" :column-num="col">
            ${data.join('')}
        </van-grid>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vant@2.12/lib/vant.min.js"></script>
    <script>
    new Vue({
        el: '#app',
        data() {
                return {
                    col: 2,
                    windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
                    windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
                }
        },
        watch: {
            windowWidth(val) {
                this.setCol();
            }
        },
        mounted() {
            this.setCol();
            var that = this;
            window.onresize = () => {
                return (() => {
                    window.fullHeight = document.documentElement.clientHeight;
                    window.fullWidth = document.documentElement.clientWidth;
                    that.windowHeight = window.fullHeight;
                    that.windowWidth = window.fullWidth;
                })()
            };
        },
        methods:{
            setCol(){

                if(this.windowWidth < 300){
                    this.col = 1;
                }else if(this.windowWidth < 550){
                    this.col = 2;
                }else if(this.windowWidth < 900){
                    this.col = 3;
                }else{
                    this.col = 4;
                }
            }
        }
    })
    Vue.use(vant.Lazyload)
    </script>
    <style type="text/css">
    #app{
        margin-top: 48px; 
    }
    .site-top {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .site-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 8px;
    }

    .info {
        margin: 0px;
    }

    .site-desc{
        margin: 0px 10px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
    }

    .site-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 5px 8px;
        height: 240px;
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