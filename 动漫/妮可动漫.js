function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.vod-item-img').children('li').each(function (e, i) {
        var self = $(this);
        var aggregate = {};
        var img = self.find('img').first();
        aggregate.title = img.attr('alt');
        aggregate.cover = img.attr('data-original');
        aggregate.link = 'http://www.nicotv.club' + self.find('a').first().attr('href');
        aggregate.updateTime = self.find('.continu').text().replace(/\s+/g, '');
        aggregate.info = self.find('.continu').text().replace(/\s+/g, '');
        list.push(aggregate);
    });
    return JSON.stringify(list);
}
// function create_tag(html){
//     var $ = cheerio.load(html);
//     var result= [];
//     $('.dl-horizontal').children('dd').eq(3).find('a').each(function(i,e){
//         var self = $(e);
//             var tag = {};
//             tag.group = '年代';
//             tag.title = self.text();
//             tag.url = 'http://www.nicotv.club'+self.attr('href').replace(/time.html/,'time-@page.html');
//             result.push(tag);
//     });
//     return JSON.stringify(result);
// }
function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    var top = $('.media');
    book.cover = top.find('.img-thumbnail').attr('data-original');
    book.title = top.children('.media-body').children('h2').text().replace(/\s+/g, '');
    book.info = $('.dl-horizontal').text();
    var map = new Map();
    var tabs = [];
    $('ul.ff-playurl-tab li').each(function (i, e) {
        var self = $(this);
        var name = self.text().replace(/\s+/g, '');
        if (name.indexOf('下载') == -1) {
            tabs.push(name);
        }
    });
    if (tabs.length == 0) {
        otaku.showToast('木有详情，去其他站点看看吧', 0);
        return JSON.stringify(book);
    }
    $('div.tab-content ul').each(function (i, e) {
        if (i < tabs.length) {
            var self = $(e);
            var sections = [];
            self.find('a').each(function (j, f) {
                var self = $(f);
                var section = {};
                section.title = self.text();
                section.link = 'http://www.nicotv.club' + self.attr('href');
                sections.push(section);
            });
            map[tabs[i]] = sections;
        }
    });
    book.sections = map;
    return JSON.stringify(book);
}

function details_parse(url, html) {
    var $ = cheerio.load(html);
    var details = {};
    details.link = 'http://www.nicotv.club' + $('#cms_player script').eq(0).attr('src');
    console.log(details.link);
    return JSON.stringify(details);
}

function video1_build_url(url, lastResult) {
    let data = JSON.parse(lastResult);
    return data.link;
}

function details_video1_parse(url, html) {
    html = html.substring(0, html.lastIndexOf('document'));
    eval(html);
    var details = {};
    if (typeof (cms_player) != "undefined") {
        // var link = cms_player.jiexi + cms_player.url + '&time=' + cms_player.time + '&auth_key=' + cms_player.auth_key;
        var link = cms_player.url
        console.log(link);
        if (link != null && link != '') {
            details.link = link;
            details.mime = 'text/html';
        } else {
            // otaku.showToast('播放链接解析失败，看看别的吧', 0);
            return JSON.stringify(details);
        }
    } else {
        // otaku.showToast('播放链接解析失败，看看别的吧', 0);
        return JSON.stringify(details);
    }

    return JSON.stringify(details);
}

function video2_build_url(url, lastResult) {
    let data = JSON.parse(lastResult);
    return data.link;
}

function details_video2_parse(url, html) {
    // "sniffFilters": "^http[s]?://((?!url=).)*\\.(mp4|m3u8).*$",
    console.log(html);
    let data = JSON.parse(html);
    if (data.resource == null || data.resource.length <= 0) {
        return "ERROR:没有嗅探到资源";
    }
    var link = data.resource[0].link.match(/http:\/\/.*?url=(.*)/);
    if (link?.length > 1 == true)
        return JSON.stringify({ mime: "video/*", link: link[1] });
    else
        return JSON.stringify({ mime: "video/*", link: data.resource[0].link });
}