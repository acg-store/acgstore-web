function home_build_url(url, page) {
    let date = new Date();
    return `/api/v1/ranks?type=3&q=s&limit=20&offset=${page}`;
}

function home_parse(url, html, headers) {
    console.log(url);
    console.log(html);
    let data = JSON.parse(html);
    if (data == null) {
        throw '获取失败';
    }
    if (data.code != 200) {
        throw data.message;
    }
    var list = [];

    data.results.list.forEach(comic => {
        list.push({
            title: comic.name,
            link: `/api/h5/comic/${comic.uuid}`,
            cover: 'https:' + comic.cover,
            info: comic.brief,
        });
    });

    return JSON.stringify(list);
}

function search_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data == null) {
        throw '搜索失败';
    }
    if (data.code != 200) {
        throw data.message;
    }
    var list = [];

    data.results.list.forEach(comic => {
        list.push({
            title: comic.name,
            link: `/api/h5/comic/${comic.uuid}`,
            cover: 'https:' + comic.cover,
            info: `${comic.orig_name != null ? comic.orig_name + "-" : ""}${comic.status}\n更至 ${comic.last_chapter != null ? comic.last_chapter.name : ""}\n${comic.brief}`,
        });
    });

    return JSON.stringify(list);
}

function book_parse(url, html, headers) {
    let data = JSON.parse(html);

    if (data == null) {
        throw '获取漫画详情失败';
    }
    if (data.code != 200) {
        throw data.message;
    }

    let comic = data.results.comic;
    let groups = data.results.groups;

    var book = {
        title: comic.comic,
        info: comic.brief,
        updateTime: comic.last_chapter != null ? comic.last_chapter.name : ""
    };

    var map = new Map();
    groups.forEach(group => {
        var sections = [];
        group.asc.forEach(chapter => {
            sections.push({
                title: `${chapter.name}(${chapter.size}P)`,
                link: `/api/h5/chapter/${chapter.uuid}`,
            });
        });
        map[group.name] = sections;
    });

    book.sections = map;

    return JSON.stringify(book);
}

function details_parse(url, html, headers) {
    let data = JSON.parse(html);
    if (data == null) {
        throw '获取章节失败';
    }
    if (data.code != 200) {
        throw data.message;
    }
    var details = {
        images: []
    };

    data.results.chapter.contents.forEach(content => { details.images.push(`https:${content.url}`); });

    return JSON.stringify(details);
}