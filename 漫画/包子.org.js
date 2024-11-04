function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html.replace(/className/i, ''));
    $('.pb-2').each(function (i, e) {
        var self = $(this);
        list.push({
            title: self.find('h3.cardtitle').text().trim(),
            link: self.children('a').attr('href'),
            cover: self.find('img').first().attr('src'),
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
    book.sectionLink = [`https://api-get-v2.mgsearcher.com/api/manga/get?mid=${mid}`];

    return JSON.stringify(book);
}

function sections_parse(url, html, headers) {
    console.log(html);
    let json = JSON.parse(html);
    let chapters = json.data;
    var sections = [];
    if (chapters && chapters.chapters) {
        chapters.chapters.forEach(element => {
            let time = element.attributes.updatedAt;
            // 根据time（格式为2024-09-03T05:32:24.045Z）计算多久前更新
            let date = new Date(time);
            let now = new Date();
            let diff = now - date;
            let days = Math.floor(diff / (1000 * 60 * 60 * 24));
            let timeAgo = `${days}天前更新`;
            sections.push({
                title: element.attributes.title,
                link: `/manga/${chapters.slug}/${element.attributes.slug}`,
                updateTime: timeAgo,
            });
        });
    }
    var map = new Map();
    map['目录'] = sections;
    return JSON.stringify(map);
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

async function requestChapter(mid) {
    //https://api-get-v2.mgsearcher.com/api/manga/get?mid=5
    const url = `https://api-get-v2.mgsearcher.com/api/manga/get?mid=${mid}`;
    console.log(url);
    let resp = await fetch(url, {
        "referrer": this.baseUrl,
    });
    return await resp.text();
}