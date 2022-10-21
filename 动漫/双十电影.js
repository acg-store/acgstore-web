function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.stui-vodlist').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title'),
            link: self.find('a').first().attr('href'),
            cover: self.find('a').first().attr('data-original'),
            info: self.find('span.pic-text').first().text().trim() +'\n'+ self.find('p.text').first().text().trim(),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('ul.stui-vodlist__media').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.stui-vodlist__thumb').first().attr('title'),
            link: self.find('.stui-vodlist__thumb').first().attr('href'),
            cover: self.find('.stui-vodlist__thumb').first().attr('data-original'),
            info: self.find('span.pic-text').text(),
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        info: $('p.col-pd').text(),
    };
    var map = new Map();
    $('div.playlist').each(function (i, e) {
        var sections = [];
        $(this).find('ul.stui-content__playlist > li').each(function (i, e) {
            sections.push({
                title: $(this).children('a').text(),
                link: $(this).children('a').attr('href'),
            });
        });
        map[$(this).find('h3.title').text()] = sections;
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