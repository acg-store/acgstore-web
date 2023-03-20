function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('li').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.children('a').first();
        aggregate.title = a.children('h3').text();
        aggregate.link = a.attr('href');
        aggregate.cover = a.find('img').attr('data-src') + '@@headers={"referer":"https://m.laimanhua.net","protocol":"h2"}';
        aggregate.info = '';
        self.find('dl').each(function (i, e) {
            var info = $(this);
            if (i != 3) {
                aggregate.info += info.text() + '\n';
            }
        });
        aggregate.updateTime = self.find('dl').last().text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var list = [];
    $('.dmList.clearfix').find('li').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').first();
        aggregate.title = a.children('img').attr('alt');
        aggregate.link = a.attr('href');
        aggregate.cover = a.children('img').attr('src') + '@@headers={"referer":"https://m.laimanhua.net","protocol":"h2"}';;
        aggregate.info = self.find('.intro').text();
        aggregate.updateTime = self.find('dd').last().children('p').first().text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    var top = $('.book-detail');
    book.cover = top.find('img').first().attr('src') + '@@headers={"referer":"https://m.laimanhua.net","protocol":"h2"}';;
    book.title = top.find('img').first().attr('title');
    book.info = $('.book-intro.book-intro-more').text();
    var map = new Map();
    var sections = [];
    $('.chapter-list').find('li').each(function (i, e) {
        var self = $(this);
        var a = self.children('a');
        var section = {};
        section.title = a.text().replace(/\s+/g, '');
        section.link = a.attr('href');
        sections.push(section);
    });
    map['章节列表'] = sections;
    book.isSectionAsc = 0;
    book.sections = map;
    return JSON.stringify(book);
}

function gethost() {
    var hosts = ["xwdf.kingwar.cn", "mhreswhm.kingwar.cn", "qwe123.kingwar.cn", "resmhpic.kingwar.cn", "reszxc.kingwar.cn"];
    ddl = Math.round(Math.random() * 4);
    realurlsj = "https://" + hosts[ddl];
    return realurlsj;
}

function getcurpic(chapterId, path,img) {
    let host = gethost();
    parseInt(chapterId) > 542724 ? realurl = host : realurl = 'https://mhpic6.kingwar.cn';
    console.log(realurl);
    return realurl + path + img;
}

function details_parse(url, html) {

    var $ = cheerio.load(html);
    var script = $('script').filter(function (i, e) {
        return $(e).text().trim().startsWith('var');
    });
    var code = script.text().trim();

    eval(code);

    var details = {};
    details.images = [];
    mhInfo.images.forEach(function (ele) {
        details.images.push(getcurpic(mhInfo.chapterId, mhInfo.path, ele));
    });
    details.headers = { referer: "https://www.laimanhua.net/" }

    return JSON.stringify(details);
}
