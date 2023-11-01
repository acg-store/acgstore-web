function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html.replace(/className/i, ''));
    $('.pb-2').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.font-medium').text(),
            link: self.children('a').attr('href').replace(/manga/i, 'chapterlist'),
            cover: self.find('img').first().attr('src') + '@@headers={"protocol":"h2"}',
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

    $('div.flex-col > div.w-full').children('a').each(function (i, e) {
        let time = $(this).find('span').last().text();
        if (time != "") {
            sections.push({
                title: $(this).find('span').first().text(),
                link: $(this).attr('href'),
                updateTime: time,
            });
        }
    });

    book.sections["目录"] = sections;

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {
        images: [],
        headers: {
            referer: this.baseUrl,
        },
    };

    $('.w-full.h-full > img').each(function (e, i) {
        let src = $(this).attr('data-src');
        if (src && src.startsWith('http')) {
            details.images.push(src);
        }
    });

    return JSON.stringify(details);
}