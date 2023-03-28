function home_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var list = [];
    $('.l').last().find('li').each(function (i, e) {
        list.push({
            title: $(this).find('a').first().text(),
            link: $(this).find('a').first().attr('href'),
            info: $(this).children('.s4').text() + '\n' + $(this).children('.s1').text() + '\n' + $(this).children('.s3').text(),
            updateTime: $(this).children('.s5').text()
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var list = [];
    $('.result-item').each(function (i, e) {
        list.push({
            title: $(this).find('img').first().attr('alt').trim(),
            link: $(this).find('a').last().attr('href'),
            info: $(this).find('.result-game-item-desc').last().text().trim(),
            newest: $(this).find('.result-game-item-info-tag-item').last().text(),
            updateTime: $(this).find('.result-game-item-info-tag').eq(2).text()
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);
    let top = $('.box_con');
    var book = {
        cover: this.baseUrl + top.find('#fmimg').children('img').attr('src'),
        referer: url,
        info: top.find('#intro').text().trim(),
        updateTime: top.find('#info').children('p').eq(2).text(),
    };

    var map = new Map();
    var sections = [];
    $('#list').find('dd').each(function (i, e) {
        sections.push({
            title: $(this).children('a').text(),
            link: $(this).children('a').attr('href')
        });
    });
    map["目录"] = sections;
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let doc = new DOMParser().parseFromString(html)
    var details = {
        type: 'text',
        contents: xpath.select('//*[@id="content"]/text()', doc).map(function (i) { return i.toString().trim().replaceAll('&amp;nbsp;', ''); })
    };
    return JSON.stringify(details);
}