function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.myui-vodlist__box').each(function (e, i) {
        var self = $(this);
        var aggregate = {};
        aggregate.cover = self.children('a').first().attr('data-original');
        aggregate.title = self.children('a').first().attr('title');
        aggregate.link = self.children('a').first().attr('href');
        aggregate.info = self.find('span.pic-text').text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function search_parse(url, html) {
    var $ = cheerio.load(html);
    console.log($('title').text() === '系统安全验证');
    if ($('title').text() === '系统安全验证') {
        return "ERROR:需要验证，请打开浏览器填写验证码再返回";
    }
    var list = [];
    $('#searchList').children('li').each(function (e, i) {
        var self = $(this);
        var aggregate = {};
        aggregate.link = self.find('a').first().attr('href');
        aggregate.cover = self.find('a').first().attr('data-original');
        aggregate.title = self.find('a').first().attr('title');
        aggregate.info = self.find('span.pic-text').text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    book.title = $('h1.title').text();
    book.cover = $('.lazyload').first().attr('data-original');
    book.info = $('#desc > div > div.myui-panel_bd > div > span.data').text();
    var map = new Map();
    var groupList = [];
    $('div.myui-panel_hd > div > ul').first().children('li').each(function (e, i) {
        groupList.push('播放地址');
    });
    console.log(groupList);
    for (var i = 1; i <= groupList.length; i++) {
        var list = [];
        $('#playlist' + i).find('li').each(function (e, i) {
            var self = $(this);
            var section = {};
            section.title = self.children('a').text();
            section.link = self.children('a').attr('href');
            list.push(section);
        })
        map['播放地址' + i] = list;
    }
    book.isSectionsAsc = 1;
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse_url(url, html) {
    var $ = cheerio.load(html);
    var link = $('.player').children('script').eq(0).attr('src');
    return link;
}

function details_parse(url, html) {
    var details = {};
    try {
        var $ = cheerio.load(html);
        var script = html.substring(0, html.lastIndexOf(',urlinfo='));
        eval(script);
        var reg = new RegExp(/-(\d+)-(\d+)\.html/);
        var from = reg.exec(url)[1];
        var pos = reg.exec(url)[2];
        var result = VideoListJson[from][1];
        var link = result[pos].split('$')[1];
        if (link == null || link == '' || !link.startsWith('http')) {
            details.link = url;
            details.mime = 'text/html';
        } else {
            details.link = link;
            details.mime = 'video/*';
        }
    } catch (e) {
        details.link = url;
        details.mime = 'text/html';
    }
    return JSON.stringify(details);
}

function details_video_parse(url, html) {

    var $ = cheerio.load(html);
    let script = $('div.embed-responsive.clearfix > script:nth-child(1)').text();
    eval(script);
    if (!player_aaaa.url.startsWith('http')) {
        player_aaaa.url = decodeURIComponent(Base64.decode(player_aaaa.url));
    }

    var video = {
        link: player_aaaa.url,
        mime: 'video/*',
    };
    return JSON.stringify(video)
}