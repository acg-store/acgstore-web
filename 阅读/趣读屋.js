function home_parse(url, html, headers) {
    var items = xpath.query('//div[@class="l bd"]/ul/li/html()', html);
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//span[2]/a/text()', item),
            link: xpath.query1('//span[2]/a/@href', item),
            author: xpath.query1('//span[4]/text()', item),
            newest: xpath.query1('//span[3]/a/text()', item),
            updateTime: xpath.query1('//span[5]/text()', item),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var items = xpath.query('//div[@class="bookbox"]/html()', html);
    items.length = items.length - 1;
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//h4[@class="bookname"]/text()', item),
            link: xpath.query1('//h4[@class="bookname"]/a/@href', item),
            cover: xpath.query1('//img/@src', item),
            info: xpath.query1('//p/text()', item),
            newest: xpath.query1('//div[@class="update"]/text()', item),
            author: xpath.query1('//div[@class="author"]/text()', item)
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var book = {
        cover: this.baseUrl + xpath.query1('//div[@id="fmimg"]/img/@src', html),
        info: xpath.query1('//div[@id="intro"]/p/text()', html),
        updateTime: xpath.query1('//*[@id="info"]/p[6]/text()', html),
    };
    let chapters = xpath.query('//div[@class="listmain"]/dl/dd/html()', html);
    var list = [];
    chapters.forEach(chapter => {
        list.push({
            title: xpath.query1('//a/text()', chapter),
            link: xpath.query1('//a/@href', chapter),
        });
    });
    book.sections = { "目录": list };
    return JSON.stringify(book);
}



function details_parse(url, html, headers) {
    var details = {
        type: "text",
        contents: xpath.query('//*[@id="content"]/text()', html)
    };
    return JSON.stringify(details);
}