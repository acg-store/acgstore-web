function home_parse(url, html) {
    var $ = cheerio.load(html);
    var list = [];
    $('li').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.children('a').first();
        aggregate.title = a.children('h3').text();
        aggregate.link = 'https://m.laimanhua.net' + a.attr('href');
        aggregate.cover = a.find('img').attr('data-src');
        aggregate.info = '';
        self.find('dl').each(function (i, e) {
            var info = $(this);
            if (i != 3) {
                aggregate.info += info.text() + '\n';
            }
        });
        aggregate.updateTime = self.find('dl').last().text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

// function search_parse(url, html, headers) {

//     let link = 'https://www.laimanhua.net/e/search/result/?searchid=' + html.match(/searchid=(.*?)"/i)[1];

//     return JSON.stringify([{ "link": link }]);
// }

// function search_add_build_url(url, lastResult) {
//     return JSON.parse(lastResult)[0].link;
// }

function search_parse(url, html, headers) {
    var $ = cheerio.load(html);
    var list = [];
    $('.dmList.clearfix').find('li').each(function (i, e) {
        var self = $(this);
        var aggregate = {};
        var a = self.find('a').first();
        aggregate.title = a.children('img').attr('alt');
        aggregate.link = 'https://m.laimanhua.net' + a.attr('href');
        aggregate.cover = a.children('img').attr('src');
        aggregate.info = self.find('.intro').text();
        aggregate.updateTime = self.find('dd').last().children('p').first().text();
        list.push(aggregate);
    });
    return JSON.stringify(list);
}

function book_parse(url, html) {
    var $ = cheerio.load(html);
    var book = {};
    var top = $('.book-detail');
    book.cover = top.find('img').first().attr('src');
    book.title = top.find('img').first().attr('title');
    book.info = $('.book-intro.book-intro-more').text();
    var map = new Map();
    var sections = [];
    $('.chapter-list').find('li').each(function (i, e) {
        var self = $(this);
        var a = self.children('a');
        var section = {};
        section.title = a.text().replace(/\s+/g, '');
        section.link = 'https://www.laimanhua.net' + a.attr('href');
        sections.push(section);
    });
    map['章节列表'] = sections;
    book.isSectionAsc = 0;
    book.sections = map;
    return JSON.stringify(book);
}



function getremoteqqurl(qqurl) {
    // http://ac.tc.qq.com/store_file_download?buid=15017&uin=521341&dir_path=/mif800/8/99/519899/73/&name=1369.mif2;
    var bym = "http://img11.hgysxz.cn"
    var v = qqurl;
    var qqurlarr = qqurl.split("dir_path=/");
    var qqfilename = qqurlarr[1].replace("&name=", "");
    qqfilename = qqfilename.replace("mif2", "jpg");
    qqfilename = qqfilename.replace("ori", "jpg");
    qqfilename = qqfilename.replace(/\//g, "_");
    var u = "http://img11.aoyuanba.com/pictmdown.php?p=" + base64_encode(v) + "&sf=" + qqfilename + "&ym=" + bym;
    return u;
}

function getkekerealurl(urlstr) {
    var realurl = urlstr;
    var ServerList = new Array(16);
    ServerList[0] = "http://2.99manga.com:9393/dm01/";
    ServerList[1] = "http://2.99manga.com:9393/dm02/";
    ServerList[2] = "http://2.99manga.com:9393/dm03/";
    ServerList[3] = "http://2.99manga.com:9393/dm04/";
    ServerList[4] = "http://2.99manga.com:9393/dm05/";
    ServerList[5] = "http://2.99manga.com:9393/dm06/";
    ServerList[6] = "http://2.99manga.com:9393/dm07/";
    ServerList[7] = "http://2.99manga.com:9393/dm08/";
    ServerList[8] = "http://2.99manga.com:9393/dm09/";
    ServerList[9] = "http://2.99manga.com:9393/dm10/";
    ServerList[10] = "http://2.99manga.com:9393/dm11/";
    ServerList[11] = "http://2.99manga.com:9393/dm12/";
    ServerList[12] = "http://2.99manga.com:9393/dm13/";
    ServerList[13] = "http://2.99manga.com:9393/dm14/";
    ServerList[14] = "http://2.99manga.com:9393/dm15/";
    ServerList[15] = "http://2.99manga.com:9393/dm16/";
    if (realurl.indexOf("/dm01/") != -1) {
        realurl = ServerList[0] + realurl.split("/dm01/")[1];
    } else if (realurl.indexOf("/dm02/") != -1) {
        realurl = ServerList[1] + realurl.split("/dm02/")[1];
    } else if (realurl.indexOf("/dm03/") != -1) {
        realurl = ServerList[2] + realurl.split("/dm03/")[1];
    } else if (realurl.indexOf("/dm04/") != -1) {
        realurl = ServerList[3] + realurl.split("/dm04/")[1];
    } else if (realurl.indexOf("/dm05/") != -1) {
        realurl = ServerList[4] + realurl.split("/dm05/")[1];
    } else if (realurl.indexOf("/dm06/") != -1) {
        realurl = ServerList[5] + realurl.split("/dm06/")[1];
    } else if (realurl.indexOf("/dm07/") != -1) {
        realurl = ServerList[6] + realurl.split("/dm07/")[1];
    } else if (realurl.indexOf("/dm08/") != -1) {
        realurl = ServerList[7] + realurl.split("/dm08/")[1];
    } else if (realurl.indexOf("/dm09/") != -1) {
        realurl = ServerList[8] + realurl.split("/dm09/")[1];
    } else if (realurl.indexOf("/dm10/") != -1) {
        realurl = ServerList[9] + realurl.split("/dm10/")[1];
    } else if (realurl.indexOf("/dm11/") != -1) {
        realurl = ServerList[10] + realurl.split("/dm11/")[1];
    } else if (realurl.indexOf("/dm12/") != -1) {
        realurl = ServerList[11] + realurl.split("/dm12/")[1];
    } else if (realurl.indexOf("/dm13/") != -1) {
        realurl = ServerList[12] + realurl.split("/dm13/")[1];
    } else if (realurl.indexOf("/dm14/") != -1) {
        realurl = ServerList[14] + realurl.split("/dm14/")[1];
    } else if (realurl.indexOf("/dm15/") != -1) {
        realurl = ServerList[14] + realurl.split("/dm15/")[1];
    } else {
        realurl = realurl;
    }
    return realurl;
}

function getrealurl(urlstr, currentChapterid) {
    var realurl = urlstr;
    if (realurl.indexOf("img1.fshmy.com") != -1) {
        realurl = realurl.replace("img1.fshmy.com", "img1.hgysxz.cn");
    } else if (realurl.indexOf("imgs.k6188.com") != -1) {
        realurl = realurl.replace("imgs.k6188.com", "imgs.zhujios.com");
    } else if (realurl.indexOf("073.k6188.com") != -1) {
        realurl = realurl.replace("073.k6188.com", "cartoon.zhujios.com");
    } else if (realurl.indexOf("cartoon.jide123.cc") != -1) {
        realurl = realurl.replace("cartoon.jide123.cc", "cartoon.shhh88.com");
    } else if (realurl.indexOf("imgs.gengxin123.com") != -1) {
        realurl = realurl.replace("imgs.gengxin123.com", "imgs1.ysryd.com");
    } else if (realurl.indexOf("www.jide123.com") != -1) {
        realurl = realurl.replace("www.jide123.com", "cartoon.shhh88.com");
    } else if (realurl.indexOf("cartoon.chuixue123.com") != -1) {
        realurl = realurl.replace("cartoon.chuixue123.com", "cartoon.shhh88.com");
    } else if (realurl.indexOf("p10.tuku.cc:8899") != -1) {
        realurl = realurl.replace("p10.tuku.cc:8899", "tkpic.tukucc.com");
    } else if (realurl.indexOf("http://") == -1) {
        realurl = encodeURI(getpicdamin(currentChapterid) + realurl);
    }
    return realurl;
}

function getcurpic(i, currentChapterid) {
    var v = i;
    var v1 = "";
    var s = "";
    if (v.indexOf("qq.com/store_file_download") != -1) {
        s = getremoteqqurl(v);
    }
    else if (v.indexOf("/ok-comic") != -1) {
        v = getkekerealurl(v);
        s = "http://img5.aoyuanba.com/pictmdown.php?p=" + Base64.encode(v);
    }
    else if (v.indexOf("mangafiles.com") != -1) {
        s = "http://img6.aoyuanba.com:8056/pictmdown.php?p=" + Base64.encode(v);
    }
    else if (v.indexOf("imgs.gengxin123.com") != -1) {
        var bym = "http://www.kxdm.com/";
        v1 = v.replace("imgs.gengxin123.com", "imgs1.ysryd.com");
        s = "http://imgsty1.aoyuanba.com/pictmdown.php?bu=" + bym + "&p=" + Base64.encode(v1);
    }
    else if (v.indexOf("imgs1.ysryd.com") != -1) {
        var bym = "http://www.kxdm.com/";
        s = "http://imgsty1.aoyuanba.com/pictmdown.php?bu=" + bym + "&p=" + Base64.encode(v);
    }
    else if (v.indexOf("dmzj.com") != -1) {
        var bym = "http://manhua.dmzj.com/";
        v = encodeURI(v);
        s = "http://imgsty.aoyuanba.com/pictmdown.php?bu=" + bym + "&p=" + Base64.encode(v);
    }
    else if (v.indexOf("imgsrc.baidu.com") != -1) {
        s = "http://img7.aoyuanba.com/picinc/qTcms.Pic.FangDao.asp?p=" + Base64.encode(v);
    }
    else if (v.indexOf("sinaimg.cn") != -1) {

        s = "http://img7.aoyuanba.com/picinc/qTcms.Pic.FangDao.asp?p=" + Base64.encode(v);
    }
    else if (v.indexOf("jumpcn.cc") != -1) {

        s = "http://img7.aoyuanba.com/picinc/qTcms.Pic.FangDao.asp?p=" + Base64.encode(v);
    }
    else if (v.indexOf("bbs.zymk.cn") != -1) {
        s = "http://img7.aoyuanba.com/picinc/qTcms.Pic.FangDao.asp?p=" + Base64.encode(v);
    }
    else if (v.indexOf("zhujios.com") != -1) {
        s = "http://img8.hgysxz.cn/picinc/qTcms.Pic.FangDao.asp?p=" + Base64.encode(v);
    }
    else if (v.indexOf("cartoon.akshk.com") != -1) {
        s = "http://img7.aoyuanba.com/picinc/qTcms.Pic.FangDao.asp?p=" + Base64.encode(v);
    }
    else if (v.indexOf("JLmh160") != -1) {
        s = "http://d.mh160.com/d/decode/?p=" + v + "&bid=" + parseInt(cid);
    } else {
        s = getrealurl(v, currentChapterid);

    }
    return s
}

function getpicdamin(currentChapterid) {
    var yuming = "https://res.gezhengzhongyi.cn:8443";
    if (parseInt(currentChapterid) > 542724) {
        yuming = "https://mhpic5.gezhengzhongyi.cn:8443";
    }
    if (parseInt(currentChapterid) > 885032)
        yuming = "https://mhpic88.miyeye.cn:8443";
    return yuming;
}

function details_parse(url, html) {

    var $ = cheerio.load(html);
    var script1 = $('body').children('script').eq(3).text();

    eval(script1);
    var script2 = $('body').children('script').eq(4).text();

    eval(script2);
    var links = Base64.decode(picTree).split('$qingtiandy$');
    var details = {};
    details.images = [];
    links.forEach(function (ele) {
        if (!ele.startsWith('http')) {
            details.images.push(getcurpic(ele, currentChapterid));
        }
    });
    details.headers = { referer: "https://www.laimanhua.net/" }
    console.log(details.images);
    return JSON.stringify(details);
}
