

function home_parse(url, html, headers) {
    let urls = {
        "CCTV1": "http://140.207.241.2:8080/live/program/live/cctv1hd/4000000/mnf.m3u8",
        "CCTV2": "http://140.207.241.2:8080/live/program/live/cctv2/1300000/mnf.m3u8",
        "CCTV3": "http://140.207.241.2:8080/live/program/live/cctv3/1300000/mnf.m3u8",
        "CCTV4": "http://140.207.241.2:8080/live/program/live/cctv4/1300000/mnf.m3u8",
        "CCTV5": "http://140.207.241.2:8080/live/program/live/cctv5hd/4000000/mnf.m3u8",
        "CCTV6": "http://140.207.241.2:8080/live/program/live/cctv6/1300000/mnf.m3u8",
        "CCTV7": "http://140.207.241.2:8080/live/program/live/cctv7/1300000/mnf.m3u8",
        "CCTV8": "http://140.207.241.2:8080/live/program/live/cctv8/1300000/mnf.m3u8",
        "CCTV9": "http://140.207.241.2:8080/live/program/live/cctv9/1200000/mnf.m3u8",
        "CCTV10": "http://140.207.241.2:8080/live/program/live/cctv10/1300000/mnf.m3u8",
        "CCTV11": "http://140.207.241.2:8080/live/program/live/cctv11/1300000/mnf.m3u8",
        "CCTV12": "http://140.207.241.2:8080/live/program/live/cctv12/1300000/mnf.m3u8",
        "CCTV13": "http://140.207.241.2:8080/live/program/live/cctvxw/1300000/mnf.m3u8",
        "CCTV14": "http://140.207.241.2:8080/live/program/live/cctvse/1300000/mnf.m3u8",
        "CCTV15": "http://140.207.241.2:8080/live/program/live/cctvyy/1300000/mnf.m3u8",
        "HuNanWeiShi": "http://140.207.241.2:8080/live/program/live/hnwshd/4000000/mnf.m3u8",
        "DongFangWeiShi": "http://140.207.241.2:8080/live/program/live/hddfws/4000000/mnf.m3u8",
        "ZheJiangWeiShi": "http://140.207.241.2:8080/live/program/live/zjwshd/4000000/mnf.m3u8",
        "JiangSuWeiShi": "http://140.207.241.2:8080/live/program/live/jswshd/4000000/mnf.m3u8",
        "BeiJingWeiShi": "http://140.207.241.2:8080/live/program/live/bjwshd/4000000/mnf.m3u8",
        "ShanDongWeiShi": "http://140.207.241.2:8080/live/program/live/sdwshd/4000000/mnf.m3u8",
        "AnHuiWeiShi": "http://140.207.241.2:8080/live/program/live/ahwshd/4000000/mnf.m3u8",
        "LiaoNingWeiShi": "http://140.207.241.2:8080/live/program/live/lnwshd/4000000/mnf.m3u8",
        "TianJinWeiShi": "http://140.207.241.2:8080/live/program/live/tjwshd/4000000/mnf.m3u8",
        "ChongQingWeiShi": "http://140.207.241.2:8080/live/program/live/cqws/1300000/mnf.m3u8",
        "HeiLongJiangWeiShi": "http://140.207.241.2:8080/live/program/live/hljwshd/4000000/mnf.m3u8",
        "JiLinWeiShi": "http://140.207.241.2:8080/live/program/live/jlws/1300000/mnf.m3u8",
        "NeiMengGuWeiShi": "http://140.207.241.2:8080/live/program/live/nmgws/1300000/mnf.m3u8",
        "NingXiaWeiShi": "http://140.207.241.2:8080/live/program/live/nmgws/1300000/mnf.m3u8",
        "GanSuWeiShi": "http://140.207.241.2:8080/live/program/live/gsws/1300000/mnf.m3u8",
        "GuangDongWeiShi": "http://140.207.241.2:8080/live/program/live/gdwshd/4000000/mnf.m3u8",
        "ShenZhenWeiShi": "http://140.207.241.2:8080/live/program/live/szwshd/4000000/mnf.m3u8",
        "HuBeiWeiShi": "http://140.207.241.2:8080/live/program/live/hbwshd/4000000/mnf.m3u8",
        "JiangXiWeiShi": "http://140.207.241.2:8080/live/program/live/jxwshd/4000000/d1.m3u8",
        "SiChuanWeiShi": "http://140.207.241.2:8080/live/program/live/scws/1300000/mnf.m3u8",
        "GuangXiWeiShi": "http://140.207.241.2:8080/live/program/live/gxws/1300000/mnf.m3u8",
        "HeNanWeiShi": "http://140.207.241.2:8080/live/program/live/hnws/1300000/mnf.m3u8",
        "Shan3XiWeiShi": "http://140.207.241.2:8080/live/program/live/sxws/1300000/mnf.m3u8",
        "HeBeiWeiShi": "http://140.207.241.2:8080/live/program/live/hbws/1300000/mnf.m3u8",
        "Shan1XiWeiShi": "http://140.207.241.2:8080/live/program/live/shanxiws/1300000/mnf.m3u8",
        "XiaMenWeiShi": "http://140.207.241.2:8080/live/program/live/xmws/1300000/mnf.m3u8",
        "YunNanWeiShi": "http://140.207.241.2:8080/live/program/live/ynws/1300000/mnf.m3u8",
        "GuiZhouWeiShi": "http://140.207.241.2:8080/live/program/live/gzws/1300000/mnf.m3u8",
        "XinJiangWeiShi": "http://140.207.241.2:8080/live/program/live/xjws/1300000/mnf.m3u8",
        "QingHaiWeiShi": "http://140.207.241.2:8080/live/program/live/qhws/1300000/mnf.m3u8",
        "XiZangWeiShi": "http://140.207.241.2:8080/:80/live/program/live/xzws/2500000/d1.m3u8",
        "BingTuanWeiShi": "http://140.207.241.2:8080/live/program/live/btws/1300000/mnf.m3u8",
        "DongNanWeiShi": "http://140.207.241.2:8080/live/program/live/dnwshd/4000000/mnf.m3u8",
        "HaiNanWeiShi": "http://140.207.241.2:8080/live/program/live/lyws/1300000/mnf.m3u8",
        "ZhongGuoTianQi": "http://140.207.241.2:8080/live/program/live/zgqx/1300000/mnf.m3u8",
        "ZhongGuoGongXiao": "http://140.207.241.2:8080/live/program/live/zggxpd/1300000/mnf.m3u8",
        "DongFangCaiJing": "http://140.207.241.2:8080/live/program/live/dfcj/1300000/mnf.m3u8",
        "DongFangYingShi": "http://140.207.241.2:8080/live/program/live/dsjpdhd/4000000/mnf.m3u8",
        "DiYiCaiJing": "http://140.207.241.2:8080/live/program/live/dycjhd/4000000/mnf.m3u8",
        "ShangHaiXinWenZongHe": "http://140.207.241.2:8080/live/program/live/xwzhhd/4000000/mnf.m3u8",
        "ShangHaiDuShi": "http://140.207.241.2:8080/live/program/live/ylpdhd/4000000/mnf.m3u8",
        "ShangHaiICS": "http://140.207.241.2:8080/live/program/live/wypdhd/4000000/mnf.m3u8",
        "HaHaXuanDong": "http://140.207.241.2:8080/live/program/live/hhxdhd/4000000/mnf.m3u8",
        "FaZhiTianDi": "http://140.207.241.2:8080/live/program/live/fztd/1300000/mnf.m3u8",
        "HuanXiaoJuChang": "http://140.207.241.2:8080/live/program/live/hxjchd/4000000/mnf.m3u8",
        "DuShiJuChang": "http://140.207.241.2:8080/live/program/live/dsjchd/4000000/mnf.m3u8",
        "QiCaiXiJu": "http://140.207.241.2:8080/live/program/live/qcxj/1300000/mnf.m3u8",
        "DongManXiuChang": "http://140.207.241.2:8080/live/program/live/dmxchd/4000000/mnf.m3u8",
        "XinShiJue": "http://140.207.241.2:8080/live/program/live/xsjhd/4000000/mnf.m3u8",
        "YouXiFengYun": "http://140.207.241.2:8080/live/program/live/yxfyhd/4000000/mnf.m3u8",
        "ShengHuoShiShang": "http://140.207.241.2:8080/live/program/live/shsshd/4000000/mnf.m3u8",
        "JinSePinDao": "http://140.207.241.2:8080/live/program/live/jingsepd/1300000/mnf.m3u8",
        "JinYingKaTong": "http://140.207.241.2:8080/live/program/live/jykt/1300000/mnf.m3u8",
        "QuanJiShi": "http://140.207.241.2:8080/live/program/live/qjshd/4000000/mnf.m3u8",
        "JiaJiaKaTong": "http://140.207.241.2:8080/live/program/live/jjkt/1300000/mnf.m3u8",
        "JingBaoTiYu": "http://140.207.241.2:8080/live/program/live/jbtyhd/4000000/mnf.m3u8",
        "JiSuQiChe": "http://140.207.241.2:8080/live/program/live/jsqchd/4000000/mnf.m3u8",
        "WuXingTiYu": "http://140.207.241.2:8080/live/program/live/ssty/4000000/mnf.m3u8",
        "MeiLiZuQiu": "http://140.207.241.2:8080/live/program/live/mlyyhd/4000000/mnf.m3u8"
    };
    let list = [];
    Object.keys(urls).forEach(key => {
        list.push({
            title: key,
            link: urls[key],
            info: urls[key],
        });
    });

    return JSON.stringify(list);
}

function details_parse(url, html, headers) {
    var details = {
        'mime': 'video/*',
        'link': url
    };
    return JSON.stringify(details);
}