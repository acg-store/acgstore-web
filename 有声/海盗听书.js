function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.list-works').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title').replace('有声小说', ''),
            link: self.find('a').first().attr('href'),
            cover: self.find('img').first().attr('data-original'),
            info: self.find('.list-book-des').first().text(),
            updateTime: self.find('.list-book-dt').first().children('span').last().text(),
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        author: $('.book-info').find('dd').eq(3).text(),
        info: $('.book-des.div-b').text(),
        updateTime: $('.book-info').find('dd').last().text(),
    };
    var map = new Map();
    var sections = [];
    $('#playlist').find('li').each(function (i, e) {
        let ol = $(this).children('a').attr('href');
        let p = ol.match(/(\d+)\/(\d+).html/);
        if (p.length == 3) {
            let link = `/pc/index/getchapterurl/bookId/${p[1]}/chapterId/${p[2]}.html`;
            sections.push({
                title: $(this).children('a').text(),
                link: link,
            });
        }

    });
    map["章节列表"] = sections;
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data == null || data.status != 1) {
        return "ERROR:获取资源失败，可能IP被封";
    }
    let src = data.src.split('*').map((code) => String.fromCharCode(code)).join('');

    return JSON.stringify({ mime: "audio/*", link: src });
}