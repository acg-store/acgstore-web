function getHost() {
    var host = pref.get('线路地址');
    if (!host) {
        host = 'copymanga.site';
    }else{
        host = host.replace(/https?:\/\//, '');
    }
    return host;
}

function wrapImage(image) {
    return `${image}@@headers={"referer":"${this.baseUrl}","user-agent":"USER_AGENT","protocol":"h2"}`;
}

function home_build_url(url, page) {
    let host = getHost();
    return `https://api.${host}/api/v3/ranks?type=1&date_type=day&offset=` + (page * 21) + "&limit=21&_update=true";
}
function search_build_url(url, page, key) {
    let host = getHost();
    return `https://api.${host}/api/v3/search/comic?platform=1&q=` + encodeURI(key) + "&limit=20&offset=" + (page * 20) + "&_update=true";
}
function tag_build_url(url, page, key) {
    let host = getHost();
    var offset = page * 21;
    var prefix = `https://api.${host}/api/v3/comics?free_type=1&limit=21&offset=` + offset;
    switch (key) {
        case "最近更新":
            return prefix + "&ordering=-datetime_updated&_update=true";
        case "爱情":
            return prefix + "&theme=aiqing&ordering=-datetime_updated&_update=true";
        case "欢乐向":
            return prefix + "&theme=huanlexiang&ordering=-datetime_updated&_update=true";
        case "冒险":
            return prefix + "&theme=maoxian&ordering=-datetime_updated&_update=true";
        case "东方":
            return prefix + "&theme=dongfang&ordering=-datetime_updated&_update=true";
        case "百合":
            return prefix + "&theme=baihe&ordering=-datetime_updated&_update=true";
        case "校园":
            return prefix + "&theme=xiaoyuan&ordering=-datetime_updated&_update=true";
        case "奇幻":
            return prefix + "&theme=qihuan&ordering=-datetime_updated&_update=true";
        case "科幻":
            return prefix + "&theme=kehuan&ordering=-datetime_updated&_update=true";
        case "生活":
            return prefix + "&theme=shenghuo&ordering=-datetime_updated&_update=true";
        case "神鬼":
            return prefix + "&theme=shengui&ordering=-datetime_updated&_update=true";
    }
}

function home_parse(url, html) {
    var data = JSON.parse(html);
    let host = getHost();
    if (data && data.code == 200) {
        var list = data.results.list.map((comic) => {
            return {
                title: comic.comic.name,
                cover: wrapImage(comic.comic.cover),
                link: `https://api.${host}/api/v3/comic2/` + comic.comic.path_word + '?platform=1',
            }
        });
        return JSON.stringify(list);
    } else {
        throw '数据获取失败';
    }
}

function search_parse(url, html) {
    var data = JSON.parse(html);
    let host = getHost();
    if (data && data.code == 200) {
        var list = data.results.list.map((comic) => {
            return {
                title: comic.name,
                cover: wrapImage(comic.cover),
                link: `https://api.${host}/api/v3/comic2/` + comic.path_word + '?platform=1',
                info: '原名：' + comic.orig_name + '\n' + '状态：' + comic.status
            }
        });
        return JSON.stringify(list);
    } else {
        throw '数据获取失败';
    }
}

function tag_parse(url, html) {
    var data = JSON.parse(html);
    let host = getHost();
    if (data && data.code == 200) {
        var list = data.results.list.map((comic) => {
            return {
                title: comic.name,
                cover: wrapImage(comic.cover),
                link: `https://api.${host}/api/v3/comic2/` + comic.path_word + '?platform=1',
                info: '更新时间' + comic.datetime_updated
            }
        });
        return JSON.stringify(list);
    } else {
        throw '数据获取失败';
    }
}

function book_parse(url, html) {
    var data = JSON.parse(html);
    let host = getHost();
    if (data && data.code == 200) {
        var sectionLink = [];
        for (var p in data.results.groups) {
            sectionLink.push(`https://api.${host}/api/v3/comic/` + data.results.comic.path_word + '/group/' + data.results.groups[p].path_word + '/chapters?limit=500&offset=0');
        }
        return JSON.stringify({
            title: data.results.comic.name,
            cover: wrapImage(data.results.comic.cover),
            info: data.results.comic.brief,
            updateTime: data.results.comic.datetime_updated,
            sectionLink: sectionLink,
            isSectionAsc: 1
        });
    } else {
        throw '数据获取失败';
    }
}

function sections_parse(url, html) {
    var data = JSON.parse(html);
    let host = getHost();
    if (data && data.code == 200) {
        var groupName = '目录';
        var list = data.results.list.map((chapter) => {
            groupName = chapter.group_path_word;

            return {
                title: chapter.name,
                link: `https://api.${host}/api/v3/comic/` + chapter.comic_path_word + '/chapter/' + chapter.uuid + '?platform=1&_update=true'
            }
        });
        var map = new Map();
        map[groupName] = list;
        return JSON.stringify(map);
    } else {
        throw '数据获取失败';
    }
}

function details_parse(url, html) {
    var data = JSON.parse(html);
    if (data && data.code == 200) {
        var list = data.results.chapter.contents.map((content) => {
            return wrapImage(content.url);
        });
        return JSON.stringify({ images: list });
    } else {
        throw '数据获取失败';
    }
}