/**
 * Created by Administrator on 2017/3/22.
 */
/**
 * 日期格式化
 * @param strdate
 * @param fmt
 * @returns {*}
 */
export function dateformat (strdate, fmt) {
  const self = new Date(strdate)
  var o = {
    'M+': self.getMonth() + 1,                 // 月份
    'd+': self.getDate(),                    // 日
    'h+': self.getHours(),                   // 小时
    'm+': self.getMinutes(),                 // 分
    's+': self.getSeconds(),                 // 秒
    'q+': Math.floor((self.getMonth() + 3) / 3), // 季度
    'S': self.getMilliseconds()             // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (self.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}


/**
 * 数字前补0操作
 * @param num
 * @param length
 * @constructor
 */
export function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}
/**
 * 随机数
 * @param num
 * @param length
 * @constructor
 */
export function randNums(length) {
  var res = "";
  var chars = ['0','1','2','3','4','5','6','7','8','9'];
  for(var i = 0; i < length ; i ++) {
    var id = Math.ceil(Math.random()*10);
    if(id >= 10){
      id = 0;
    }
    res += chars[id];
  }
  return res;
}

function trim(str){ //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, ""); //过滤首尾空格为空
}

/**
 * 格式化电话号码
 * @param tel   电话号码
 * @param str   格式类型：3-4-4
 */
export function formatmobile(tel, str){
  var num=trim(tel); //获取号码并去左右空格
  var renum=""; //函数返回对象
  var arr=new Array();
  var i,m=0,n;
  if(str.indexOf('-')>-1){
    arr=str.split("-");
    for(i=0; i<arr.length; i++){
      n=m+Number(arr[i]);
      renum+=num.substring(m,n);
      if(i<arr.length-1) renum+="-";
      m=n;
    }
  }else{
    arr=str.split(" ");
    for(i=0; i<arr.length; i++){
      n=m+Number(arr[i]);
      renum+=num.substring(m,n);
      if(i<arr.length-1) renum+=" ";
      m=n;
    }
  }
  return renum;
}

/**
 * 只允许输入数字
 * @param value
 */
export function onlyNumber (event) {
  event.target.value = event.target.value.replace(/\D/g, '')
}

/**
 * 只允许输入电话号码
 * @param keyCode
 * @returns {boolean}
 */
export function onlyTelNumber (event) {
  if (event.keyCode !== 45 && (event.keyCode < 48 || event.keyCode > 57)) {
    event.returnValue = false
  }
}
