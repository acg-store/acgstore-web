function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    console.log(html);
    $('.fed-list-item').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.children('a').first();
        aggregate.title = self.children('a.fed-list-title').first().text();
        aggregate.cover = `${a.attr('data-original')}@@headers={"referer":"https://www.colamanhua.com","user-agent":"USER_AGENT","protocol":"h2"}`;
        aggregate.link = a.attr('href') + '/';
        aggregate.info = self.find('.fed-list-remarks').text();
        aggregate.updateTime = self.children('span').text().replace(/\s+/g, '');
        list.push(aggregate);
    });
    return JSON.stringify(list);
}
function search_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.fed-deta-info.fed-deta-padding.fed-line-top.fed-margin.fed-part-rows.fed-part-over').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').first();
        aggregate.title = self.find('h1').first().text();
        aggregate.cover = a.attr('data-original') + '@@headers={"referer":"https://www.colamanhua.com","user-agent":"USER_AGENT","protocol":"h2"}';
        aggregate.link = a.attr('href') + '/';
        aggregate.info = self.find('.fed-part-rows li').eq(1).text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}
function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    var top = $('.fed-deta-info.fed-margin.fed-part-rows.fed-part-over');
    book.title = top.find('.fed-part-eone.fed-font-xvi').first().text();
    book.cover = top.find('.fed-list-pics.fed-lazy.fed-part-2by3').first().attr('data-original') + '@@headers={"referer":"https://www.colamanhua.com","user-agent":"USER_AGENT","protocol":"h2"}';
    book.info = '';
    top.find('.fed-part-rows li').each(function (i, e) {
        book.info += $(this).children('.fed-text-muted').text().replace(/\s+/g, '') + ':' + $(this).children('a').text() + '\n';
    });
    var map = new Map();
    $('.fed-tabs-boxs').find('.fed-drop-btns.fed-padding.fed-col-xs3.fed-col-md2').each(function (i, e) {
        var sections = [];
        $('.all_data_list').eq(i).find('a').each(function (j, f) {
            var self = $(this);
            var section = {};
            section.title = self.text().replace(/\s+/g, '');
            section.link = self.attr('href') + '/';
            sections.push(section);
        });
        map[$(this).text().replace(/\s+/g, '')] = sections;
    });

    book.sections = map;
    book.isSectionAsc = 0;
    return JSON.stringify(book);
}



function details_parse(url, html) {
    return JSON.stringify({
        type: 'webview',
        link: url,
        js: "$('#mangalist').siblings().hide()"
    })
}
