function home_parse(url, html) {
    var data = JSON.parse(html);
    var list = [];
    if (data.status == 200) {
        data.data.datas.forEach(function (live) {
            list.push({
                title: live.introduction,
                cover: live.screenshot,
                info: live.nick,
                link: 'https://m.huya.com/' + live.profileRoom
            });
        });
    } else {
        throw data.message;
    }
    return JSON.stringify(list);
}
function tag_parse(url, html) {
    var data = JSON.parse(html);
    var list = [];
    if (data.status == 200) {
        data.data.lives.forEach((live) => {
            list.push({
                title: live.introduction,
                cover: live.screenshot,
                info: live.nick,
                link: 'https://m.huya.com/' + live.profileRoom
            });
        });
    } else {
        throw data.message;
    }
    return JSON.stringify(list);
}

function search_parse(url, html) {
    var data = JSON.parse(html);
    var list = [];
    if (data && data.response && data.response[3]) {
        data.response[3].docs.forEach((live) => {
            list.push({
                title: live.game_introduction,
                cover: live.game_imgUrl,
                info: live.game_nick,
                link: 'https://m.huya.com/' + live.room_id
            });
        });
    }
    return JSON.stringify(list);
}


function details_parse(url, html) {
    var reg = new RegExp(/HNF_GLOBAL_INIT\s+=\s+(.*)\s+<\/sc/g);
    var json = reg.exec(html);
    var link = "";
    if (json) {
        var temp = json[1];
        var data = JSON.parse(temp);
        if (data
            && data.roomInfo
            && data.roomInfo.tLiveInfo
            && data.roomInfo.tLiveInfo.tLiveStreamInfo
            && data.roomInfo.tLiveInfo.tLiveStreamInfo.vStreamInfo
            && data.roomInfo.tLiveInfo.tLiveStreamInfo.vStreamInfo.value
        ) {
            var stream = data.roomInfo.tLiveInfo.tLiveStreamInfo.vStreamInfo.value[0];
            link = `${stream.sFlvUrl}/${stream.sStreamName}.${stream.sFlvUrlSuffix}?${stream.sFlvAntiCode}`;
        } else {
            return 'ERROR:获取直播信息失败';
        }
    } else {
        return 'ERROR:获取直播信息失败';
    }
    return JSON.stringify({
        link: parseUrl(link).replace('&ctype=tars_mobile', ''),
        mime: "video/*",
        isLive: true
    });
}

function parseUrl(url) {
    let params = url.split("?")[1];
    params = params.split("&");
    let paramsObj = {};
    for (let i = 0; i < params.length; i++) {
        let item = params[i].split("=");
        2 === item.length && (paramsObj[item[0]] = item[1])
    }

    let mainUrl = url.split("?")[0];
    let r = mainUrl.split("/");
    let streamName = r[r.length - 1].replace(/.(flv|m3u8)/g, "");
    let { fm: fm, wsTime: wsTime, wsSecret: u, ...others } = paramsObj;
    let fmParse = Base64.decode(decodeURIComponent(fm));
    let p = fmParse.split("_")[0];
    let time = parseInt(1e4 * (new Date).getTime() + 1e4 * Math.random());
    let newWsSecret = `${p}_0_${streamName}_${time}_${wsTime}`;
    newWsSecret = md5.hex(newWsSecret);
    let y = "";
    Object.keys(others).forEach(e => {
        y += `&${e}=${others[e]}`
    });
    return `${mainUrl}?wsSecret=${newWsSecret}&wsTime=${wsTime}&u=0&seqid=${time}${y}`;
}