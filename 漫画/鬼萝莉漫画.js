function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.news_list_1').children('li').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.children('a').first();
        aggregate.title = self.find('.hdline').text();
        aggregate.cover = self.find('img').first().attr('src');
        aggregate.link = a.attr('href');
        aggregate.updateTime = self.find('.news_list_tw_p').text();
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
                tag.url = $(this).children('a').attr('href') + 'list_@page.html';
                list.push(tag);
            });

        }

    });
    return JSON.stringify(list);
}

function details_parse(url, html) {
    var $ = cheerio.load(html);
    var details = {
        images: [],
        otherPageLink: [],
    };

    if ($('#newsArticle').find('img').length != 0) {
        $('#newsArticle').find('img').each(function (i, e) {
            details.images.push($(this).attr('src'));
        });
    } else {
        $('#newsArticle').children('img').each(function (i, e) {
            details.images.push($(this).attr('src'));
        });
    }

    $('.pages').find('li').each(function (e, i) {
        var self = $(this);
        if (!isNaN(parseInt(self.text()))) {
            var url = self.children('a').attr('href');
            if (url != null && url != '#') {
                details.otherPageLink.push(url);
            }
        }
    });

    return JSON.stringify(details);
}