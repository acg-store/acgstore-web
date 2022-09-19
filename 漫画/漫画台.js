function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);

    $('#classList_1').find('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.children('a').first().attr('title'),
            link: self.children('a').first().attr('href'),
            cover: self.find('img').first().attr('src'),
            info: self.find('.tip').text().trim(),
        });
    });

    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        title: $('h1.title').text(),
        info: $('.d-nowrap-clamp.d-nowrap-clamp-2').text().trim(),
        updateTime: $('.subtitle.d-nowrap').last().text().trim(),
        isSectionAsc: 0,
    };
    var map = new Map();
    var sections = [];

    $('#chapterList_1').find('li').each(function (i, e) {
        sections.push({
            title: $(this).children('a').text(),
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
        images: [],
    };

    var domain = html.match(/var imgDomain = '(.*?)';/)[1];
    var picScript = html.match(/(eval.*?\}\)\))/i)[1];

    var code = picScript.trim();
    code = code.replace('\w+', '\\w+');
    code = code.replaceAll("'\\b'", "'\\\\b'");

    eval(code);

    picdata.forEach(img => {
        console.log(`${domain}${img}`);
        details.images.push(`${domain}${img}`);
    });



    return JSON.stringify(details);
}