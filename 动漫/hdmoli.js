function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.myui-vodlist').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title'),
            link: self.find('a').first().attr('href'),
            cover: self.find('a').first().attr('data-original'),
            info: self.find('p.text').first().text().trim(),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('ul.myui-vodlist__media').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.myui-vodlist__thumb').first().attr('title'),
            link: self.find('.myui-vodlist__thumb').first().attr('href'),
            cover: self.find('.myui-vodlist__thumb').first().attr('data-original'),
            author: self.children('detail > p').eq(0).text(),
            info: self.children('detail > p').eq(3).text(),
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        info: $('p.desc.text-collapse').text(),
    };
    var map = new Map();
    $('ul.nav-tabs').children('li').each(function (i, e) {
        var sections = [];
        $(`#playlist${i + 1}`).find('li').each(function (i, e) {
            sections.push({
                title: $(this).children('a').text(),
                link: $(this).children('a').attr('href'),
            });
        });
        map[$(this).text()] = sections;
    });
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length == 0) {
        return "ERROR:没有嗅探到资源";
    }
    return JSON.stringify({
        mime: "video/*",
        link: data.resource[0].link,
        headers: {
            referer: this.baseUrl,
        }
    });
}