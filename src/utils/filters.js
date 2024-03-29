import moment from "moment";
import {bnShift} from "./format";
export function timeAgo(time, now = Date.now(), shouldTruncate) {
  time = +time * 1000;
  const d = new Date(time);

  const diff = parseInt((now - d) / 1000);
  if (diff < 1) {
    return "0 sec ago";
  } else if (diff < 60) {
    return `${diff} ${diff === 1 ? "sec" : "secs"} ago`;
  } else if (diff < 3600) {
    // less 1 hour
    const min = Math.floor(diff / 60);
    return `${min} ${min === 1 ? "min" : "mins"} ago`;
  } else if (diff < 86400) {
    // less 1 day
    const hr = Math.floor(diff / 3600);
    const min = Math.floor((diff / 60) % 60);
    if (shouldTruncate) {
      return `${hr} ${hr === 1 ? "hr" : "hrs"} ago`;
    } else {
      return `${hr} ${hr === 1 ? "hr" : "hrs"}${
        min === 0 ? "" : min == 1 ? " 1 min" : ` ${min} mins`
      } ago`;
    }
  } else if (diff < 90000) {
    // less 1 day 60 min
    const day = Math.floor(diff / 86400);
    const min = Math.floor((diff / 60) % 60);
    if (shouldTruncate) {
      return `${day} ${day === 1 ? "day" : "days"} ago`;
    } else {
      return `${day} ${day === 1 ? "day" : "days"}${
        min === 0 ? "" : min == 1 ? " 1 min" : ` ${min} mins`
      } ago`;
    }
  } else {
    const day = Math.floor(diff / 86400);
    const hr = Math.floor((diff / 60 / 60) % 24);
    if (shouldTruncate) {
      return `${day} ${day === 1 ? "day" : "days"} ago`;
    } else {
      return `${day} ${day === 1 ? "day" : "days"}${
        hr === 0 ? "" : hr == 1 ? " 1 hr" : ` ${hr} hrs`
      } ago`;
    }
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }

  if ((time + "").length === 10) {
    time = +time * 1000;
  }

  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    date = new Date(parseInt(time));
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a")
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

export function parseTimeToUtc(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  if ((time + "").length >= 10) {
    time = +time * 1000;
  }
  const format = cFormat || "YYYY-MM-DD HH:mm:ss";
  let date = moment.utc(time);
  return `${date.format(format)} (+UTC)`;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export function toThousandslsFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

export function accuracyFormat(num, accuracy) {
  if (accuracy) {
    return scientificToDecimal(bnShift(num, -accuracy).toString());
  } else if (+accuracy === 0){
    return num;
  } else {
    return '';
  }
}

function scientificToDecimal(number) {
  let numberHasSign = number.startsWith("-") || number.startsWith("+");
  let sign = numberHasSign ? number[0] : "";
  number = numberHasSign ? number.replace(sign, "") : number;

  //if the number is in scientific notation remove it
  if (/\d+\.?\d*e[\\+\\-]*\d+/i.test(number)) {
    let zero = '0';
    let parts = String(number).toLowerCase().split('e'); //split into coeff and exponent
    let e = parts.pop();//store the exponential part
    let l = Math.abs(e); //get the number of zeros
    let sign = e / l;
    let coeff_array = parts[0].split('.');

    if (sign === -1) {
      coeff_array[0] = Math.abs(coeff_array[0]);
      number = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
    } else {
      let dec = coeff_array[1];
      if (dec) l = l - dec.length;
      number = coeff_array.join('') + new Array(l + 1).join(zero);
    }
  }

  return `${sign}${number}`;
}

export function hashFormat(hash) {
  if (hash === "") {
    return "";
  }
  if (hash.length > 12) {
    return `${hash.slice(0, 7)}....${hash.slice(-5)}`;
  } else {
    return hash;
  }
}
