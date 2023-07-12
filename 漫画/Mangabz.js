
function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.mh-item').each(function (e, i) {
        list.push({
            title: $(this).find('.title').text(),
            cover: $(this).find('img').attr('src'),
            link: $(this).children('a').first().attr('href'),
        });
    });
    return JSON.stringify(list);
}
function tag_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.mh-list').children('li').each(function (e, i) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').first();
        aggregate.title = self.find('.title').text().replace(/\s+/g, '');
        aggregate.cover = a.children('img').first().attr('src');
        aggregate.link = 'http://mangabz.com' + a.attr('href');
        aggregate.info = self.find('.chapter').text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    var top = $('.detail-info');
    book.cover = top.children('img').attr('src');
    book.title = top.children('.detail-info-title').text().replace(/\s+/g, '');
    book.info = $('.detail-info-tip').text();
    book.info += $('.detail-info-content').text();
    book.info = book.info.replace(/\s+/g, '');
    var map = new Map();
    var sections = [];
    $('.detail-list-form-con').children('.detail-list-form-item').each(function (i, e) {
        var self = $(this);
        var section = {};
        section.title = self.text().replace(/\s+/g, '');
        section.link = 'http://mangabz.com' + self.attr('href');
        sections.push(section);
    });
    map['章节列表'] = sections;
    book.isSectionAsc = 0;
    book.sections = map;
    return JSON.stringify(book);
}

function details_build_ref(url) {
    return url;
}


function details_parse(url, html) {
    if (url.indexOf('chapterimage.ashx') != -1) {
        var arry;
        eval(html);
        arry = d;
        var details = {};
        details.images = [];
        details.headers = { "Referer": "https://www.mangabz.com/" }
        console.log(arry[0]);
        details.images.push(arry[0]);
        return JSON.stringify(details);
    } else {
        var $ = cheerio.load(html);
        var script = $('head').children('script').last().text();
        script = script.substring(0, script.lastIndexOf('reseturl('))
        eval(script);
        var details = {
            headers: { "Referer": "https://www.mangabz.com/", "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36" }
        };
        details.otherPageLink = [];
        var dt_list = MANGABZ_VIEWSIGN_DT.split(' ');
        var date = dt_list[0];
        var time = escape(dt_list[1]);
        var real_dt = date + '+' + time;
        details.images = [];
        for (var i = 1; i <= MANGABZ_IMAGE_COUNT; i++) {
            var link = 'https://www.mangabz.com' + MANGABZ_CURL + 'chapterimage.ashx?cid=' + MANGABZ_CID + '&page=' + i + '&key=&_cid=' + MANGABZ_CID + '&_mid=' + MANGABZ_MID + '&_dt=' + real_dt + '&_sign=' + MANGABZ_VIEWSIGN;
            details.otherPageLink.push(link);
        }
        return JSON.stringify(details);
    }
}