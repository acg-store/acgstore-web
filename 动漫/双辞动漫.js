function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.module-main > .module-poster-items').children('a').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.attr('title'),
            link: self.attr('href'),
            cover: self.find('img').first().attr('data-original'),
            info: self.find('.module-item-douban').text()
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.module-card-item').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('img').first().attr('alt'),
            link: self.children('a').first().attr('href'),
            cover: self.find('img').first().attr('data-original'),
            info: self.find('.module-item-note').first().text()
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        comments: [],
        info: $('.col.mb-2').text().trim(),
        updateTime: $('.mt-1 > .badge').first().text()
    };
    var map = new Map();

    $('.module-tab-item').each(function (i, e) {
        var sections = [];
        $('.module-play-list-content').eq(i).children('a').each(function (i, e) {
            sections.push({
                title: $(this).text(),
                link: $(this).attr('href'),
            });
        });
        map[$(this).children('span').text()] = sections;
    });

    book.sections = map;

    return JSON.stringify(book);
}
function content_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length <= 0) {
        return "ERROR:没有嗅探到资源";
    }
    var link = data.resource[0].link;
    let start = link.indexOf('url=');
    let end = link.indexOf('&next=');
    if (start != -1 && end != -1) {
        link = link.substring(start + 4, end);
    }
    return JSON.stringify({
        mime: "video/*",
        link: link.replace('https://play.nyafun.net/?url=','')
    });
}