function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.public-list-box').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title'),
            link: self.find('a').first().attr('href'),
            cover: self.find('a').first().children('div').first().attr('data-original'),
            info: self.find('.public-list-subtitle').first().text(),
        });
    });
    return JSON.stringify(list);
}


function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.search-box').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.thumb-txt.cor4').text(),
            link: self.find('.thumb-menu > a').attr('href'),
            cover: self.children('.cover').first().attr('style').match(/url\((.*?)\)/i)[1],
            info: self.find('.thumb-blurb').text()
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        info: $('#height_limit').text(),
    };
    var map = new Map();
    $('.swiper-wrapper').children('a').each(function (i, e) {
        var sections = [];
        $(`.anthology-list-box`).eq(i).find('li').each(function (i, e) {
            sections.push({
                title: $(this).children('a').text(),
                link: $(this).children('a').attr('href'),
            });
        });
        map[$(this).text().trim()] = sections;
    });
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length == 0) {
        return "ERROR:没有嗅探到资源";
    }
    return JSON.stringify({ mime: "video/*", link: data.resource[0].link });
}