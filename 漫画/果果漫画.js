function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.UpdateList').children('div').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').first();
        aggregate.title = self.find('.title').text();
        aggregate.cover = a.children('img').attr('src');
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
    book.title = top.find('img').first().attr('alt');
    book.cover = top.find('img').first().attr('src');
    book.info = $('.txtDesc.autoHeight').text();
    book.updateTime = top.find('.pic_zi.fs15').eq(3).text().trim();
    var map = new Map();
    $('.comic-chapters').each(function (i, e) {
        var sections = [];
        var self = $(this);
        self.find('li').each(function (j, f) {
            var a = $(this).children('a');
            var section = {};
            section.link = a.attr('href');
            section.title = a.text().trim();
            if (section.title != '下拉式阅读') {
                sections.push(section);
            }
        });
        map[self.find('.Title').text()] = sections;
    });
    book.sections = map;
    book.isSectionAsc = 1;
    return JSON.stringify(book);
}

function details_parse(url, html) {
    var $ = cheerio.load(html);
    var details = {
        otherPageLink: [],
        headers: {
            referer: "https://m.guoguomh.com/",
        },
    };
    details.images = [$('#manga-image').attr("src")];

    var num = $('.image-content > p').last().text().split('/')[1];
    console.log(num);

    for (var i = 2; i <= num; i++) {
        details.otherPageLink.push(url.replace('.html', `-${i}.html`));
    }

    return JSON.stringify(details);
}