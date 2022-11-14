function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.list-li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('img').first().attr('alt'),
            cover: self.find('img').first().attr('data-original'),
            link: self.children('a').attr('href'),
            author: self.children('.module-slide-author > a').text(),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var list = [];
    $('.book-li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.book-title').text(),
            cover: self.find('img').first().attr('data-original'),
            link: self.children('a').attr('href'),
            author: self.find('.book-meta').text(),
        });
    });

    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        info: $('.book-des').text().trim(),
        updateTime: $('.book-rand-a').last().text(),
    };

    var map = new Map();
    var sections = [];
    $('#playlist').find('li').each(function (i, e) {
        sections.push({
            title: $(this).children('a').text().trim(),
            link: $(this).children('a').attr('href'),
        });
    });
    map["目录"] = sections;
    book.sections = map;
    return JSON.stringify(book);
}

function FonHen_JieMa(u) {
    var tArr = u.split("*");
    var str = '';
    for (var i = 1, n = tArr.length; i < n; i++) {
        str += String.fromCharCode(tArr[i]);
    }
    return str;
}

async function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    window.location = {href:url};
    let script = $('head > script').last().text();
    console.log(script);
    eval(script);
    var details = {
        mime: "audio/*",
    };
    console.log(datas[2]);
    if (datas[2] == 'tc') {
        details.link = await f(datas[0]);
    } else {
        details.link = datas[0];
    }


    return JSON.stringify(details);
}

async function f(url) {
    let resp = await fetch("http://43.129.176.64//player/key.php?url=" + url, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "proxy-connection": "keep-alive"
        },
        "referrer": "http://m.tingshubao.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    });
    let data = await resp.json();
    return data.url;
}