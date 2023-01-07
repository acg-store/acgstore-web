function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.stui-vodlist').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title'),
            link: self.find('a').first().attr('href'),
            cover: self.find('a').first().attr('data-original'),
            info: self.find('.pic-text').text(),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.row.row-cards').children('div').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a.alert-title').first().attr('title'),
            link: self.find('a').first().attr('href'),
            cover: self.find('img').first().attr('src'),
            info: self.find('.text-truncate-sm').last().text()
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        info: $('.detail-content').text().trim(),
        updateTime: $('div.stui-content__detail > p:nth-child(8)').text()
    };
    var map = new Map();
    $('.stui-vodlist__head').each(function (i, e) {
        let group = $(this).children('.pull-right1').text();
        if (group) {
            var sections = [];
            $(this).find('li').each(function (i, e) {
                sections.push({
                    title: $(this).children('a').text(),
                    link: $(this).children('a').attr('href'),
                });
            });
            map[group] = sections;
        }
    });
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var script = $('script').filter(function (i, e) {
        return $(e).text().trim().startsWith('var player_data');
    });
    let code = script.text();
    eval(code);
    if (!player_data) {
        return "ERROR:获取资源失败";
    }
    return JSON.stringify({ mime: "video/*", link: player_data.url });
}