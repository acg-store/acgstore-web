

function home_parse(url, html, headers) {
    let urls = html.split('\n');
    let list = [];
    urls.forEach(key => {
        url = key.split(',');
        list.push({
            title: url[0],
            link: url[1],
            info: url[1],
        });
    });

    return JSON.stringify(list);
}

function search_build_params(url,page,key){
    pref.set({ key: "key", value:key});
}

function search_parse(url, html, headers) {
    let urls = html.split('\n');
    let list = [];
    let key = pref.get('key');
    urls.filter(url => url.indexOf(key.toUpperCase()) != -1).forEach(key => {
        url = key.split(',');
        list.push({
            title: url[0],
            link: url[1],
            info: url[1],
        });
    });

    return JSON.stringify(list);
}

function details_parse(url, html, headers) {
    var details = {
        'mime': 'video/*',
        'link': url,
        'isLive': true,
    };
    return JSON.stringify(details);
}