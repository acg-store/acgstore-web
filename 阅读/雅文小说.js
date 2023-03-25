function home_parse(url, html, headers) {
    var items = xpath.query('//*[@id="newscontent"]/div[1]/ul/li/html()', html);
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//span[2]/a/text()', item),
            link: xpath.query1('//span[2]/a/@href', item),
            info: `更新至:${xpath.query1('//span[3]/a/text()', item)}`,
            author: xpath.query1('//span[4]/text()', item),
            updateTime: xpath.query1('//span[5]/text()', item),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var items = xpath.query('//*[@id="main"]/div[1]/ul/li[position()>1]/html()', html);
    var list = [];
    items.forEach(item => {
        list.push({
            title: xpath.query1('//span[2]/a/text()', item),
            link: xpath.query1('//span[2]/a/@href', item),
            info: `更新至:${xpath.query1('//span[3]/a/text()', item)}`,
            author: xpath.query1('//span[4]/text()', item),
            updateTime: xpath.query1('//span[5]/text()', item),
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    var book = {
        title: xpath.query('//*[@id="info"]/h1', html).shift(),
        cover: 'https://www.yawenku.com'+xpath.query1('//*[@id="fmimg"]/img/@src', html),
        referer: url,
        info: xpath.query1('//*[@id="intro"]/p[1]/text()', html),
        author: xpath.query1('//*[@id="info"]/p[1]/text()', html).replace(/作\s+者：/g, ''),
        updateTime: xpath.query1('//*[@id="info"]/p[3]/text()', html).replace('最后更新：',''),
    };
    let chapters = xpath.query('//*[@id="list"]/dl/dd[position()>15]/node()', html);
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
        contents: xpath.query('//*[@id="content"]/p/text()', html).filter((t) => t != '').map((t) => t.trim())
    };
    return JSON.stringify(details);
}