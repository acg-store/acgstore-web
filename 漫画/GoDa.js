function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html.replace(/className/i, ''));
    $('.pb-2').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('h3.cardtitle').text().trim(),
            link: self.children('a').attr('href'),
            cover: self.find('img').first().attr('src') + '@@headers={"protocol":"h2"}',
        });
    });

    return JSON.stringify(list);
}

async function book_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var book = {
        sections: {},
        info: $('#info .text-medium.line-clamp-4.my-unit-md').text().trim(),
        isSectionAsc: 1,
    };

    // 使用正则表达式获取html中的data-mid="11"的值
    let mid = html.match(/data-mid="(\d+)"/)[1];
    let data = await requestChapter(url, mid);
    console.log(data);
    var $$ = cheerio.load(data);

    var sections = [];

    $$('div.chapteritem').each(function (i, e) {
        let time = $$(this).find('span').last().text();
        let cid = $$(this).children('a').data('cs');
        if (time != "") {
            sections.push({
                title: $$(this).find('span').first().text(),
                link: `https://cocolamanhua.com/chapter/getinfo?m=${mid}&c=${cid}`,
                updateTime: time,
            });
        }
    });

    book.sections["目录"] = sections;

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var details = {
        images: [],
        headers: {
            referer: this.baseUrl,
        },
    };

    $('.w-full.h-full > img').each(function (e, i) {
        let src = $(this).attr('data-src');
        if (!src) {
            src = $(this).attr('src');
        }
        if (src && src.startsWith('http')) {
            details.images.push(src);
        }
    });

    return JSON.stringify(details);
}

async function requestChapter(ref, mid) {
    const url = `${this.baseUrl}manga/get?mid=${mid}&mode=all`;

    let resp = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en,zh-TW;q=0.9,zh-CN;q=0.8,zh;q=0.7,en-GB;q=0.6,en-US;q=0.5",
            "cache-control": "max-age=0",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": ref,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    return await resp.text();
}