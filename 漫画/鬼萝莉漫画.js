function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.hotbox').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').first();
        aggregate.title = a.attr('title');
        aggregate.cover = self.find('img').first().attr('src');
        aggregate.link = 'http://www.gllmh.com' + a.attr('href');
        aggregate.info = self.children('p').first().text().replace(/\s+/g, '');
        aggregate.updateTime = self.children('span').last().text().replace(/\s+/g, '');
        list.push(aggregate);
    });
    return JSON.stringify(list);
}


function create_tag() {
    var list = [];
    var $ = cheerio.load(document.documentElement.outerHTML)

    $('.nav').children('li').each(function (i, e) {
        if (i != 0) {
            var title = $(this).children('strong').text().replace(/\s+/g, '');
            $(this).find('dd').each(function (j, f) {
                var tag = {};
                tag.group = title;
                tag.title = $(this).text();
                tag.url = 'http://www.gllmh.com' + $(this).children('a').attr('href') + 'list_@page.html';
                list.push(tag);
            });

        }

    });
    return JSON.stringify(list);
}

function tag_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.listl.list2 ul li').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').eq(1);
        aggregate.title = a.attr('title');
        aggregate.cover = self.find('img').first().attr('src');
        aggregate.link = 'http://www.gllmh.com' + a.attr('href');
        aggregate.info = self.children('p').first().text().replace(/\s+/g, '');
        aggregate.updateTime = self.children('span').last().text().replace(/\s+/g, '');
        list.push(aggregate);

    });
    return JSON.stringify(list);
}
function details_parse(url, html) {
    var $ = cheerio.load(html);
    var details = {};
    details.images = [];
    if ($('.article-content').find('img').length == 0) {
        $('.article-content').children('img').each(function (i, e) {
            details.images.push($(this).attr('src'));
        });
    } else {
        $('.article-content').find('img').each(function (i, e) {
            details.images.push($(this).attr('src'));
        });
    }

    details.headers = {
        "Referer": "https://qqpublic.qpic.cn/"
    }
    details.otherPageLink = [];
    var host = url.substring(0, url.lastIndexOf('/') + 1);
    $('.pagination').children('li').each(function (e, i) {
        var self = $(this);
        if (self.text().indexOf('下一页') == -1) {
            var url = self.children('a').attr('href');
            if (url != null && url != '#') {
                details.otherPageLink.push(host + url);
            }
        }
    });
    console.log(JSON.stringify(details));
    return JSON.stringify(details);
}