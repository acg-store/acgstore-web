function home_parse(url, html) {
    var data = JSON.parse(html);
    var $ = cheerio.load(data.data.content);
    var list = [];
    if (data.success) {
        $('.post-outer').each(function (e, i) {
            var self = $(this);
            list.push({
                title: self.find('.entry-title > a').text(),
                link: self.find('.entry-title > a').attr('href'),
                author: self.find('.terms-liu-jing > a').text(),
                info: self.find('.entry-excerpt').text(),
                updateTime: self.find('.post-meta').children('li').eq(2).text(),
                cover: self.find('img').first().attr('data-pk-src'),
            });
        });
    } else {
        return 'ERROR:请求数据失败';
    }

    return JSON.stringify(list);
}

function details_parse(url, html) {
    var details = {};
    let $ = cheerio.load(html);
    details.cover = $('.pk-lightbox-container').find('img').first().attr('src');
    details.title = $('h1.entry-title').text();
    details.author = $('.terms-liu-jing').text();
    details.link = $('.wp-block-audio > audio').attr('src');
    details.album = $('.post-meta').children('li').eq(3).text();
    details.type = 'audio/*';
    console.log(details);
    return JSON.stringify(details);
}