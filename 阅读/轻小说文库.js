function home_parse(url, html, headers) {
    var items = xpath.query('//*[@id="content"]/table/tbody/tr/td/div/html()', html);
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//div[2]/b/a/text()', item),
            link: xpath.query1('//div[2]/b/a/@href', item),
            cover: xpath.query1('//div[1]/a/img/@src', item),
            info: xpath.query1('//div[2]/p[4]/text()', item),
            author: xpath.query1('//div[2]/p[1]/text()', item),
            updateTime: xpath.query1('//div[2]/p[2]/text()', item),
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var book = {
        title: xpath.query('//*[@id="content"]/div[1]/table[1]/tbody/tr[1]/td/table/tbody/tr/td[1]/span/b/text()', html).shift(),
        cover: xpath.query1('//*[@id="content"]/div[1]/table[2]/tbody/tr/td[1]/img/@src', html),
        referer: url,
        info: xpath.query1('//*[@id="content"]/div[1]/table[2]/tbody/tr/td[2]/span[6]/text()', html),
        author: xpath.query1('//*[@id="content"]/div[1]/table[1]/tbody/tr[2]/td[2]/text()', html).replace('小说作者：', ''),
        updateTime: xpath.query1('//*[@id="content"]/div[1]/table[1]/tbody/tr[2]/td[4]/text()', html).replace('最后更新：', ''),
        extra: xpath.query1('//*[@id="content"]/div[1]/div[4]/div/span[1]/fieldset/div/a/@href', html),
    };

    return JSON.stringify(book);
}

function chapter_build_url(url, lastResult) {
    let last = JSON.parse(lastResult);
    return last.extra;
}

function chapter_parse(url, html, headers, lastResult) {
    console.log(url)
    var book = JSON.parse(lastResult);
    let chapters = xpath.query('//*[@class="ccss"]/node()', html);
    console.log(chapters);
    var list = [];
    chapters.forEach(chapter => {
        list.push({
            title: xpath.query1('//a/text()', chapter),
            link: url.replace("index.htm", xpath.query1('//a/@href', chapter)),
        });
    });
    book.sections = { "目录": list };
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    var details = {
        type: "text",
        contents: xpath.query1('//*[@id="content"]/text()', html).split('\n').filter((t) => t != '').map((t) => t.trim())
    };
    return JSON.stringify(details);
}