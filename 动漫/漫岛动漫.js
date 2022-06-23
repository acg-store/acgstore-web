function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.index-tj > ul').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.children('a').first().attr('title'),
            link: self.children('a').first().attr('href'),
            cover: self.find('img').first().attr('data-original'),
            info: self.find('.bz').first().text(),
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        info: $('.des2').text(),
        updateTime: $('.m-yc360').text(),
    };
    var map = new Map();
    $('.pfrom.tab1.clearfix > ul').children('li').each(function (i, e) {
        if ($(this).attr('id') != null) {
            var sections = [];
            $(`#stab1${i + 1}`).find('li').each(function (i, e) {
                if ($(this).children('a') != null && $(this).children('a').text() != '') {
                    sections.push({
                        title: $(this).children('a').text(),
                        link: $(this).children('a').attr('href'),
                    });
                }
            });
            map[$(this).text()] = sections;
        }
    });
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length == 0) {
        return "ERROR:没有嗅探到资源";
    }
    return JSON.stringify({ mime: "video/*", link: data.resource[0].link.replace('https://mmcss.mandao.tv/boo/mppm.php?url=', '') });
}