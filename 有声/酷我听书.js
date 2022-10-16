function home_parse(url, html, headers) {
    let data = JSON.parse(html);
    var list = [];
    if (data.code != 200) throw "获取数据失败";
    data.data.topDatas.forEach((e) => {
        list.push({
            // link: `http://tingshu.kuwo.cn/tingshu/api/data/album/songs?albumId=${e.albumId}&online=0&kweexVersion=1.0.2`,
            link: `https://tsm.kuwo.cn/api/r.s?stype=albuminfo&albumId=${e.albumId}&mobi=1&pn=0&vipver=MUSIC_8.2.0.0_BCS17&sortby=3&rn=5000`,
            title: e.albums.name,
            cover: e.albums.img,
            info: e.albums.title
        });
    });
    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    let data = JSON.parse(html);
    var list = [];
    if (data.code != 200) throw "获取数据失败";
    data.data.data.forEach((e) => {
        list.push({
            link: `http://tingshu.kuwo.cn/tingshu/api/data/album/songs?albumId=${e.albumId}&online=0&kweexVersion=1.0.2`,
            title: e.albumName,
            cover: e.coverImg,
            info: `播音:${e.artistName}\n${e.title}`
        });
    });
    return JSON.stringify(list);
}


function book_parse(url, html, headers) {
    let data = JSON.parse(html);
    // if (data.code != 200) throw "获取数据失败";
    return JSON.stringify({
        info: data.info,
        author: data.artist,
        sections: {
            "目录": data.musiclist.map(e => {
                return {
                    title: e.name,
                    link: `http://antiserver.kuwo.cn/anti.s?useless=/resource/&format=mp3&rid=MUSIC_${e.musicrid}&response=res&type=convert_url&`
                }
            })
        }
    })
}

function details_parse(url, html, headers) {
    return JSON.stringify({
        link: url,
        mime: "audio/*"
    });
}