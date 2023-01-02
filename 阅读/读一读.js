function home_parse(url, html, headers) {
    var items = xpath.query('//*[@id="novel-list"]/ul/li[position() > 1 and @class="list-group-item clearfix"]/html()', html);
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//div[2]/text()', item),
            link: xpath.query1('//div[2]/a/@href', item),
            info: `更新至:${xpath.query1('//div[3]/text()', item)}`,
            author: xpath.query1('//div[4]/text()', item),
            updateTime: xpath.query1('//div[5]/text()', item),
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let chapterUrl = this.baseUrl + xpath.query1('//li[@class="list-group-item tac"]/a/@href', html);

    var book = {
        title: xpath.query('//h2/text()', html).shift().replace('简介', ''),
        cover: xpath.query1('//img[@class="img-thumbnail"]/@src', html),
        referer: url,
        info: xpath.query1('//*[@id="shot"]/text()', html),
        author: xpath.query1('//h1/small/text()', html),
        updateTime: xpath.query1('//div[@class="col-xs-8"]/ul[1]/li[4]/text()', html),
        extra: chapterUrl,
    };

    return JSON.stringify(book);
}

function chapter_build_url(url, lastResult) {
    let last = JSON.parse(lastResult);
    return last.extra;
}

function chapter_parse(url, html, headers, lastResult) {
    var book = JSON.parse(lastResult);
    let chapters = xpath.query('//*[@id="chapters-list"]/li[position()>1]/node()', html);
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
        contents: xpath.query1('//*[@id="txtContent"]/text()', html).split('　　').map((t) => t.trim())
    };
    return JSON.stringify(details);
}