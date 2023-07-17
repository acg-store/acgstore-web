function home_parse(url, html, headers) {
    var list = [];
    let data = JSON.parse(html);
    if (data != null) {
        data.forEach(element => {
            list.push({
                title: element.name,
                link: `/${element.id}/`,
                author: element.author,
                cover: element.imgurl,
                info: '最新章节:' + element.remarks + '\n' + element.intro,
            });
        });
    } else {
        throw "获取数据失败";
    }
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.result-list').children('a').each(function (i, e) {
        list.push({
            title: $(this).find('.cartoon-info > h2').text(),
            link: $(this).attr('href'),
            cover: $(this).find('img').first().attr('src'),
            author: $(this).find('.cartoon-info > p').first().text(),
            info: $(this).find('.cartoon-info > p').eq(1).text(),
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var book = {
        cover: $('.banner > .cartoon-poster').attr('src'),
        title: $('.banner > .cartoon-title').text(),
        author: $('.author').text(),
        info: $('.introduction').text(),
        sections: new Map(),
        isSectionAsc: 0
    };
    var sections = [];
    $('.chapter-item > a').each(function (i, e) {
        sections.push({
            title: $(this).text(),
            link: $(this).attr('href')
        });
    });
    if (sections.length == 0) {
        throw '该漫画已下架';
    }

    let reg = /\{ "id": (\d+), "id2": (\d+)\}/;
    let matchRes = html.match(reg);

    if (matchRes != null && matchRes.length >= 2) {
        book.extra = JSON.stringify({
            id: matchRes[1],
            vid: matchRes[2]
        });
    }
    book.sections['目录'] = sections;

    return JSON.stringify(book);
}

function book_sections_build_url(url, lastResult) {
    let book = JSON.parse(lastResult);
    let extra = JSON.parse(book.extra);
    if (extra != null) {
        return `/bookchapter/::id=${extra.id}&id2=${extra.vid}`
    } else {
        return "___NO__NEED__REQUEST__";
    }
}

function book_sections_parse(url, html, headers, lastResult) {
    var book = JSON.parse(lastResult);
    let extra = JSON.parse(book.extra);
    if (html.startsWith('[')) {
        console.log(html)
        let data = JSON.parse(html);
        var sections = book.sections['目录'];
        if (sections == null) sections = [];
        data.forEach(item => {
            sections.push({
                title: item.name,
                link: '/' + extra.id + '/' + item.id + '.html'
            });
        });
        book.sections['目录'] = sections;
    }

    return JSON.stringify(book);
}


function details_parse(url, html, headers) {
    eval(html.match(/eval\(function.*\)\)/)[0]);
    return JSON.stringify({ images: newImgs });
}