function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.UpdateList').children('div').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').first();
        aggregate.title = self.find('.title').text();
        aggregate.cover = a.children('mip-img').attr('src');
        aggregate.link = a.attr('href');
        aggregate.info = '作者：' + self.find('.txtItme').eq(0).text() + '\n';
        aggregate.info += '类型：' + self.find('.txtItme').eq(1).text().replace(/\s+/g, '');
        aggregate.updateTime = self.find('.txtItme').eq(2).text().trim();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    var top = $('.view-sub.autoHeight');
    book.title = top.find('.mip-fill-content.mip-replaced-content').first().attr('alt');
    book.cover = top.find('.mip-fill-content.mip-replaced-content').first().attr('src');
    book.info = $('.txtDesc.autoHeight').text();
    book.updateTime = top.find('.pic_zi.fs15').eq(3).text().trim();
    var map = new Map();
    $('.comic-chapters').each(function (i, e) {
        var sections = [];
        var self = $(this);
        self.find('li').each(function (j, f) {
            var a = $(this).children('a');
            var section = {};
            section.link = 'https://m.i2356.com' + a.attr('href');
            section.title = a.text().trim();
            sections.push(section);
        });
        map[self.find('.title1_1').text()] = sections;
    });
    book.sections = map;
    book.isSectionAsc = 0;
    return JSON.stringify(book);
}

function details_parse(url, html) {
    var $ = cheerio.load(html);
    var details = {
        images: []
    };
    $('.image-content').children('img').each(function (e, i) {
        let src = $(this).attr('src');
        if (src.startsWith('http')) {
            details.images.push(src);
        } else {
            details.images.push($(this).attr('data-src'));
        }
    });
    $('#scroll-image').find('img').each(function (e, i) {
        let src = $(this).attr('src');
        if (src.startsWith('http')) {
            details.images.push(src);
        } else {
            details.images.push($(this).attr('data-src'));
        }
    });

    return JSON.stringify(details);
}