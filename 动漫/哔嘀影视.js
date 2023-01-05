function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.row.row-cards').children('div').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.card-title').text(),
            link: self.find('a').first().attr('href'),
            cover: self.find('img').first().attr('src'),
            info: `评分: ${self.find('.ribbon-bookmark').text()}`,
            updateTime: self.find('.text-muted').text(),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    if (html.indexOf('抱歉，30分钟内首次搜索需要输入验证码。') != -1) {
        return "ERROR:请打开网页输入验证码后再次搜索";
    }
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
        comments:[],
        info: $('.col.mb-2').text().trim(),
        updateTime: $('.mt-1 > .badge').first().text()
    };
    var map = new Map();
    var sections = [];
    $('#play-list').find('a').each(function (i, e) {
        sections.push({
            title: $(this).text(),
            link: $(this).attr('href'),
        });
    });
    map['播放列表'] = sections;
    book.sections = map;
    $('#comment-list').find('.list-group-item').each(function (i, e) {
        let self = $(this);
        book.comments.push({
            nickName: self.find('.author').text(),
            avatar: self.find('.avatar').attr('style').match(/url\((.*?)\)/i)[1],
            content: self.find('.text-muted').last().text(),
            date: self.find('.text-muted').first().text(),
        });
    });
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length == 0) {
        return "ERROR:没有嗅探到资源";
    }
    return JSON.stringify({ mime: "video/*", link: data.resource[0].link });
}