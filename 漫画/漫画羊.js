function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.itemBox').each(function (i, e) {
        list.push({
            title: $(this).find('a').eq(1).text(),
            link: $(this).find('a').eq(1).attr('href'),
            cover: $(this).find('img').first().attr('src'),
            info: $(this).find('.txtItme').map(function (i, e) { return $(e).text().trim(); }).get().join('\n'),
            updateTime: $(this).find('.txtItme').last().text()
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    var data = JSON.parse(html);
    data.data.data.forEach(e => {
        list.push({
            title: e.comic_name,
            link: '/' + e.comic_newid,
            cover: 'https://cover.manhuayang.com/mh/' + e.comic_id + '.jpg-300x400.jpg',
            info: e.last_chapter_name,
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
        cover: $('.comic-cover > img').attr('data-src'),
        info: $('#js_desc_content').text(),
        sections: new Map(),
        isSectionAsc: 0,
    };
    var sections = [];
    $('#chapterList_1').find('a').each(function (i, e) {
        let title = $(this).text();
        if (title != "查看更多") {
            sections.push({
                title: title,
                link: $(this).attr('href')
            });
        }
    });
    book.sections['目录'] = sections;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    var details = {
        images: []
    };
    let qTcms_S_m_murl_e = html.match(/qTcms_S_m_murl_e=\"(.*?)\"/)[1];
    let temp = Base64.decode(qTcms_S_m_murl_e);
    temp.split('$qingtiandy$').forEach(element => {
        if (element.startsWith('http')) {
            details.images.push(element);
        } else {
            details.images.push('https://www.manhualv.com' + element);
        }
    });
    console.log(JSON.stringify(details));
    return JSON.stringify(details);

}