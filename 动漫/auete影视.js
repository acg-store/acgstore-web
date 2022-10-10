function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.threadlist').children('li').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('img').first().attr('title'),
            link: self.children('a').first().attr('href'),
            cover: self.find('img').first().attr('src'),
            info: self.find('button.hdtag').first().text(),
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('.card-body').children('ul').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().text(),
            link: self.find('a').first().attr('href')
        });
    });

    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        updateTime: $('#body').find('.hidden-lg').text().trim(),
        cover: $('.cover').find('img').first().attr('src'),
        info: $('div.message.break-all').children('p').last().text().trim(),
    };
    var map = new Map();
    $('#player_list').children('h2').each(function (i, e) {
        var sections = [];
        $('#player_list').children('ul').eq(i).children('li').each(function (i, e) {
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
    if (link.startsWith('https://auete.com/js/player/dplayer/dplayer.html?')) {
        link = link.match(/http[s]+:\/\/[^\s,]*\.m3u8|\.mp4/)[0];
    } else if (link.startsWith('https://auete.com/api/dp.php?url=')) {
        link = link.replace("https://auete.com/api/dp.php?url=", "");
    } else if (link.startsWith('https://auete.com/api/mp4.php?url=')) {
        link = link.replace("https://auete.com/api/mp4.php?url=", "");
    } else if (link.startsWith('https://auete.com/api/?url=')) {
        link = link.replace("https://auete.com/api/?url=", "");
    } else if (link.startsWith('https://auete.org/js/player/dplayer/dplayer.html?videourl=')) {
        link = link.replace("https://auete.org/js/player/dplayer/dplayer.html?videourl=", "").split(',')[1];
    }

    return JSON.stringify({ mime: "video/*", link: link });
}