

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.list > li').each(function (i, e) {
        list.push({
            title: $(this).children('a').text(),
            info: $(this).children('span').text(),
            link: `https://www.musicenc.com/searchr/?token=${$(this).children('a').attr('dates')}`,
        })
    });
    return JSON.stringify(list);
}

async function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var link = $('.downbutt > a').attr('href');

    if (link.startsWith('http')) {
        link = await f(link);
    } else {
        link = Base64.decode(link.match(/tps\('(.*?)'\)/i)[1]);
    }


    return JSON.stringify({
        mime: 'audio/*',
        link: link,
        artist: $('.taglist > a').first().text(),
    });

}

async function f(link) {
    let resp = await fetch(link, {
        "headers": { "referer": link },
        "method": "GET"
    });
    let html = await resp.text();
    let $ = cheerio.load(html);
    var script = $('script').filter(function (i, e) {
        return $(e).text().trim().startsWith('var imgs');
    });

    eval(script.text());
    let mp3Link = Base64.decode(pics);

    let mp3Resp = await fetch(mp3Link, {
        "headers": { "referer": link },
        "method": "GET"
    });
    return mp3Resp.text();
}