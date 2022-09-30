function home_parse(url, html) {
    var list = [];
    let $ = cheerio.load(html);

    $('.fed-list-item').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.children('.fed-list-title').text(),
            link: self.children('a').first().attr('href'),
            cover: self.children('a').first().attr('data-original'),
            info: self.find('.fed-list-remarks').text().trim(),
            updateTime: self.children('.fed-list-desc').text().trim(),
        });
    });

    return JSON.stringify(list);
}

function search_parse(url, html) {
    var list = [];
    let $ = cheerio.load(html);

    $('.fed-deta-info').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('h1.fed-part-eone').text(),
            link: self.find('a').first().attr('href'),
            cover: self.find('.fed-list-pics').attr('data-original'),
            info: self.find('.fed-part-rows').children('li').eq(1).text().trim(),
            updateTime: self.find('.fed-part-rows').children('li').eq(3).text().trim(),
        });
    });

    return JSON.stringify(list);
}

function book_parse(url, html) {
    let $ = cheerio.load(html);
    var book = {
        cover: $('.fed-list-pics').attr('data-original'),
        info: $('.fed-tabs-boxs').find('.fed-text-muted').text(),
        sections: {},
    };
    var sections = [];
    $('.fed-play-item > .fed-part-rows').last().children('li').each(function (i, e) {
        sections.push({
            title: $(this).children('a').text(),
            link: $(this).children('a').attr('href')
        });
    });
    book.sections['目录'] = sections;
    return JSON.stringify(book);
}

function details_parse(url, html) {
    return JSON.stringify({ extra: html.match(/oScript.src = "(.*?)";/i)[1] });
}

function details_image_build_url(url, lastResult) {
    return JSON.parse(lastResult).extra;
}

function details_image_parse(url, html) {
    var images = [];
    html.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,
        function (match, capture) {
            images.push(capture);
        });
    console.log(images);
    return JSON.stringify({ images: images });
}