function home_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var list = [];
    $('.l').last().find('li').each(function (i, e) {
        list.push({
            title: $(this).find('a').first().text(),
            link: $(this).find('a').first().attr('href'),
            info: $(this).children('.s1').text(),
            newest: $(this).children('.s3').text(),
            author: $(this).children('.s4').text(),
            updateTime: $(this).children('.s5').text()
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var list = [];
    $('.grid').find('tr').each(function (i, e) {
        if (i != 0) {
            list.push({
                title: $(this).find('a').first().text().trim(),
                link: $(this).find('a').first().attr('href'),
                newest: $(this).find('a').last().text().trim(),
                author: $(this).children('.odd').eq(1).text().trim(),
                updateTime: $(this).children('.odd').last().text().trim(),
            });
        }
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);
    let top = $('.box_con');
    var book = {
        cover: top.find('#fmimg').children('img').attr('src'),
        referer: url,
        info: top.find('#intro').text().trim(),
        updateTime: top.find('#info').children('p').eq(2).text(),
    };

    var map = new Map();
    var sections = [];
    $('#list').find('dt').last().nextAll('dd').each(function (i, e) {
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

    var details = {
        type: 'text',
        contents: xpath.query('//*[@id="content"]/p/text()', html).filter((t) => t != '').map((t) => t.trim()),
    };
    return JSON.stringify(details);
}