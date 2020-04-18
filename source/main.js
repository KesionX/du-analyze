var request = require("request");
var md5 = require("md5");
var fs = require('fs');

var styles = {
    'bold'          : ['\x1B[1m',  '\x1B[22m'],
    'italic'        : ['\x1B[3m',  '\x1B[23m'],
    'underline'     : ['\x1B[4m',  '\x1B[24m'],
    'inverse'       : ['\x1B[7m',  '\x1B[27m'],
    'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
    'white'         : ['\x1B[37m', '\x1B[39m'],
    'grey'          : ['\x1B[90m', '\x1B[39m'],
    'black'         : ['\x1B[30m', '\x1B[39m'],
    'blue'          : ['\x1B[34m', '\x1B[39m'],
    'cyan'          : ['\x1B[36m', '\x1B[39m'],
    'green'         : ['\x1B[32m', '\x1B[39m'],
    'magenta'       : ['\x1B[35m', '\x1B[39m'],
    'red'           : ['\x1B[31m', '\x1B[39m'],
    'yellow'        : ['\x1B[33m', '\x1B[39m'],
    'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
    'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG'       : ['\x1B[40m', '\x1B[49m'],
    'blueBG'        : ['\x1B[44m', '\x1B[49m'],
    'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
    'greenBG'       : ['\x1B[42m', '\x1B[49m'],
    'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
    'redBG'         : ['\x1B[41m', '\x1B[49m'],
    'yellowBG'      : ['\x1B[43m', '\x1B[49m']
}

function log (key, obj) {
    if (typeof obj === 'string') {
        console.log(styles[key][0] + '%s' + styles[key][1], obj)
    } else if (typeof obj === 'object') {
        console.log(styles[key][0] + '%o' + styles[key][1], obj)
    } else {
        console.log(styles[key][0] + '%s' + styles[key][1], obj)
    }
}


const duHeaders = {
    'Host': "app.poizon.com",
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A405 MicroMessenger/7.0.11(0x17000b21) NetType/4G Language/zh_CN',
    'appid': "wxapp",
    'appversion': "4.4.0",
    'content-type': 'application/json;charset=UTF-8',
    'accept': "*/*",
    'accept-language': 'zh-cn',
    'referer': 'https://servicewechat.com/wx3c12cdd0ae8b1a7b/102/page-frame.html',
    'wxapp-login-token': ''
}

// function getProductSign(query) {
//     var e = "";
//     Object.keys(query).sort().forEach(function(n) {
//         e += n + query[n].toString();
//     });
//     e += "19bc545a393a25177083d4a748807cc0";
//     return md5(e);
// }

function getSearchProductSign(query) {
    var e = "";
    Object.keys(query).sort().forEach(function(n) {
        e += n + query[n].toString();
    });
    e += "unionId19bc545a393a25177083d4a748807cc0";
    return md5(e);
}

// function getLastSaleSign(query) {
//     var e = "";
//     Object.keys(query).sort().forEach(function(n) {
//         e += n + query[n].toString();
//     });
//     e += "19bc545a393a25177083d4a748807cc0";
//     return md5(e);
// }

function getSign(query) {
    var e = "";
    Object.keys(query).sort().forEach(function(n) {
        e += n + query[n].toString();
    });
    e += "19bc545a393a25177083d4a748807cc0";
    return md5(e);
}

function httpGet(url) {
    return new Promise(function(resolve, reject) {
        request({
            url: url,
            method: 'get',
            headers: duHeaders,
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body);
                resolve(body);
            } else {
                reject();
            }
        });

    });

}

function httpPost(url, json) {
    return new Promise(function(resolve, reject) {
        request({
            url: url,
            method: 'post',
            headers: duHeaders,
            json: json
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject();
            }
        });
    });
}

async function searchProductList(title, page, limit) {
    let signObj = {
        title: title,
        page: page,
        limit: limit,
        sortType: 1,
        sortMode: 0,
        showHot: -1
    }
    let sign = getSearchProductSign(signObj);
    let url = 'https://app.poizon.com/api/v1/h5/search/fire/search/list?';
    let params = '';
    signObj.title = encodeURIComponent(signObj.title);
    Object.keys(signObj).sort().forEach(function(key) {
        params += key + '=' + signObj[key].toString() + '&';
    });
    params = params + 'sign=' + sign;
    url = url + params + '&unionId=';
    // console.log('url:', url);
    let body = await httpGet(url);
    let jsonBody = JSON.parse(body);
    return jsonBody.data;
}

function getProductDetail(spuId) {
    let signObj = {
        spuId: spuId,
        productSourceName: '',
        propertyValueId: 0
    }
    let sign = getSign(signObj);
    let url = 'https://app.poizon.com/api/v1/h5/index/fire/flow/product/detail';
    let body = {
        spuId: spuId,
        productSourceName: '',
        propertyValueId: 0,
        sign: sign
    }
    request({
        url: url,
        method: 'post',
        headers: duHeaders,
        json: body
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body)
        }
    });
}

async function loadProductSalesList(spuId, lastId, limit) {
    let signObj = {
        spuId: spuId,
        limit: limit,
        lastId: lastId,
        sourceApp: 'app'
    };
    // console.log('signObj', signObj);
    let sign = getSign(signObj);
    let url = 'https://app.poizon.com/api/v1/h5/commodity/fire/last-sold-list';
    let body = {
        spuId: spuId,
        limit: 100,
        lastId: lastId,
        sourceApp: "app",
        sign: sign
    }
    let data = await httpPost(url, body);
    return data.data; // lastId, list
}

function decodeDate(date) {
    if (date == '刚刚' || date.indexOf("分钟") != -1 || date.indexOf("小时") != -1) {
        return '今日';
    } else {
        return date;
    }
}

async function getLastSales(spuId) {
    let lastId = '';
    let lastDaySalesArray = [];
    let currentDay = {
        day: 0,
        dayStr: '今日',
        saleCount: 0,
        productObjs: []
    };
    lastDaySalesArray.push(currentDay);
    for (let i = 0; i < 15; ++i) {
        let data = await loadProductSalesList(spuId, lastId, 100);
        lastId = data.lastId;
        let list = data.list;
        for (let j = 0; j < list.length; ++j) {
            let saleObj = list[j];
            let dayTime = decodeDate(saleObj.formatTime);
            if (currentDay.dayStr == dayTime) {
                currentDay.saleCount++;
                currentDay.productObjs.push({
                    price: saleObj.price,
                    size: saleObj.propertiesValues
                });
            } else {
                currentDay = {
                    dayStr: dayTime,
                    saleCount: 0,
                    productObjs: []
                };
                currentDay.productObjs.push({
                    price: saleObj.price,
                    size: saleObj.propertiesValues
                });
                lastDaySalesArray.push(currentDay);
            }
        }
    }
    return lastDaySalesArray;
}

async function showLastSalesAnalyze(spuId) {
    let lastDaySalesArray = await getLastSales(spuId);
    let typeDetail = {};
    let typeAvgPrice = {};
    let preTypeDetail = {};
    for (let i = 0; i < lastDaySalesArray.length; ++i) {
        let daySaleObj = lastDaySalesArray[i];
        if (i == 0) {
            console.log('今日当前销量: ', daySaleObj.saleCount) 
        } else {
            console.log(daySaleObj.dayStr + '销量: ', daySaleObj.saleCount) 
        }
        // 当天码数，总销量信息
        for (let j = 0; j < daySaleObj.productObjs.length; ++j) {
            let productObj = daySaleObj.productObjs[j];
            // 当天不同码数，的销量信息
            if (!typeDetail[productObj.size]) {
                typeDetail[productObj.size] = [];
                typeDetail[productObj.size].push(productObj);
            } else {
                typeDetail[productObj.size].push(productObj);
            }

        }
        // 当天不同码数的均价
        Object.keys(typeDetail).forEach(function(key) {
            let size = key;
            let salelist = typeDetail[size];
            let totalPrice = 0;
            for (let k = 0; k < salelist.length; ++k) {
                let price = salelist[k].price;
                totalPrice = totalPrice + price;
            }
            let avgPrice = totalPrice / salelist.length;
            let salePrice = avgPrice - avgPrice * (6 / 100) - 8 - 15 -10;
            console.log( '      ', size , '码', ' 销量:', salelist.length, '  平均售价: ', Math.floor(avgPrice / 100), '   预计收入:', salePrice / 100);
            typeAvgPrice[size] = avgPrice;
        });
        daySaleObj['typeDetail'] = typeDetail;
        daySaleObj['typeAvgPrice'] = typeAvgPrice;
        lastDaySalesArray[i] = daySaleObj;
        preTypeDetail = typeDetail;
        typeDetail = {};
        typeAvgPrice = {};
       
    }

    // for (let i = 0; i < lastDaySalesArray.length; ++i) {
    //     let daySaleObj = lastDaySalesArray[i];
    //     let typeAvgPrice = daySaleObj.typeAvgPrice;
    //     // console.log(typeAvgPrice);
    // }

    let targetList = [];
    // 码数
    Object.keys(preTypeDetail).forEach(function(key) {
        let obj = {
            size: '',
            dayPrices: []
        };
        let fKey = key;
        obj['size'] = fKey;
        // log('red', fKey);
        // 天
        for (let l = 0; l < lastDaySalesArray.length; ++l) {
            let daySaleObj = lastDaySalesArray[l];
            // 不同鞋码的，日销
            let dayTypeDetail = daySaleObj.typeDetail;
            // console.log(dayTypeDetail);
            // 某一鞋码的日销
            let dayTypeObj = dayTypeDetail[fKey];
            // console.log(dayTypeObj, l);

            if (dayTypeObj) {

                let salelist = dayTypeObj;
                let totalPrice = 0;
                // 平均价
                for (let k = 0; k < salelist.length; ++k) {
                    let price = salelist[k].price;
                    totalPrice = totalPrice + price;
                }
                let avgPrice = totalPrice / salelist.length;
                // 当天此码数平均售价
                let price = avgPrice;
                obj.dayPrices.push(price);
            } else {
                obj.dayPrices.push(0);
            }

        }
        targetList.push(obj);
    });

    // writeToJson(targetList);
}


function writeToJson(obj) {
    fs.readFile('./test1.json','utf8',function (err, data) {
        if(err) console.log(err);
        // var test1=JSON.parse(data);
        // test1.name="li";
        var t = JSON.stringify(obj);
        fs.writeFileSync('./test1.json',t)
    });
}



async function main() {
    let title = '二次元';
    let searchData = await searchProductList(title, 0, 1);
    let productList = searchData.productList;
    
    if (!productList || productList.length == 0) {
        return;
    }

    for (let i = 0; i < productList.length; ++i) {
        let spuId = productList[i].spuId;
        let productName = productList[i].title;
        log('cyan', '商品:' + productName);
        await showLastSalesAnalyze(spuId);
       
    }
    
}

main();