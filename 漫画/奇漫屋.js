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
                newest: element.remarks,
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
    $('.search-result').children('.comic-list-item').each(function (i, e) {
        list.push({
            title: $(this).find('img').first().attr('alt').replace('漫画', ''),
            link: $(this).children('a').attr('href'),
            cover: $(this).find('img').first().attr('src')
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var book = {
        cover: $('div.box-back1 > img').attr('src'),
        title: $('div.box-back1 > img').text(),
        info: $('.comic-intro').text(),
        sections: {},
        isSectionAsc: 0
    };
    var time = html.match(/更新时间：(.*?)<\//);
    if (time != null && time.length >= 2) {
        book.updateTime = time[1];
    }
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