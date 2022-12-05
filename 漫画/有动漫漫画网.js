function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);

    $('.stui-vodlist > li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title'),
            link: self.find('a').first().attr('href'),
            cover: self.find('a').first().attr('data-original')
        });
    });

    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        title: $('h1.title').text(),
        author: $('div.stui-content__detail > p:nth-child(3) > a').text(),
        info: $('.detail-content').text().trim(),
        isSectionAsc: 0,
    };
    var map = new Map();
    var sections = [];

    $('.stui-content__playlist > li').each(function (i, e) {
        sections.push({
            title: $(this).find('a').text(),
            link: $(this).find('a').attr('href'),
        });
    });

    map["目录"] = sections;
    book.sections = map;

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {
        images: [],
    };

    $('.stui-player__video').find('img').each(function (i, e) {
        var self = $(this);
        details.images.push(self.attr('src'));
    });

    return JSON.stringify(details);
}