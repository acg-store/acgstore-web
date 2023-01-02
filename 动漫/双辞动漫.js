
function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.list-vod').children('div').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title'),
            // 标题
            cover: self.find('div.gen-movie-img').first().attr('data-original'),
            // 封面
            link: self.find('a').first().attr('href'),
            // 链接
            info: self.find('.public-list-subtitle').text(),
            // 简介 
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
            title: self.find('.thumb-txt').first().text().trim(),
            // 标题
            cover: self.find('div.gen-movie-img').first().attr('data-original'),
            // 封面
            link: self.find('a').first().attr('href'),
            // 链接
            info: self.find('.thumb-blurb').first().text(),
        });
    });
    return JSON.stringify(list);
}
function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {
        info: $('#height_limit').text(),
        // 简介
    }
    // 目录结构 {"目录1":[{title:"章节1",link:"link1"}],"目录2":[{title:"章节1",link:"link1"}]}
    var map = new Map();
    $('.anthology-tab').find('.swiper-slide').each(function (i, e) {
        var sections = [];
        var self = $(this);
        $('.anthology-list-play').eq(i).find('a').each(function (j, f) {
            sections.push({
                link: $(this).attr('href'),
                // 章节链接
                title: $(this).text().trim(),
                // 章节标题
            });
        });
        map[`播放地址-${i + 1}`] = sections;
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