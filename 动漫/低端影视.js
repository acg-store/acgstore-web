function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.post-box-list').children('article').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.post-box-title').text().replace(/ \(.*?\)/, ''),
            link: self.find('.post-box-title > a').attr('href'),
            cover: self.find('.post-box-image').attr('style').match(/[a-zA-z]+:\/\/[^\s]*\.jpg|png|webp/)[0],
            info: self.find('.post-box-meta').first().text().trim() + '\n' + self.find('.post-box-text > p').first().text().trim(),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('#main').children('article').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.post-title').text().replace(/ \(.*?\)/, ''),
            link: self.find('.post-title > a').attr('href'),
            info: self.find('.entry-content').text() + '\n' + self.find('.cat-links').text(),
            updateTime: self.find('.meta_date > time').first().text()
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var script = $('.wp-playlist-script').text();

    let play_data = JSON.parse(script);
    var book = {
        info: $('.abstract').text(),
        sectionLink: [],
    };
    var map = new Map();
    var sections = [];
    play_data.tracks.forEach(element => {
        sections.push({
            link: `/getvddr2/video?id=${element.src1}&type=json`,
            title: element.caption,
        })
    });
    if ($('.page-links') != null) {
        $('.page-links').children('a').each(function (i, e) {
            book.sectionLink.push($(this).attr('href'));
        });
    }
    map['第1季'] = sections;
    book.sections = map;

    return JSON.stringify(book);
}

function sections_parse(url, html, headers, lastResult) {
    var $ = cheerio.load(html);
    var script = $('.wp-playlist-script').text();
    let play_data = JSON.parse(script);

    var sections = [];
    play_data.tracks.forEach(element => {
        sections.push({
            link: `/getvddr2/video?id=${element.src1}&type=json`,
            title: element.caption,
        })
    });
    var map = new Map();
    let groupName = url.match(/\/(\d+)\//i)[1]
    map[`第${groupName}季`] = sections;
    return JSON.stringify(map);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.url == null) {
        return "ERROR:没有获取到数据";
    }
    return JSON.stringify({ mime: "video/*", link: data.url });
}