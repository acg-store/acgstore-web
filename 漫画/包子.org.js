function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('article.dynamic-content-template > .inside-article').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('img').first().attr('alt'),
            link: self.find('a').first().attr('href').replace(/manga/i, 'chapterlist'),
            cover: self.find('img').first().attr('data-src'),
        });
    });

    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        sections: {},
        isSectionAsc: 0,
    };
    var sections = [];

    $('ul.main').children('a').each(function (i, e) {
        let time = $(this).children('span').text();
        sections.push({
            title: $(this).text().replace(time, ''),
            link: $(this).attr('href'),
            updateTime: time,
        });
    });

    book.sections["目录"] = sections;

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {
        images: [],
        headers: {
            referer: 'https://baozimh.org/',
        },
    };

    $('img.lazyload').each(function (e, i) {
        var self = $(this);
        details.images.push(self.attr('data-src'));
    });

    return JSON.stringify(details);
}