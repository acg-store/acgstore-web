function getDateUrl() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `/rmrbhwb/html/${year}-${month > 10 ? month : '0' + month}/${day > 10 ? day : '0' + day}/`;
}

function home_build_url(url, html, headers) {
    return `${getDateUrl()}node_865.htm`;
}

function home_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var list = [];
    let date = $('.date.left').text().replace('人民日报', '').trim();
    $('.swiper-container > .swiper-slide').each(function (i, e) {
        var link = $(this).children('a').attr('href');
        if (link.startsWith('./')) {
            link = link.replace('./', '');
        }
        list.push(
            {
                title: $(this).children('a').text(),
                link: `${getDateUrl()}${link}`,
                info: date,
            }
        );
    });

    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var book = {
        title: $('div.paper-bot > p.left.ban').text(),
        cover: $('div.paper > img').attr('src').replace('../../..', 'http://paper.people.com.cn/rmrbhwb')
    };
    var chapters = [];
    $('.news-list > li').each(function (i, e) {
        chapters.push({
            title: $(this).children('a').text(),
            link: `${getDateUrl()}${$(this).children('a').attr('href')}`,
        });
    });
    book.sections = { "目录": chapters };
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {};
    details.type = "text";
    details.contents = xpath.query('//*[@id="ozoom"]/p/text()', html).filter((t) => t != '').map((t) => t.trim());
    return JSON.stringify(details);
}