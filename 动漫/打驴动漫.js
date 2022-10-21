function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.hl-rank-list').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.children('a').first().attr('title'),
            link: self.children('a').first().attr('href'),
            cover: self.find('.hl-item-thumb').first().attr('data-original'),
            info: self.find('.hl-text-subs').first().text().replace('/',''),
            updateTime: self.find('.hl-item-time span').first().text(),
        });
    });
    return JSON.stringify(list);
}

function tag_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('ul.hl-vod-list').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.children('.hl-item-thumb').first().attr('title'),
            link: self.children('.hl-item-thumb').first().attr('href'),
            cover: self.children('.hl-item-thumb').first().attr('data-original'),
            info: self.find('.hl-item-text > .hl-item-sub').text()
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('ul.hl-one-list').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.hl-item-thumb').first().attr('title'),
            link: self.find('.hl-item-thumb').first().attr('href'),
            cover: self.find('.hl-item-thumb').first().attr('data-original'),
            info: self.find('.hl-item-content > p').eq(2).text()
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        title: $('.hl-dc-title').text(),
        cover: $('.hl-item-thumb').attr('data-original'),
        info: xpath.query1('//*[@id="conch-content"]/div[1]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/div[2]/ul/li[12]/text()',html),
        updateTime: xpath.query1('//*[@id="conch-content"]/div[1]/div/div/div/div[1]/div/div[2]/div[2]/div[1]/div[2]/ul/li[11]/text()',html),
    };
    var map = new Map();
    $('.hl-plays-from').children('a').each(function (i, e) {
        var sections = [];
        $(`.hl-tabs-box`).eq(i).find('li').each(function (i, e) {
            sections.push({
                title: $(this).children('a').text(),
                link: $(this).children('a').attr('href'),
            });
        });
        map[$(this).attr('alt')] = sections;
    });
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length == 0) {
        return "ERROR:没有嗅探到资源";
    }
    return JSON.stringify({ mime: "video/*", link: data.resource[0].link});
}