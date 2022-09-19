function home_parse(url, html, headers) {
    var list = [];
    let $ = cheerio.load(html);
    $('#mhnew').find('li').each(function (e, i) {
        var link = $(this).children('a').attr('href').match(/(\d+)\/\d+/)
        if (link != null) {
            list.push({
                title: $(this).children('a').text(),
                link: 'https://manhua.fffdm.com/' + link[1] + '/',
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
            link: 'https://manhua.fffdm.com/' + $(this).find('a').last().attr('href'),
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
        $('.pure-u-1-2.pure-u-lg-1-4').each(function (e, i) {
            sections.push({
                title: $(this).children('a').attr('title'),
                link: url + $(this).children('a').attr('href')
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
    let $ = cheerio.load(html);
    var details = {
        images: [],
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
        }
    };
    var script = html.match(/var temps = .*?;/)[0];

    eval(script);
    var mhss = "";
    if (mhss == "" || mhss == "http://" || mhss == "https://") {
        mhss = "http://p1.fzacg.com";
    }

    let temp = Base64.decode(temps);
    let list = temp.split('\r\n');
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