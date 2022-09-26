

function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.UpdateList .clearfix.itemBox').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        aggregate.link = self.children('.itemImg').children('a').attr('href');
        aggregate.title = self.find('.title').first().text();
        aggregate.cover = self.find('img').first().attr('src');
        aggregate.info = self.find('.txtItme').eq(0).text().replace(/\s+/g, '') + '\n';
        aggregate.info += self.find('.txtItme').eq(1).text().replace(/\s+/g, '') + '\n';
        aggregate.info += self.children('.coll').text();
        aggregate.updateTime = self.find('.txtItme').eq(2).text().trim();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}
function tag_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('#comic-items .list-comic').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        aggregate.title = self.children('.txtA').text();
        aggregate.link = self.children('a').first().attr('href');
        aggregate.cover = self.children('a').first().children('img').attr('src');
        aggregate.info = self.children('.info').text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}
function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    var top = $('.Introduct_Sub.autoHeight');
    book.title = top.find('img').first().attr('alt');
    book.cover = top.find('img').first().attr('src');
    book.info = $('#simple-des').text();
    book.updateTime = top.find('.txtItme').eq(3).text().trim();
    var map = new Map();
    $('.comic-chapters').each(function (i, e) {
        var sections = [];
        var self = $(this);
        self.find('li').each(function (j, f) {
            let a = $(this).children('a');
            let title = a.text().replace(/\s+/g, '');
            if (title != "下拉式阅读" && title != "下载App") {
                sections.push({
                    title: title,
                    link: a.attr('href').replace('.html', '-1.html')
                });
            }
        });
        map[self.find('.Title').text()] = sections;
    });
    book.sections = map;
    book.isSectionAsc = 1;
    return JSON.stringify(book);
}

//"buildHeaders": "details_build_headers",
//"parseUrl": "details_parse_url",

function details_build_headers(url) {
    if (url.startsWith('https://m.imitui.com/javascript/auth/')) {
        return 'user-agent:Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1 QQBrowser/6.9.11079.201'
    }
    return '';
}

function details_parse_url(url, html) {
    console.log('当前url ' + url);
    if (url.startsWith('https://m.imitui.com/manhua/')) {
        return 'CALL::https://m.imitui.com/javascript/auth/@@' + url
    } else {
        console.log('分割url ' + url.split('@@'));
        return url.split('@@')[1];
    }
}

function details_parse(url, html) {
    var $ = cheerio.load(html);
    var details = {
        images: [],
        otherPageLink: []
    };


    details.images.push($('#image').attr('src'));

    $('.scroll-item').each(function (e, i) {
        let img = $(this).children('img').attr('data-src');
        if(img != null){
            details.images.push(img);
        }
    });

    details.headers = {
        'referer': url,
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.41 Safari/535.1 QQBrowser/6.9.11079.201'
    };
    console.log(JSON.stringify(details));
    return JSON.stringify(details);
}

function getNodeHost(nodeHosts, path, sum = 256) {
    var a = path.match(/images\/\w\/(.{2})/i);
    var weight = 1;
    if (a !== null && a[1]) {
        weight = parseInt('0x' + a[1], 16)
    }
    var hosts = nodeHosts;
    var total = 0;
    hosts.forEach(function (item) {
        if (typeof item === "string") item = {
            weight: 1,
            value: item
        };
        if (!item.value) return;
        total += item.weight ? item.weight : 1
    });
    total = total > 0 ? total : 1;
    var host = null;
    var w = 0;
    hosts.forEach(function (item) {
        if (host !== null) return;
        if (typeof item === "string") item = {
            weight: 1,
            value: item
        };
        if (!item.value) return;
        w += (item.weight ? item.weight : 1) / total * sum;
        console.log(w);
        if (w > weight) {
            host = item.value
        }
    });
    return host
}

function getI6(nodeHosts, cirh, cih, image) {
    if (image.match(/^(\/r\/?)/i)) {
        return cirh + image
    } else if (image.match(/^(\/p\/?)/i)) {
        return nodeHost + image
    } else if (image.match(/^\/images\/p\//i)) {
        var nh = getNodeHost(nodeHosts, image);
        return nh + image
    } else if (image.match(/^(\/|images?)/i)) {
        return cih + image
    }
    return image
}

