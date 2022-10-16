function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);

    $('.gengxin').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().text(),
            link: self.find('a').first().attr('href'),
            info: `${self.children('.z1').text()}\n${self.children('.z3').text()}\n${self.children('.z4').text()}`,
            updateTime: self.children('.z5').text()
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var list = [];
    $('.list-works').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('.list-book-dt').first().text(),
            link: self.find('a').first().attr('href'),
            cover: 'https://www.230ts.net/' + self.find('img').attr('data-original'),
            info: self.find('.list-book-des').text(),
            updateTime: self.find('.book-zt').text(),
        });
    });

    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        title: $('.book-img').children('img').attr('alt'),
        cover: 'https://www.230ts.net' + $('.book-img').children('img').attr('src'),
        info: $('.book-des').text().trim(),
        updateTime: $('.book-info').children('dd').last().text(),
    };

    var map = new Map();
    var sections = [];
    $('#playlist').find('li').each(function (i, e) {
        sections.push({
            title: $(this).children('a').text().trim(),
            link: $(this).children('a').attr('href'),
        });
    });
    map["目录"] = sections;
    book.sections = map;
    return JSON.stringify(book);
}


function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {
        extra: $('.content #play').attr('src')
    };

    return JSON.stringify(details);
}

function audio_info_build_url(url, lastResult) {
    return JSON.parse(lastResult).extra;
}

function audio_info_parse(url, html, headers, lastResult) {
    let $ = cheerio.load(html);

    var script = $('script').filter(function (i, e) {
        return $(e).text().trim().startsWith('var');
    });
    var code = script.text().trim();
    code = code.substr(0, code.indexOf('function')-1);
    console.log(code);
    eval(code);
    
    let temp = html.match(/mp3:(.*?)\n/)[1];
    console.log(temp)
    eval(`var newlink = ${temp}`);
    console.log(newlink);

    var result = {
        mime: 'audio/*',
        link: newlink,
    };

    return JSON.stringify(result);
}