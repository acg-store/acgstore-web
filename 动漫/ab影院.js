function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.stui-vodlist').children('li').each(function (i, e) {
        var item = $(".stui-vodlist__thumb").eq(i);
        list.push({
            title: item.attr('title'),
            link: item.attr('href'),
            cover: item.attr('data-original'),
            info: $(this).find('.pic-text.text-right').text(),
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        title: $('.stui-content__detail > h3.title').text(),
        cover: $('.img-responsive').attr('data-original'),
        info: $('.stui-content__desc').text().trim(),
    };
    var map = new Map();
    $('.stui-content__playlist').each(function (i, e) {
        var sections = [];
        $('.stui-content__playlist').eq(i).children('li').each(function (i, e) {
            sections.push({
                title: $(this).children('a').text(),
                link: $(this).children('a').attr('href'),
            });
        });
        map[`播放地址${i}`] = sections;
    });
    book.sections = map;

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length <= 0) {
        return "ERROR:没有嗅探到资源";
    }
    var link = data.resource[0].link;
    if (link.startsWith('https://jx.wujinkk.com/dplayer/?url=')) {
        link = link.replace("https://jx.wujinkk.com/dplayer/?url=", "");
    } else if (link.startsWith('https://play.shzpin.com/play/?url=')) {
        link = link.replace("https://play.shzpin.com/play/?url=", "");
    }

    return JSON.stringify({ mime: "video/*", link: link });
}