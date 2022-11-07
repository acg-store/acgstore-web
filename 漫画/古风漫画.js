function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('#contList > li').each(function (i, e) {
        let self = $(this);
        list.push({
            title: self.children('a').attr('title'),
            link: self.children('a').attr('href'),
            cover: self.find('img').attr('src'),
            info: self.find('span.tt').text(),
            updateTime: self.children('span.updateon').text().replace('1.0', '').trim(),
        });
    });
    return JSON.stringify(list);
}

function home_parse_xpath(url, html, headers) {
    var list = [];
    var items = xpath.query('//*[@id="contList"]/li/html()', html);
    items.forEach(item => {
        list.push({
            title: xpath.query1('//a/@title', item),
            link: xpath.query1('//a/@href', item),
            cover: xpath.query1('//a/img/@src', item),
            info: xpath.query1('//a/span[2]/text()', item),
            updateTime: xpath.query1('//span/text()', item).replace('1.0', '').trim(),
        });
    });
    return JSON.stringify(list);
}

function tag_parse(url, html, headers) {
    var list = [];

    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);

    var book = {
        title: $('div.book-title > h1 > span').text(),
        cover: $('img.pic').attr('src'),
        info: $('#intro-all').text().trim(),
        author: $('.detail-list > li:nth-child(2) > span:nth-child(2) > a').text().trim(),
        sections: {},
    };

    // 首先循环遍历所有的线路
    $('div.caption.pull-left').each(function (i, e) {
        // 有几个线路，就有几个章节集合，所以再遍历章节列表
        // eq(i)表示根据下标取第几个，i就是当前线路的下标，同时也对应了章节列表的下标
        // 遍历章节列表下的每一个章节，存储到list里
        let list = [];
        $('div.chapter-body.clearfix').eq(i).find('li').each(function (i, e) {
            list.push({
                title: $(this).children('a').text().trim(),
                link: $(this).children('a').attr('href'),
            });
        });
        // 根据线路名称存储到book的sections中
        book.sections[$(this).text().trim()] = list;
    });

    return JSON.stringify(book);
}

function book_parse_xpath(url, html, headers) {
    var book = {
        title: xpath.query1('//div[@class="book-title"]/h1/span/text()', html),
        cover: xpath.query1('//img[@class="pic"]/@src', html),
        info: xpath.query1('//div[@id="intro-all"]/p/text()', html),
        author: xpath.query1('//ul[@class="detail-list cf"]/li[2]/span[2]/a/text()', html),
        sections: {},
    };
    // 首先获取到所有线路
    var lines = xpath.query('//div[@class="caption pull-left"]/html()', html);
    // 遍历线路
    lines.forEach((line, index) => {
        let list = [];
        let chapter_body = xpath.query(`//*[@class="chapter-body clearfix"]/ul/html()`, html);
        // 根据线路下标拿到对应线路下的全部章节
        let chapters = xpath.query('//li/node()', chapter_body[index]);
        // 循环章节元素，存储到list中
        chapters.forEach(chapter => {
            list.push({
                title: xpath.query1('//a/text()', chapter).trim(),
                link: xpath.query1('//a/@href', chapter),
            });
        });
        // 将list保存到对应的章节名称里
        book.sections[xpath.query1('//span/text()', line)] = list;
    });

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {
        images: []
    };
    // 获取到body下的第一个script脚本内容
    let script = $("body > script").first().text();
    // 运行次脚本，这样就可以取到它里面的内容
    eval(script);
    // 图片链接就是主机地址+图片路径+图片名称
    // script中的chapterImages就是全部图片名称的集合，所以我们遍历chapterImages即可
    chapterImages.forEach(image => {
        details.images.push(`https://res.xiaoqinre.com/${chapterPath}${image}`);
    });

    return JSON.stringify(details);
}

function details_parse_xpath(url, html, headers) {
    var details = {
        images: []
    };
    // 获取到body下的第一个script脚本内容
    let script = xpath.query1("//body/script[1]/text()",html);
    // 运行次脚本，这样就可以取到它里面的内容
    eval(script);
    // 图片链接就是主机地址+图片路径+图片名称
    // script中的chapterImages就是全部图片名称的集合，所以我们遍历chapterImages即可
    chapterImages.forEach(image => {
        details.images.push(`https://res.xiaoqinre.com/${chapterPath}${image}`);
    });

    return JSON.stringify(details);
}