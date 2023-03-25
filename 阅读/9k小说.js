function home_parse(url, html, headers) {
    var items = xpath.query('//div[@class="rankdatacont"]/div/html()', html);
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//dl/dt/a/img/@title', item),
            link: xpath.query1('//dl/dt/a/@href', item),
            cover: xpath.query1('//dl/dt/a/img/@src', item),
            info: xpath.query1('//dl/dd/p[2]/text()', item),
            newest: xpath.query1('//dl/dd/p[3]/a/text()', item),
            updateTime: xpath.query1('//dl/dd/p[3]/span/text()', item).replace('| ', ''),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var items = xpath.query('//div[@class="rankdatacont search"]/div/html()', html);
    items.length = items.length - 1;
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//dl/dt/a/img/@title', item),
            link: xpath.query1('//dl/dt/a/@href', item),
            cover: xpath.query1('//dl/dt/a/img/@src', item),
            info: xpath.query1('//dl/dd/p[2]/text()', item),
            newest: xpath.query1('//dl/dd/p[3]/a/text()', item),
            updateTime: xpath.query1('//dl/dd/p[3]/span/text()', item).replace('| ', ''),
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var book = {};
    let chapters = xpath.query('//*[@id="content-tab"]/div[2]/div[2]/div[2]/ul/li/a/html()', html);
    var list = [];
    chapters.forEach(chapter => {
        list.push({
            title: xpath.query1('//span[1]/text()', chapter),
            link: xpath.query1('//a/@href', chapter),
            updateTime:xpath.query1('//span[2]/text()', chapter)
        });
    });
    book.sections = { "目录": list };
    return JSON.stringify(book);
}



function details_parse(url, html, headers) {
    var details = {
        type: "text",
        contents: xpath.query('//*[@class="main-text-wrap"]/div[2]/p/text()', html).map((e) => e.trim())
    };
    return JSON.stringify(details);
}