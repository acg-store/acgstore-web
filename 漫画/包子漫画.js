function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);

    $('.comics-card').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('amp-img').first().attr('alt'),
            link: self.children('a').first().attr('href'),
            cover: self.find('amp-img').first().attr('src'),
            info: self.find('small.tags').first().text().trim(),
        });
    });

    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        title: $('.comics-detail__title').text(),
        info: $('.comics-detail__author').text() + $('.supporting-text.mt-2').children('div').last().text().trim()
    };
    var map = new Map();
    var sections = [];
    $('#chapter-items').children('div').each(function (i, e) {
        sections.push({
            title: $(this).children('a').text(),
            link: $(this).children('a').attr('href'),
        });
    });
    if ($('#chapters_other_list') != null) {
        $('#chapters_other_list').children('div').each(function (i, e) {
            sections.push({
                title: $(this).children('a').text(),
                link: $(this).children('a').attr('href'),
            });
        });
    }
    map["目录"] = sections;
    book.sections = map;

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {
        images: []
    };

    $('.comic-contain').children().each(function (e, i) {
        var self = $(this);
        if (self.hasClass('.comic-contain__item')) {
            if (self.hasAttr('src')) {
                details.images.push(self.attr('src'));
            } else {
                details.images.push(self.attr('src'));
            }
        }
    });

    return JSON.stringify(details);
}