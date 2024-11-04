function home_parse(url, html) {
    let $ = cheerio.load(html);
    let list = [];
    let that = this;
    $('li').each(function (i, e) {
        let self = $(this);
        let aggregate = {};
        let a = self.children('a').first();
        aggregate.title = a.children('h3').text();
        aggregate.link = a.attr('href');
        aggregate.cover = a.find('img').attr('data-src') + `@@headers={"referer":"${that.baseUrl}","protocol":"h2"}`;
        aggregate.info = '';
        self.find('dl').each(function (i, e) {
            let info = $(this);
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
    let $ = cheerio.load(html);
    let list = [];
    let that = this;
    $('.dmList.clearfix').find('li').each(function (i, e) {
        let self = $(this);
        let aggregate = {};
        let a = self.find('a').first();
        aggregate.title = a.children('img').attr('alt');
        aggregate.link = a.attr('href');
        aggregate.cover = a.children('img').attr('src') + `@@headers={"referer":"${that.baseUrl}","protocol":"h2"}`;
        aggregate.info = self.find('.intro').text();
        aggregate.updateTime = self.find('dd').last().children('p').first().text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function book_parse(url, html) {
    let $ = cheerio.load(html);
    let book = {};
    let top = $('.book-detail');
    book.cover = top.find('img').first().attr('src') + `@@headers={"referer":"${this.baseUrl}","protocol":"h2"}`;
    book.title = top.find('img').first().attr('title');
    book.info = $('.book-intro.book-intro-more').text();
    let map = new Map();
    let sections = [];
    $('.chapter-list').find('li').each(function (i, e) {
        let self = $(this);
        let a = self.children('a');
        let section = {};
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
    let hosts = ["xwdf.kingwar.cn", "mhreswhm.kingwar.cn", "qwe123.kingwar.cn", "resmhpic.kingwar.cn", "reszxc.kingwar.cn"];
    let ddl = Math.round(Math.random() * 4);
    return "https://" + hosts[ddl];
}

function getcurpic(host,chapterId, path,img) {
    parseInt(chapterId) > 542724 ? realurl = host : realurl = 'https://mhpic6.kingwar.cn';
    return realurl + path + img;
}

function details_parse(url, html) {
    let $ = cheerio.load(html);
    let script = $('script').filter(function (i, e) {
        return $(e).text().trim().startsWith('var');
    });
    let code = script.text().trim();

    eval(code);

    let details = {};
    details.images = [];
    let host = gethost();
    mhInfo.images.forEach(function (ele) {
        details.images.push(getcurpic(host,mhInfo.chapterId, mhInfo.path, ele));
    });
    details.headers = { referer: this.baseUrl }

    return JSON.stringify(details);
}
