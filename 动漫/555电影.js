function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.module-poster-items > .module-item').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.attr('title'),
            link: self.attr('href'),
            cover: self.find('img').first().attr('data-original'),
            info: self.find('.module-item-note').first().text(),
        });
    });

    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    if (html.indexOf('完成验证后展示搜索结果') != -1) {
        return "ERROR:请打开网页跳过网站验证后刷新";
    }
    var list = [];
    let $ = cheerio.load(html);
    console.log(html);
    $('.module-items > .module-item').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.module-card-item-title').text(),
            link: self.find('.module-card-item-title').children('a').attr('href'),
            cover: self.find('img').first().attr('data-original'),
            info: self.find('.module-item-note').first().text(),
        });
    });

    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        title: $('.title').first().text(),
        info: $('span.data').text(),
        updateTime: $('p.data > span.text-red').text(),
    };
    var map = new Map();
    $('.module-tab-items-box > .module-tab-item').each(function (i, e) {
        var sections = [];
        console.log(i);
        $(`#panel1`).eq(i).find('.module-play-list-content').each(function (i, e) {
            $(this).children('a').each(function (i, e) {
                sections.push({
                    title: $(this).text(),
                    link: $(this).attr('href'),
                });
            });

        });
        map[$(this).children('span').text()] = sections;
    });
    book.sections = map;
    console.log(JSON.stringify(book));
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    console.log(url);
    console.log(html);
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length <= 0) {
        throw "没有嗅探到资源";
    }
    return JSON.stringify({ mime: "video/*", link: data.resource[0].link });
}