function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.comic-main-section > .row.m-0').children('div').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.children('a').first().attr('title'),
            cover: self.find('img').first().attr('src'),
            link: self.children('a').first().attr('href'),
            info: self.children('.comic-author').text().trim()
        });

    });
    return JSON.stringify(list);
}

function search_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('.comic-main-section > .row.m-0').children('div').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('a').first().attr('title'),
            cover: self.find('img').first().attr('src'),
            link: self.find('a').first().attr('href'),
            info: self.find('.comic-author').text().trim()
        });

    });
    return JSON.stringify(list);
}

function book_parse(url, html) {
    var $ = cheerio.load(html);
    var top = $('.Introduct_Sub.autoHeight');
    var book = {
        cover: top.find('.img-round').first().attr('src'),
        info: $('.comic_story').text().trim(),
        updateTime: top.find('.comic-titles').last().text().trim()
    };

    var map = new Map();
    $('#comic-book-list .tab-pane').each(function (i, e) {
        var sections = [];
        var self = $(this);
        self.find('li').each(function (j, f) {
            sections.push({
                link: $(this).children('a').attr('href'),
                title: $(this).children('a').text().trim(),
            });
        });
        map[self.find('h2').first().text().trim()] = sections;
    });
    book.sections = map;
    book.isSectionAsc = 0;
    return JSON.stringify(book);
}

function details_parse(url, html) {
    var $ = cheerio.load(html);
    var details = {
        images: [],
        headers: {
            referer: "https://www.manhuacat.com/"
        }
    };
    var script = "";
    $('script').each(function (i, e) {
        if ($(this).text().indexOf('let img_data') != -1) {
            console.log(script);
            script = $(this).text();
        }
    });

    try{
        let img_data = script.match(/let img_data = "(.*?)"/i)[1];
    
        // <div class="d-none vg-r-data" data-chapter_num="490940" data-chapter-type="1" data-chapter-domain="https://mao.mhtupian.com" data-chapter-key="manhuacat2021"></div>
    
        let vg_r_data = $('.vg-r-data');
        let chapter_domain = vg_r_data.attr('data-chapter-domain');
        let chapter_key = vg_r_data.attr('data-chapter-key');
    
        let img_pre = '/uploads/';
    
        var chapterImages = LZString.decompressFromBase64(img_data).split(',');
    
        chapterImages.forEach((image) => {
            let time = Math.round(new Date() / 0x3e8);
            let path = img_pre + image;
            let path_md5 = md5(path + chapter_key + time);
            let link = chapter_domain + path + '?_MD=' + path_md5 + '&_TM=' + time;
            details.images.push(link);
        });
    }catch(e){
        throw "解析漫画失败"
    }
    

    return JSON.stringify(details);
}