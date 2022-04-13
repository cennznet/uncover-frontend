import {accuracyFormat} from "./filters";

const BigNumber = require('bignumber.js')

export function getNumb() {
  var num = new Array();
  for (var i = 0; i < 10; i++) {
    var val = Math.ceil(Math.random() * 30);
    var isEqu = false;
    for (var idx in num) {
      if (num[idx] == val) {
        isEqu = true;
        break;
      }
    }
    if (isEqu) i--;
    else num[num.length] = val;
  }
  return num;
}

// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) return;

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to, step);
}

export function assert(condition, msg) {
  if (!condition) throw new Error(`[Apior] ${msg}`)
}

export function emailValidate(str) {
  let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
  return reg.test(str)
}
export function passwordValidate(str) {
  let reg = /^[a-zA-Z]{2,}[a-zA-Z0-9_]{6,}/
  return reg.test(str)
}
export function activedCodedValidate(str) {
  let reg = /^[0-9]{6}$/
  return reg.test(str)
}
export function phoneNumberValidate(str) {
  let reg = /^1[3|4|5|8][0-9]\d{4,8}$/
  return reg.test(str)
}

export function deepCopy(o) {
  if (o instanceof Array) {
    let n = [];
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else if (o instanceof Function) {
    let n = new Function("return " + o.toString())();
    return n
  } else if (o instanceof Object) {
    let n = {}
    for (let i in o) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

export function deepAssign(n, o) {
  if (o instanceof Array) {
    for (let i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i]);
    }
    return n;
  } else if (o instanceof Function) {
    n = new Function("return " + o.toString())();
    return n
  } else if (o instanceof Object) {
    for (let i in o) {
      n[i] = deepAssign(n[i], o[i]);
    }
    return n;
  } else {
    return o;
  }
}

// 对象数组排序
export function sortObject(array, key) {
  let temp = array.sort(function (a, b) {
    return new BigNumber(findProp(a, key)).gt(findProp(b, key)) ? -1 : 1
  })
  return temp
}

// 递归查找对象属性
export function findProp(o, key) {
  if (o[key]) {
    return o[key]
  } else {
    var n = undefined
    for (var i in o) {
      if (o[i] instanceof Object) {
        n = findProp(o[i], key);
      }
    }
    return n;
  }
}

/**
 * 节流函数
 * @param method 事件触发的操作
 * @param mustRunDelay 间隔多少毫秒需要触发一次事件
 */
export function throttle(method, mustRunDelay) {
  let timer,
    args = arguments,
    start;
  return function loop() {
    let self = this;
    let now = Date.now();
    if (!start) {
      start = now;
    }
    if (timer) {
      clearTimeout(timer);
    }
    if (now - start >= mustRunDelay) {
      method.apply(self, args);
      start = now;
    } else {
      timer = setTimeout(function () {
        loop.apply(self);
      }, 50);
    }
  }
}

/**
 * 防抖函数
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
export function debounce(method, delay) {
  let timer = null;
  return function () {
    let self = this,
      args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      method.apply(self, args);
    }, delay);
  }
}

export function openwin(url) {
  const a = document.createElement("a"); //创建a对象
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.setAttribute("id", "camnpr");
  document.body.appendChild(a);
  a.click(); //执行当前对象
}

/**
 * 返回UTC时间字符串
 * @param date 时间
 * @returns utc时间
 */

export function toUTC(date) {
  // 确保date 最终为Date object
  date = new Date(date);
  // 加入"+08"来标示对应的时区
  return date.toISOString();
}

export function isMobile() {
  const u = navigator.userAgent;
  return (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) &&
      !!u.match(/AppleWebKit.*Mobile.*/)) ||
    window.innerWidth <= 768;
}

export function getCurrencyTokenDetail(token, currency) {
  if (token && token.detail && currency) {
      const tokenValues = Object.values(token.detail);
      const valueAt = tokenValues.findIndex(value => value.symbol === currency);
      return tokenValues[valueAt];
  }
  return {};
}

export function getTokenDetailFromId(token, tokenId) {
  if (token && token.detail && tokenId) {
    const tokenValues = Object.values(token.detail);
    const valueAt = tokenValues.findIndex(value => value.id === tokenId);
    return tokenValues[valueAt];
  }
  return {};
}

export function fetchAccurateBalanceFromParams(tokens, erc20META, params) {
  let tokenDetail, erc20Detail;
  params.map((param) => {
    if (param.name === "asset_id" || param.name === "assetId" || param.typeName === "AssetId") {
      tokenDetail = getTokenDetailFromId(tokens, param.value);
    } else if  (param.name === "amount" || param.name === "fixedPrice") { // field is of type Balance (genericAsset/transfer|burn|mint) (nft/sell) extrinsic
      const accuracy = tokenDetail?.accuracy;
      param.value = accuracyFormat(param.value.toString(), typeof accuracy === 'undefined'? 0: accuracy);
      if (typeof accuracy !== 'undefined') {
        const key = 'value (decimal)'
        param[key] = param.value;
        delete param.value;
      }
    }
    if (typeof param.value === 'object' && param.value !== null) {
      if (param.value && param.value.tokenAddress) {
        erc20Detail = erc20META[param.value.tokenAddress];
      }
      if (param.value && param.value.amount && !(param.value.amount.startsWith('0x'))) {
        const accuracy = erc20Detail?.decimal;
        const amount = accuracyFormat(param.value.amount.toString(), typeof accuracy === 'undefined'? 0: accuracy);
        param.value.amount = amount;
        if (typeof accuracy !== 'undefined') {
          const key = 'amount (decimal)';
          param.value[key] = amount;
          delete param.value.amount;
        }
      }
    }
  });
  return params;
}

export function getTokenDetail(token, sourceSelected, currency) {
  if (token && token.detail) {
    if (sourceSelected === "kusama" || sourceSelected === "edgeware") {
      return token.detail[token.token];
    } else if (sourceSelected === "icefrog") {
      return token.detail['POWER'];
    } else {
      return token.detail[currency];
    }
  }
  return {};
}

export function formatSymbol(module, $const, sourceSelected, isValidate) {
  if (!$const[`SYMBOL/${sourceSelected}`]) {
    return "";
  }
  if (isValidate && sourceSelected === 'icefrog') {
    return $const[`SYMBOL/${sourceSelected}`]['power'].value || "";
  } else {
    return $const[`SYMBOL/${sourceSelected}`][module].value || "";
  }
}
