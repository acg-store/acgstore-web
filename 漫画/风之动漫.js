function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('#mhnew').find('li').each(function (e, i) {
        var link = $(this).children('a').attr('href').match(/(\d+)\/\d+/)
        if (link != null) {
            list.push({
                title: $(this).children('a').text(),
                link: '/manhua/' + link[1] + '/',
                updateTime: $(this).children('.time').text(),
            });
        }
    });
    return JSON.stringify(list);
}

function tag_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('#mhmain').find('.round').each(function (e, i) {
        list.push({
            title: $(this).find('a').last().text(),
            link: $(this).find('a').last().attr('href'),
        });
    });
    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let $ = cheerio.load(html);
    var book = {};
    try {
        var map = new Map();
        var sections = [];
        $('#content > li').each(function (e, i) {
            sections.push({
                title: $(this).children('a').attr('title'),
                link: url.replace('.com/', '.com/api/') + $(this).children('a').attr('href').slice(0, -1)
            });
        });
        map['目录'] = sections;
        book.sections = map;
        book.isSectionAsc = 0;
    } catch (e) {
        throw e;
    }
    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);

    var details = {
        images: [],
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
        }
    };

    var mhss = "";
    if (mhss == "" || mhss == "http://" || mhss == "https://") {
        mhss = "http://p1.fzacg.com";
    }

    let list = data.cont;
    list.forEach(mhurl => {
        if (mhurl.indexOf("2016") == -1 && mhurl.indexOf("2017") == -1 && mhurl.indexOf("2018") == -1 && mhurl.indexOf("2019") == -1 && mhurl.indexOf("2020") == -1 && mhurl.indexOf("2021") == -1) {
            mhss = "https://p5.fzacg.com";
        }
        var mhpicurl = mhss + "/" + mhurl;

        if (mhurl.indexOf("http") != -1) {
            mhpicurl = mhurl
        }
        console.log(mhpicurl);
        details.images.push(mhpicurl);
    });
    return JSON.stringify(details);
}