function home_parse(url, html, headers) {
    let $ = cheerio.load(html);
    let list = [];
    $('.update-item').each(function (i, e){
        list.push({
            title: $(this).find('img').first().attr('alt'),
            link: $(this).children('a').first().attr('href'),
            info: $(this).find('.update-feature').text(),
            cover: $(this).find('img').first().attr('data-src'),
            newest: $(this).children('.comic-update-at').text()
        });
    });
    
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    let list = [];
    let $ = cheerio.load(html);
    $('.comic-list-item').each(function (i, e) {
        list.push({
            title: $(this).find('img').first().attr('alt'),
            link: $(this).children('a').first().attr('href'),
            cover: $(this).find('img').first().attr('src'),
            author: $(this).find('.comic-author').text(),
            newest: $(this).find('.comic-update-at').text(),
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);
    let book = {
        title: $('.comic-info .comic-name').text(),
        author: $('.comic-info .au-name').text(),
        info: $('.comic-info .comic-intro').text(),
        sections:{},
        isSectionAsc: 1
    };
    let sections = [];
    $('.catalog-list .clearfix').find('a').each(function (i, e) {
        sections.push({
            title: $(this).text(),
            link: $(this).attr('href')
        });
    });
    if (sections.length == 0) {
        throw '该漫画已下架';
    }
    sections.sort((a, b) => naturalSort(a.title,b.title));
    book.sections["目录"] = sections;
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let params = html.match(/params = '(.*?)';/)[1];
    let result = decrypt(params);
    return JSON.stringify({
        images: result.images

    }
    )
}

function decrypt(word) {
    word = CryptoJS.enc.Base64.parse(word);
    let k = CryptoJS.lib.WordArray.create(word.words.slice(0x0,0x10));
    let k2 = word.words.slice(0x4);
    let w2 = CryptoJS.enc.Hex.stringify(CryptoJS.lib.WordArray.create(k2));
    let rk = CryptoJS.enc.Utf8.parse('9S8$vJnU2ANeSRoF');
    let re = CryptoJS.AES.decrypt({
        ciphertext: CryptoJS.enc.Hex.parse(w2),
    },rk,{iv:k});
    return JSON.parse(re.toString(CryptoJS.enc.Utf8));
};

function naturalSort(a, b) {
    // 提取数字和非数字部分
    const regex = /(\d+)|(\D+)/g;
    const aParts = a.match(regex);
    const bParts = b.match(regex);

    // 比较每个部分
    while (aParts.length && bParts.length) {
        const aPart = aParts.shift();
        const bPart = bParts.shift();

        // 如果都是数字，比较数值大小
        if (!isNaN(aPart) && !isNaN(bPart)) {
            const diff = parseInt(aPart, 10) - parseInt(bPart, 10);
            if (diff !== 0) {
                return diff;
            }
        } else {
            // 否则按字典顺序比较
            if (aPart < bPart) return -1;
            if (aPart > bPart) return 1;
        }
    }

    // 如果有剩余部分，较长的字符串排序在后
    return aParts.length - bParts.length;
}