
function home_build_url(url, page) {
	let timestamp = new Date().getTime();
	return "/recommend/latest/" + page + ".json?version=1.0.0&timestamp=" + timestamp + "&channel=m";
}

async function test(url, html) {
	console.log(html);
	console.log(url);
}
function home_parse(url, html) {
	// html = html.replace(/\n/g, '').replace(/<.*>/g, '').replace(/.*=\".*\"/g, '');
	var json = JSON.parse(html);
	var list = [];
	console.log(json.length);
	json.forEach(function (e, i) {
		var aggregate = {};
		aggregate.title = e.name;
		aggregate.info = '';
		aggregate.cover = e.cover;
		aggregate.info += '作者：' + e.authors + '\n';
		aggregate.info += '状态：' + e.status + '\n';
		aggregate.info += '最新章节：' + e.last_update_chapter_name + '\n';
		aggregate.info += e.description;
		aggregate.link = '/info/' + e.id + '.html'
		aggregate.referer = 'http://m.dmzj.com';
		list.push(aggregate);
	});
	return JSON.stringify(list);
}
function tag_parse(url, html) {
	var json = JSON.parse(html);
	var list = [];
	json.forEach(function (e, i) {
		var aggregate = {};
		aggregate.title = e.name;
		aggregate.cover = e.cover;
		aggregate.info = '';
		aggregate.info += '作者：' + e.authors + '\n';
		aggregate.info += '地区：' + e.zone + '\n';
		aggregate.info += '状态：' + e.status + '\n';
		aggregate.info += '最新章节：' + e.last_update_chapter_name + '\n';
		aggregate.info += '类型：' + e.readergroup;
		aggregate.link = '/info/' + e.id + '.html';
		aggregate.referer = 'http://m.dmzj.com';
		list.push(aggregate);
	});
	return JSON.stringify(list);
}
function search_parse(url, html) {
	var json = JSON.parse(html);
	var list = [];
	json.forEach(function (e, i) {
		var aggregate = {};
		aggregate.title = e.name;
		aggregate.cover = 'https://images.dmzj.com/' + e.cover;
		aggregate.info = '';
		aggregate.info += '作者：' + e.authors + '\n';
		aggregate.info += '状态：' + e.status + '\n';
		aggregate.info += '最新章节：' + e.last_update_chapter_name + '\n';
		aggregate.info += e.description;
		aggregate.link = '/info/' + e.id + '.html'
		aggregate.referer = 'http://m.dmzj.com';
		list.push(aggregate);
	});
	return JSON.stringify(list);
}
function book_parse(url, html) {
	if (html.startsWith('因版权、国家法规等原因')) {
		throw '该漫画已下架';
	} else {
		let data = JSON.parse(html);
		let comic = data.comic;
		var book = {
			cover: comic.cover,
			title: comic.name,
			referer: 'http://m.dmzj.com',
			info: comic.description,
			// updateTime: new Date(comic.last_updatetime * 1000).pattern("yyyy-MM-dd HH:mm:ss"),
			updateTime: new Date(comic.last_updatetime * 1000).toString(),
			tags: data.tag_info.map((tag) => tag.tag_name),
		};
		console.log(comic.chapter_json);
		let json = JSON.parse(data.chapter_json);
		var map = new Map();
		json.forEach(function (e, i) {
			var sections = [];
			e.data.forEach(function (v, i) {
				var section = {};
				section.title = v.chapter_name;
				let timestamp = new Date().getTime();
				section.link = '/comic/chapter/' + v.comic_id + '/' + v.id + '.html?version=1.0.0&timestamp=' + timestamp + '&channel=m';
				sections.push(section);
			});
			map[e.title] = sections;
		});
		book.sections = map;
		book.isSectionAsc = 0;
		return JSON.stringify(book);
	}
}
function details_parse(url, html) {
	if (html === '漫画内容不存在') {
		throw '该漫画已下架';
	} else {
		let json = JSON.parse(html);
		let chapter = json.chapter;
		var images = [];
		var pic = {};
		pic.title = chapter.chapter_name;
		chapter.page_url.forEach(function (e, i) {
			if (e.startsWith('https:/images')) {
				e = e.replace('https:/images', 'https://images');
			} else if ('http:/images') {
				e = e.replace('http:/images', 'http://images');
			}
			images.push(e);
		});
		pic.images = images;
		pic.headers = {
			referer: 'http://manhua.dmzj.com/'
		};
		return JSON.stringify(pic);
	}
}