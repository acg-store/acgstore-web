

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


    var script = $('script').filter(function (i, e) {
        return $(e).text().trim().startsWith('var imgs');
    });
    console.log(script.text());
    eval(script.text());

    let lrcUrl = Base64.decode(lrc) + lr + "&t=lrc&q=" + domtitle;

    let header = JSON.parse(headers);
    
    let resp = await fetch(lrcUrl, {
        "headers": header.request,
        "method": "GET"
    });
    let lrcStr = await resp.text();

    return JSON.stringify({
        mime: 'audio/*',
        link: link,
        cover: 'https://bkimg.cdn.bcebos.com/pic/72f082025aafa40f4bfb3e49b82d144f78f0f736b344',
        artist: $('.taglist > a').first().text(),
        lrc: lrcStr.replace(/\n/g, '\\n'),
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