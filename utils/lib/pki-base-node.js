/**
 * @author jianbo.li
 * @email lijianbo@dlydyjy.com
 * @date 2019-12-06
 * @desc mcsca加密算法nodejs版本
 */
const CryptoJS = require('crypto-js');
const SM3Digest = require('./sm3');
const MCSCA = require('./sm3-sm2-1.0');
const BigInteger = require('./jsbn2');
const { hex2b64, b642hex } = require('./base64');

/**
 * 排序待签名数据
 * @param data 待签名数据(Object类型)
 * @return Object|Boolean 排序后待签名数据(返回false表示排序失败)
 */
function sortData(data) {
  if (!data
    || typeof data !== 'object'
    || data instanceof Array
    || data instanceof Date
    || data instanceof Error) {
    return false;
  }
  var keys = Object.keys(data).sort();
  var result = {};
  // 先按照ANSCII码排序
  keys.forEach(function (key) {
    if (data[key] === undefined) return;
    if (data[key] === null) return;
    if (data[key] instanceof Array) {
      result[key] = data[key];
    } else if (data[key] instanceof Object) {
      result[key] = sortData(data[key]);
    } else {
      result[key] = data[key];
    }
  });

  return result;
}

/**
 * 加签字符串需要做urlstring处理
 * @param {Object} data 
 */
function sortDataNew (data) {
  var newData = sortData(data);
  return packSignStr(newData).join('&')
}
/**
 * 拼接字符串
 * 按照对象中的顺序拼装成urlString(a=1&b=2&c=3)
 * @param {Object} obj 
 */
function packSignStr (obj) {
  var arr = [];
  for(var key in obj) {
    if('sign' === key) {
      continue;
    }
    var value = obj[key];
    if(typeof value !== 'object') {
      if(value !== '' && value !== null) {
        arr.push(key + '=' + value);
      }
    } else {
      var objStr = key + '=';
      var tmpArr = packSignStr(value);
      arr.push(objStr + tmpArr.join('&'));
    }
  }
  return arr;
}

/**
 * SM3WithSM2数据签名
 * @param dataStr 签名原文字符串
 * @param sm2PrivateKeyHex SM2私钥(16进制)
 * @return string 签名值(base64格式)
 */
function digestDataBySM3WithSM2(dataStr, sm2PrivateKeyHex) {
  var sm3Digest = new SM3Digest();
  var parseData = CryptoJS.enc.Utf8.parse(dataStr);
  var asciiData = sm3Digest.GetWords(parseData.toString());
  var ec = new MCSCA.crypto.SM3withSM2({curve: "sm2"});
  var G = ec.ecparams['G'];
  var Q = G.multiply(new BigInteger(sm2PrivateKeyHex, 16));
  //SM2公钥16进制
  var sm2PublicKeyHex = Q.getX().toBigInteger().toRadix(16) + Q.getY().toBigInteger().toRadix(16);
  var Z = sm3Digest.GetZ(G, sm2PublicKeyHex);
  var sm3Hash = new Array(sm3Digest.GetDigestSize());
  sm3Digest.BlockUpdate(Z, 0, Z.length);
  sm3Digest.BlockUpdate(asciiData, 0, asciiData.length);
  sm3Digest.DoFinal(sm3Hash, 0);
  var hashHex = sm3Digest.GetHex(sm3Hash).toString();
  var signHex = ec.signHex(hashHex.toLocaleUpperCase(), sm2PrivateKeyHex);
  return hex2b64(signHex)
}

/**
 * SM3WithSM2数据验签
 * @param dataStr 签名原文字符串
 * @param signValue 签名值(base64格式)
 * @param sm2PublicKeyHex SM2公钥(16进制, 不带04)
 * @return boolean 签名值是否正确
 */
function verifyDataBySM3WithSM2(dataStr, signValue, sm2PublicKeyHex) {
  var sm3Digest = new SM3Digest();
  var parseData = CryptoJS.enc.Utf8.parse(dataStr);
  var asciiData = sm3Digest.GetWords(parseData.toString());
  var ec = new MCSCA.crypto.SM3withSM2({curve: "sm2"});
  var G = ec.ecparams['G'];
  var Z = sm3Digest.GetZ(G, sm2PublicKeyHex);
  var sm3Hash = new Array(sm3Digest.GetDigestSize());
  sm3Digest.BlockUpdate(Z, 0, Z.length);
  sm3Digest.BlockUpdate(asciiData, 0, asciiData.length);
  sm3Digest.DoFinal(sm3Hash, 0);
  var hashHex = sm3Digest.GetHex(sm3Hash).toString();
  return ec.verifyHex(hashHex, b642hex(signValue), '04' + sm2PublicKeyHex)
}


/**
 * SM3数据加密
 * @param dataStr 待加密数据字符串
 * @return string 加密结果(16进制)
 */
function digestDataBySM3(dataStr) {
  var sm3Digest = new SM3Digest();
  var parseData = CryptoJS.enc.Utf8.parse(dataStr);
  var asciiData = sm3Digest.GetWords(parseData.toString());
  var sm3Hash = new Array(sm3Digest.GetDigestSize());
  sm3Digest.BlockUpdate(asciiData, 0, asciiData.length);
  sm3Digest.DoFinal(sm3Hash, 0);
  return sm3Digest.GetHex(sm3Hash).toString().toLocaleUpperCase();
}

module.exports = {
  digestDataBySM3WithSM2,
  verifyDataBySM3WithSM2,
  digestDataBySM3,
  sortDataNew,
  sortData
}