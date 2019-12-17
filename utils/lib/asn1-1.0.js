/*! asn1-1.0.4.js (c) 2013 Kenji Urushima | kjur.github.com/jsrsasign/license
 */
/*
 * asn1.js - ASN.1 DER encoder classes
 *
 * Copyright (c) 2013 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * http://kjur.github.com/jsrsasign/license
 *
 * The above copyright and license notice shall be 
 * included in all copies or substantial portions of the Software.
 */

/**
 * @fileOverview
 * @name asn1-1.0.js
 * @author Kenji Urushima kenji.urushima@gmail.com
 * @version asn1 1.0.4 (2013-Oct-02)
 * @since jsrsasign 2.1
 * @license <a href="http://MCSCA.github.io/jsrsasign/license/">MIT License</a>
 */

/**
 * MCSCA's class library name space
 * <p>
 * This name space provides following name spaces:
 * <ul>
 * <li>{@link MCSCA.asn1} - ASN.1 primitive hexadecimal encoder</li>
 * <li>{@link MCSCA.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
 * <li>{@link MCSCA.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
 * class and utilities</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * @name MCSCA
 * @namespace MCSCA's class library name space
 */
const YAHOO = require('./yahoo-min');
const MCSCA = require('./ecdsa-modified-1.0');
if (typeof MCSCA == "undefined" || !MCSCA) MCSCA = {};

/**
 * MCSCA's ASN.1 class library name space
 * <p>
 * This is ITU-T X.690 ASN.1 DER encoder class library and
 * class structure and methods is very similar to
 * org.bouncycastle.asn1 package of
 * well known BouncyCaslte Cryptography Library.
 *
 * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
 * Here are ASN.1 DER primitive classes.
 * <ul>
 * <li>0x01 {@link MCSCA.asn1.DERBoolean}</li>
 * <li>0x02 {@link MCSCA.asn1.DERInteger}</li>
 * <li>0x03 {@link MCSCA.asn1.DERBitString}</li>
 * <li>0x04 {@link MCSCA.asn1.DEROctetString}</li>
 * <li>0x05 {@link MCSCA.asn1.DERNull}</li>
 * <li>0x06 {@link MCSCA.asn1.DERObjectIdentifier}</li>
 * <li>0x0c {@link MCSCA.asn1.DERUTF8String}</li>
 * <li>0x12 {@link MCSCA.asn1.DERNumericString}</li>
 * <li>0x13 {@link MCSCA.asn1.DERPrintableString}</li>
 * <li>0x14 {@link MCSCA.asn1.DERTeletexString}</li>
 * <li>0x16 {@link MCSCA.asn1.DERIA5String}</li>
 * <li>0x17 {@link MCSCA.asn1.DERUTCTime}</li>
 * <li>0x18 {@link MCSCA.asn1.DERGeneralizedTime}</li>
 * <li>0x30 {@link MCSCA.asn1.DERSequence}</li>
 * <li>0x31 {@link MCSCA.asn1.DERSet}</li>
 * </ul>
 *
 * <h4>OTHER ASN.1 CLASSES</h4>
 * <ul>
 * <li>{@link MCSCA.asn1.ASN1Object}</li>
 * <li>{@link MCSCA.asn1.DERAbstractString}</li>
 * <li>{@link MCSCA.asn1.DERAbstractTime}</li>
 * <li>{@link MCSCA.asn1.DERAbstractStructured}</li>
 * <li>{@link MCSCA.asn1.DERTaggedObject}</li>
 * </ul>
 * </p>
 * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
 * @name MCSCA.asn1
 * @namespace
 */
if (typeof MCSCA.asn1 == "undefined" || !MCSCA.asn1) MCSCA.asn1 = {};

/**
 * ASN1 utilities class
 * @name MCSCA.asn1.ASN1Util
 * @class ASN1 utilities class
 * @since asn1 1.0.2
 */
MCSCA.asn1.ASN1Util = new function () {
  this.integerToByteHex = function (i) {
    var h = i.toString(16);
    if ((h.length % 2) == 1) h = '0' + h;
    return h;
  };
  this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
    var h = bigIntegerValue.toString(16);
    if (h.substr(0, 1) != '-') {
      if (h.length % 2 == 1) {
        h = '0' + h;
      } else {
        if (!h.match(/^[0-7]/)) {
          h = '00' + h;
        }
      }
    } else {
      var hPos = h.substr(1);
      var xorLen = hPos.length;
      if (xorLen % 2 == 1) {
        xorLen += 1;
      } else {
        if (!h.match(/^[0-7]/)) {
          xorLen += 2;
        }
      }
      var hMask = '';
      for (var i = 0; i < xorLen; i++) {
        hMask += 'f';
      }
      var biMask = new BigInteger(hMask, 16);
      var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
      h = biNeg.toString(16).replace(/^-/, '');
    }
    return h;
  };
  /**
   * get PEM string from hexadecimal data and header string
   * @name getPEMStringFromHex
   * @memberOf MCSCA.asn1.ASN1Util
   * @function
   * @param {String} dataHex hexadecimal string of PEM body
   * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
   * @return {String} PEM formatted string of input data
   * @description
   * @example
   * var pem  = MCSCA.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
   * // value of pem will be:
   * -----BEGIN PRIVATE KEY-----
   * YWFh
   * -----END PRIVATE KEY-----
   */
  this.getPEMStringFromHex = function (dataHex, pemHeader) {
    var ns1 = MCSCA.asn1;
    var dataWA = CryptoJS.enc.Hex.parse(dataHex);
    var dataB64 = CryptoJS.enc.Base64.stringify(dataWA);
    var pemBody = dataB64.replace(/(.{64})/g, "$1\r\n");
    pemBody = pemBody.replace(/\r\n$/, '');
    return "-----BEGIN " + pemHeader + "-----\r\n" +
      pemBody +
      "\r\n-----END " + pemHeader + "-----\r\n";
  };

  /**
   * generate ASN1Object specifed by JSON parameters
   * @name newObject
   * @memberOf MCSCA.asn1.ASN1Util
   * @function
   * @param {Array} param JSON parameter to generate ASN1Object
   * @return {MCSCA.asn1.ASN1Object} generated object
   * @since asn1 1.0.3
   * @description
   * generate any ASN1Object specified by JSON param
   * including ASN.1 primitive or structured.
   * Generally 'param' can be described as follows:
   * <blockquote>
   * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
   * </blockquote>
   * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
   * <ul>
   * <li>'bool' - DERBoolean</li>
   * <li>'int' - DERInteger</li>
   * <li>'bitstr' - DERBitString</li>
   * <li>'octstr' - DEROctetString</li>
   * <li>'null' - DERNull</li>
   * <li>'oid' - DERObjectIdentifier</li>
   * <li>'utf8str' - DERUTF8String</li>
   * <li>'numstr' - DERNumericString</li>
   * <li>'prnstr' - DERPrintableString</li>
   * <li>'telstr' - DERTeletexString</li>
   * <li>'ia5str' - DERIA5String</li>
   * <li>'utctime' - DERUTCTime</li>
   * <li>'gentime' - DERGeneralizedTime</li>
   * <li>'seq' - DERSequence</li>
   * <li>'set' - DERSet</li>
   * <li>'tag' - DERTaggedObject</li>
   * </ul>
   * @example
   * newObject({'prnstr': 'aaa'});
   * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
   * // ASN.1 Tagged Object
   * newObject({'tag': {'tag': 'a1',
   *                    'explicit': true,
   *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
   * // more simple representation of ASN.1 Tagged Object
   * newObject({'tag': ['a1',
   *                    true,
   *                    {'seq': [
   *                      {'int': 3},
   *                      {'prnstr': 'aaa'}]}
   *                   ]});
   */
  this.newObject = function (param) {
    var ns1 = MCSCA.asn1;
    var keys = Object.keys(param);
    if (keys.length != 1)
      throw "key of param shall be only one.";
    var key = keys[0];

    if (":bool:int:bitstr:octstr:null:oid:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + key + ":") == -1)
      throw "undefined key: " + key;

    if (key == "bool") return new ns1.DERBoolean(param[key]);
    if (key == "int") return new ns1.DERInteger(param[key]);
    if (key == "bitstr") return new ns1.DERBitString(param[key]);
    if (key == "octstr") return new ns1.DEROctetString(param[key]);
    if (key == "null") return new ns1.DERNull(param[key]);
    if (key == "oid") return new ns1.DERObjectIdentifier(param[key]);
    if (key == "utf8str") return new ns1.DERUTF8String(param[key]);
    if (key == "numstr") return new ns1.DERNumericString(param[key]);
    if (key == "prnstr") return new ns1.DERPrintableString(param[key]);
    if (key == "telstr") return new ns1.DERTeletexString(param[key]);
    if (key == "ia5str") return new ns1.DERIA5String(param[key]);
    if (key == "utctime") return new ns1.DERUTCTime(param[key]);
    if (key == "gentime") return new ns1.DERGeneralizedTime(param[key]);

    if (key == "seq") {
      var paramList = param[key];
      var a = [];
      for (var i = 0; i < paramList.length; i++) {
        var asn1Obj = ns1.ASN1Util.newObject(paramList[i]);
        a.push(asn1Obj);
      }
      return new ns1.DERSequence({'array': a});
    }

    if (key == "set") {
      var paramList = param[key];
      var a = [];
      for (var i = 0; i < paramList.length; i++) {
        var asn1Obj = ns1.ASN1Util.newObject(paramList[i]);
        a.push(asn1Obj);
      }
      return new ns1.DERSet({'array': a});
    }

    if (key == "tag") {
      var tagParam = param[key];
      if (Object.prototype.toString.call(tagParam) === '[object Array]' &&
        tagParam.length == 3) {
        var obj = ns1.ASN1Util.newObject(tagParam[2]);
        return new ns1.DERTaggedObject({tag: tagParam[0], explicit: tagParam[1], obj: obj});
      } else {
        var newParam = {};
        if (tagParam.explicit !== undefined)
          newParam.explicit = tagParam.explicit;
        if (tagParam.tag !== undefined)
          newParam.tag = tagParam.tag;
        if (tagParam.obj === undefined)
          throw "obj shall be specified for 'tag'.";
        newParam.obj = ns1.ASN1Util.newObject(tagParam.obj);
        return new ns1.DERTaggedObject(newParam);
      }
    }
  };

  /**
   * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
   * @name jsonToASN1HEX
   * @memberOf MCSCA.asn1.ASN1Util
   * @function
   * @param {Array} param JSON parameter to generate ASN1Object
   * @return hexadecimal string of ASN1Object
   * @since asn1 1.0.4
   * @description
   * As for ASN.1 object representation of JSON object,
   * please see {@link newObject}.
   * @example
   * jsonToASN1HEX({'prnstr': 'aaa'});
   */
  this.jsonToASN1HEX = function (param) {
    var asn1Obj = this.newObject(param);
    return asn1Obj.getEncodedHex();
  };
};

// ********************************************************************
//  Abstract ASN.1 Classes
// ********************************************************************

// ********************************************************************

/**
 * base class for ASN.1 DER encoder object
 * @name MCSCA.asn1.ASN1Object
 * @class base class for ASN.1 DER encoder object
 * @property {Boolean} isModified flag whether internal data was changed
 * @property {String} hTLV hexadecimal string of ASN.1 TLV
 * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
 * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
 * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
 * @description
 */
MCSCA.asn1.ASN1Object = function () {
  var isModified = true;
  var hTLV = null;
  var hT = '00';
  var hL = '00';
  var hV = '';

  /**
   * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
   * @name getLengthHexFromValue
   * @memberOf MCSCA.asn1.ASN1Object
   * @function
   * @return {String} hexadecimal string of ASN.1 TLV length(L)
   */
  this.getLengthHexFromValue = function () {
    if (typeof this.hV == "undefined" || this.hV == null) {
      throw "this.hV is null or undefined.";
    }
    if (this.hV.length % 2 == 1) {
      throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
    }
    var n = this.hV.length / 2;
    var hN = n.toString(16);
    if (hN.length % 2 == 1) {
      hN = "0" + hN;
    }
    if (n < 128) {
      return hN;
    } else {
      var hNlen = hN.length / 2;
      if (hNlen > 15) {
        throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
      }
      var head = 128 + hNlen;
      return head.toString(16) + hN;
    }
  };

  /**
   * get hexadecimal string of ASN.1 TLV bytes
   * @name getEncodedHex
   * @memberOf MCSCA.asn1.ASN1Object
   * @function
   * @return {String} hexadecimal string of ASN.1 TLV
   */
  this.getEncodedHex = function () {
    if (this.hTLV == null || this.isModified) {
      this.hV = this.getFreshValueHex();
      this.hL = this.getLengthHexFromValue();
      this.hTLV = this.hT + this.hL + this.hV;
      this.isModified = false;
      //alert("first time: " + this.hTLV);
    }
    return this.hTLV;
  };

  /**
   * get hexadecimal string of ASN.1 TLV value(V) bytes
   * @name getValueHex
   * @memberOf MCSCA.asn1.ASN1Object
   * @function
   * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
   */
  this.getValueHex = function () {
    this.getEncodedHex();
    return this.hV;
  }

  this.getFreshValueHex = function () {
    return '';
  };
};

// == BEGIN DERAbstractString ================================================
/**
 * base class for ASN.1 DER string classes
 * @name MCSCA.asn1.DERAbstractString
 * @class base class for ASN.1 DER string classes
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @property {String} s internal string of value
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
MCSCA.asn1.DERAbstractString = function (params) {
  MCSCA.asn1.DERAbstractString.superclass.constructor.call(this);
  var s = null;
  var hV = null;

  /**
   * get string value of this string object
   * @name getString
   * @memberOf MCSCA.asn1.DERAbstractString
   * @function
   * @return {String} string value of this string object
   */
  this.getString = function () {
    return this.s;
  };

  /**
   * set value by a string
   * @name setString
   * @memberOf MCSCA.asn1.DERAbstractString
   * @function
   * @param {String} newS value by a string to set
   */
  this.setString = function (newS) {
    this.hTLV = null;
    this.isModified = true;
    this.s = newS;
    this.hV = stohex(this.s);
  };

  /**
   * set value by a hexadecimal string
   * @name setStringHex
   * @memberOf MCSCA.asn1.DERAbstractString
   * @function
   * @param {String} newHexString value by a hexadecimal string to set
   */
  this.setStringHex = function (newHexString) {
    this.hTLV = null;
    this.isModified = true;
    this.s = null;
    this.hV = newHexString;
  };

  this.getFreshValueHex = function () {
    return this.hV;
  };

  if (typeof params != "undefined") {
    if (typeof params == "string") {
      this.setString(params);
    } else if (typeof params['str'] != "undefined") {
      this.setString(params['str']);
    } else if (typeof params['hex'] != "undefined") {
      this.setStringHex(params['hex']);
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERAbstractString, MCSCA.asn1.ASN1Object);
// == END   DERAbstractString ================================================

// == BEGIN DERAbstractTime ==================================================
/**
 * base class for ASN.1 DER Generalized/UTCTime class
 * @name MCSCA.asn1.DERAbstractTime
 * @class base class for ASN.1 DER Generalized/UTCTime class
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * @see MCSCA.asn1.ASN1Object - superclass
 */
MCSCA.asn1.DERAbstractTime = function (params) {
  MCSCA.asn1.DERAbstractTime.superclass.constructor.call(this);
  var s = null;
  var date = null;

  // --- PRIVATE METHODS --------------------
  this.localDateToUTC = function (d) {
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var utcDate = new Date(utc);
    return utcDate;
  };

  this.formatDate = function (dateObject, type) {
    var pad = this.zeroPadding;
    var d = this.localDateToUTC(dateObject);
    var year = String(d.getFullYear());
    if (type == 'utc') year = year.substr(2, 2);
    var month = pad(String(d.getMonth() + 1), 2);
    var day = pad(String(d.getDate()), 2);
    var hour = pad(String(d.getHours()), 2);
    var min = pad(String(d.getMinutes()), 2);
    var sec = pad(String(d.getSeconds()), 2);
    return year + month + day + hour + min + sec + 'Z';
  };

  this.zeroPadding = function (s, len) {
    if (s.length >= len) return s;
    return new Array(len - s.length + 1).join('0') + s;
  };

  // --- PUBLIC METHODS --------------------
  /**
   * get string value of this string object
   * @name getString
   * @memberOf MCSCA.asn1.DERAbstractTime
   * @function
   * @return {String} string value of this time object
   */
  this.getString = function () {
    return this.s;
  };

  /**
   * set value by a string
   * @name setString
   * @memberOf MCSCA.asn1.DERAbstractTime
   * @function
   * @param {String} newS value by a string to set such like "130430235959Z"
   */
  this.setString = function (newS) {
    this.hTLV = null;
    this.isModified = true;
    this.s = newS;
    this.hV = stohex(newS);
  };

  /**
   * set value by a Date object
   * @name setByDateValue
   * @memberOf MCSCA.asn1.DERAbstractTime
   * @function
   * @param {Integer} year year of date (ex. 2013)
   * @param {Integer} month month of date between 1 and 12 (ex. 12)
   * @param {Integer} day day of month
   * @param {Integer} hour hours of date
   * @param {Integer} min minutes of date
   * @param {Integer} sec seconds of date
   */
  this.setByDateValue = function (year, month, day, hour, min, sec) {
    var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
    this.setByDate(dateObject);
  };

  this.getFreshValueHex = function () {
    return this.hV;
  };
};
YAHOO.lang.extend(MCSCA.asn1.DERAbstractTime, MCSCA.asn1.ASN1Object);
// == END   DERAbstractTime ==================================================

// == BEGIN DERAbstractStructured ============================================
/**
 * base class for ASN.1 DER structured class
 * @name MCSCA.asn1.DERAbstractStructured
 * @class base class for ASN.1 DER structured class
 * @property {Array} asn1Array internal array of ASN1Object
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * @see MCSCA.asn1.ASN1Object - superclass
 */
MCSCA.asn1.DERAbstractStructured = function (params) {
  MCSCA.asn1.DERAbstractString.superclass.constructor.call(this);
  var asn1Array = null;

  /**
   * set value by array of ASN1Object
   * @name setByASN1ObjectArray
   * @memberOf MCSCA.asn1.DERAbstractStructured
   * @function
   * @param {array} asn1ObjectArray array of ASN1Object to set
   */
  this.setByASN1ObjectArray = function (asn1ObjectArray) {
    this.hTLV = null;
    this.isModified = true;
    this.asn1Array = asn1ObjectArray;
  };

  /**
   * append an ASN1Object to internal array
   * @name appendASN1Object
   * @memberOf MCSCA.asn1.DERAbstractStructured
   * @function
   * @param {ASN1Object} asn1Object to add
   */
  this.appendASN1Object = function (asn1Object) {
    this.hTLV = null;
    this.isModified = true;
    this.asn1Array.push(asn1Object);
  };

  this.asn1Array = new Array();
  if (typeof params != "undefined") {
    if (typeof params['array'] != "undefined") {
      this.asn1Array = params['array'];
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERAbstractStructured, MCSCA.asn1.ASN1Object);


// ********************************************************************
//  ASN.1 Object Classes
// ********************************************************************

// ********************************************************************
/**
 * class for ASN.1 DER Boolean
 * @name MCSCA.asn1.DERBoolean
 * @class class for ASN.1 DER Boolean
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * @see MCSCA.asn1.ASN1Object - superclass
 */
MCSCA.asn1.DERBoolean = function () {
  MCSCA.asn1.DERBoolean.superclass.constructor.call(this);
  this.hT = "01";
  this.hTLV = "0101ff";
};
YAHOO.lang.extend(MCSCA.asn1.DERBoolean, MCSCA.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER Integer
 * @name MCSCA.asn1.DERInteger
 * @class class for ASN.1 DER Integer
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>int - specify initial ASN.1 value(V) by integer value</li>
 * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
MCSCA.asn1.DERInteger = function (params) {
  MCSCA.asn1.DERInteger.superclass.constructor.call(this);
  this.hT = "02";

  /**
   * set value by Tom Wu's BigInteger object
   * @name setByBigInteger
   * @memberOf MCSCA.asn1.DERInteger
   * @function
   * @param {BigInteger} bigIntegerValue to set
   */
  this.setByBigInteger = function (bigIntegerValue) {
    this.hTLV = null;
    this.isModified = true;
    this.hV = MCSCA.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
  };

  /**
   * set value by integer value
   * @name setByInteger
   * @memberOf MCSCA.asn1.DERInteger
   * @function
   * @param {Integer} integer value to set
   */
  this.setByInteger = function (intValue) {
    var bi = new BigInteger(String(intValue), 10);
    this.setByBigInteger(bi);
  };

  /**
   * set value by integer value
   * @name setValueHex
   * @memberOf MCSCA.asn1.DERInteger
   * @function
   * @param {String} hexadecimal string of integer value
   * @description
   * <br/>
   * NOTE: Value shall be represented by minimum octet length of
   * two's complement representation.
   * @example
   * new MCSCA.asn1.DERInteger(123);
   * new MCSCA.asn1.DERInteger({'int': 123});
   * new MCSCA.asn1.DERInteger({'hex': '1fad'});
   */
  this.setValueHex = function (newHexString) {
    this.hV = newHexString;
  };

  this.getFreshValueHex = function () {
    return this.hV;
  };

  if (typeof params != "undefined") {
    if (typeof params['bigint'] != "undefined") {
      this.setByBigInteger(params['bigint']);
    } else if (typeof params['int'] != "undefined") {
      this.setByInteger(params['int']);
    } else if (typeof params == "number") {
      this.setByInteger(params);
    } else if (typeof params['hex'] != "undefined") {
      this.setValueHex(params['hex']);
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERInteger, MCSCA.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER encoded BitString primitive
 * @name MCSCA.asn1.DERBitString
 * @class class for ASN.1 DER encoded BitString primitive
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>bin - specify binary string (ex. '10111')</li>
 * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
 * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
MCSCA.asn1.DERBitString = function (params) {
  MCSCA.asn1.DERBitString.superclass.constructor.call(this);
  this.hT = "03";

  /**
   * set ASN.1 value(V) by a hexadecimal string including unused bits
   * @name setHexValueIncludingUnusedBits
   * @memberOf MCSCA.asn1.DERBitString
   * @function
   * @param {String} newHexStringIncludingUnusedBits
   */
  this.setHexValueIncludingUnusedBits = function (newHexStringIncludingUnusedBits) {
    this.hTLV = null;
    this.isModified = true;
    this.hV = newHexStringIncludingUnusedBits;
  };

  /**
   * set ASN.1 value(V) by unused bit and hexadecimal string of value
   * @name setUnusedBitsAndHexValue
   * @memberOf MCSCA.asn1.DERBitString
   * @function
   * @param {Integer} unusedBits
   * @param {String} hValue
   */
  this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
    if (unusedBits < 0 || 7 < unusedBits) {
      throw "unused bits shall be from 0 to 7: u = " + unusedBits;
    }
    var hUnusedBits = "0" + unusedBits;
    this.hTLV = null;
    this.isModified = true;
    this.hV = hUnusedBits + hValue;
  };

  /**
   * set ASN.1 DER BitString by binary string
   * @name setByBinaryString
   * @memberOf MCSCA.asn1.DERBitString
   * @function
   * @param {String} binaryString binary value string (i.e. '10111')
   * @description
   * Its unused bits will be calculated automatically by length of
   * 'binaryValue'. <br/>
   * NOTE: Trailing zeros '0' will be ignored.
   */
  this.setByBinaryString = function (binaryString) {
    binaryString = binaryString.replace(/0+$/, '');
    var unusedBits = 8 - binaryString.length % 8;
    if (unusedBits == 8) unusedBits = 0;
    for (var i = 0; i <= unusedBits; i++) {
      binaryString += '0';
    }
    var h = '';
    for (var i = 0; i < binaryString.length - 1; i += 8) {
      var b = binaryString.substr(i, 8);
      var x = parseInt(b, 2).toString(16);
      if (x.length == 1) x = '0' + x;
      h += x;
    }
    this.hTLV = null;
    this.isModified = true;
    this.hV = '0' + unusedBits + h;
  };

  /**
   * set ASN.1 TLV value(V) by an array of boolean
   * @name setByBooleanArray
   * @memberOf MCSCA.asn1.DERBitString
   * @function
   * @param {array} booleanArray array of boolean (ex. [true, false, true])
   * @description
   * NOTE: Trailing falses will be ignored.
   */
  this.setByBooleanArray = function (booleanArray) {
    var s = '';
    for (var i = 0; i < booleanArray.length; i++) {
      if (booleanArray[i] == true) {
        s += '1';
      } else {
        s += '0';
      }
    }
    this.setByBinaryString(s);
  };

  /**
   * generate an array of false with specified length
   * @name newFalseArray
   * @memberOf MCSCA.asn1.DERBitString
   * @function
   * @param {Integer} nLength length of array to generate
   * @return {array} array of boolean faluse
   * @description
   * This static method may be useful to initialize boolean array.
   */
  this.newFalseArray = function (nLength) {
    var a = new Array(nLength);
    for (var i = 0; i < nLength; i++) {
      a[i] = false;
    }
    return a;
  };

  this.getFreshValueHex = function () {
    return this.hV;
  };

  if (typeof params != "undefined") {
    if (typeof params == "string" && params.toLowerCase().match(/^[0-9a-f]+$/)) {
      this.setHexValueIncludingUnusedBits(params);
    } else if (typeof params['hex'] != "undefined") {
      this.setHexValueIncludingUnusedBits(params['hex']);
    } else if (typeof params['bin'] != "undefined") {
      this.setByBinaryString(params['bin']);
    } else if (typeof params['array'] != "undefined") {
      this.setByBooleanArray(params['array']);
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERBitString, MCSCA.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER OctetString
 * @name MCSCA.asn1.DEROctetString
 * @class class for ASN.1 DER OctetString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends MCSCA.asn1.DERAbstractString
 * @description
 * @see MCSCA.asn1.DERAbstractString - superclass
 */
MCSCA.asn1.DEROctetString = function (params) {
  MCSCA.asn1.DEROctetString.superclass.constructor.call(this, params);
  this.hT = "04";
};
YAHOO.lang.extend(MCSCA.asn1.DEROctetString, MCSCA.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER Null
 * @name MCSCA.asn1.DERNull
 * @class class for ASN.1 DER Null
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * @see MCSCA.asn1.ASN1Object - superclass
 */
MCSCA.asn1.DERNull = function () {
  MCSCA.asn1.DERNull.superclass.constructor.call(this);
  this.hT = "05";
  this.hTLV = "0500";
};
YAHOO.lang.extend(MCSCA.asn1.DERNull, MCSCA.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER ObjectIdentifier
 * @name MCSCA.asn1.DERObjectIdentifier
 * @class class for ASN.1 DER ObjectIdentifier
 * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
MCSCA.asn1.DERObjectIdentifier = function (params) {
  var itox = function (i) {
    var h = i.toString(16);
    if (h.length == 1) h = '0' + h;
    return h;
  };
  var roidtox = function (roid) {
    var h = '';
    var bi = new BigInteger(roid, 10);
    var b = bi.toString(2);
    var padLen = 7 - b.length % 7;
    if (padLen == 7) padLen = 0;
    var bPad = '';
    for (var i = 0; i < padLen; i++) bPad += '0';
    b = bPad + b;
    for (var i = 0; i < b.length - 1; i += 7) {
      var b8 = b.substr(i, 7);
      if (i != b.length - 7) b8 = '1' + b8;
      h += itox(parseInt(b8, 2));
    }
    return h;
  }

  MCSCA.asn1.DERObjectIdentifier.superclass.constructor.call(this);
  this.hT = "06";

  /**
   * set value by a hexadecimal string
   * @name setValueHex
   * @memberOf MCSCA.asn1.DERObjectIdentifier
   * @function
   * @param {String} newHexString hexadecimal value of OID bytes
   */
  this.setValueHex = function (newHexString) {
    this.hTLV = null;
    this.isModified = true;
    this.s = null;
    this.hV = newHexString;
  };

  /**
   * set value by a OID string
   * @name setValueOidString
   * @memberOf MCSCA.asn1.DERObjectIdentifier
   * @function
   * @param {String} oidString OID string (ex. 2.5.4.13)
   */
  this.setValueOidString = function (oidString) {
    if (!oidString.match(/^[0-9.]+$/)) {
      throw "malformed oid string: " + oidString;
    }
    var h = '';
    var a = oidString.split('.');
    var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
    h += itox(i0);
    a.splice(0, 2);
    for (var i = 0; i < a.length; i++) {
      h += roidtox(a[i]);
    }
    this.hTLV = null;
    this.isModified = true;
    this.s = null;
    this.hV = h;
  };

  /**
   * set value by a OID name
   * @name setValueName
   * @memberOf MCSCA.asn1.DERObjectIdentifier
   * @function
   * @param {String} oidName OID name (ex. 'serverAuth')
   * @since 1.0.1
   * @description
   * OID name shall be defined in 'MCSCA.asn1.x509.OID.name2oidList'.
   * Otherwise raise error.
   */
  this.setValueName = function (oidName) {
    if (typeof MCSCA.asn1.x509.OID.name2oidList[oidName] != "undefined") {
      var oid = MCSCA.asn1.x509.OID.name2oidList[oidName];
      this.setValueOidString(oid);
    } else {
      throw "DERObjectIdentifier oidName undefined: " + oidName;
    }
  };

  this.getFreshValueHex = function () {
    return this.hV;
  };

  if (typeof params != "undefined") {
    if (typeof params == "string" && params.match(/^[0-2].[0-9.]+$/)) {
      this.setValueOidString(params);
    } else if (MCSCA.asn1.x509.OID.name2oidList[params] !== undefined) {
      this.setValueOidString(MCSCA.asn1.x509.OID.name2oidList[params]);
    } else if (typeof params['oid'] != "undefined") {
      this.setValueOidString(params['oid']);
    } else if (typeof params['hex'] != "undefined") {
      this.setValueHex(params['hex']);
    } else if (typeof params['name'] != "undefined") {
      this.setValueName(params['name']);
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERObjectIdentifier, MCSCA.asn1.ASN1Object);

// ********************************************************************
/**
 * class for ASN.1 DER UTF8String
 * @name MCSCA.asn1.DERUTF8String
 * @class class for ASN.1 DER UTF8String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends MCSCA.asn1.DERAbstractString
 * @description
 * @see MCSCA.asn1.DERAbstractString - superclass
 */
MCSCA.asn1.DERUTF8String = function (params) {
  MCSCA.asn1.DERUTF8String.superclass.constructor.call(this, params);
  this.hT = "0c";
};
YAHOO.lang.extend(MCSCA.asn1.DERUTF8String, MCSCA.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER NumericString
 * @name MCSCA.asn1.DERNumericString
 * @class class for ASN.1 DER NumericString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends MCSCA.asn1.DERAbstractString
 * @description
 * @see MCSCA.asn1.DERAbstractString - superclass
 */
MCSCA.asn1.DERNumericString = function (params) {
  MCSCA.asn1.DERNumericString.superclass.constructor.call(this, params);
  this.hT = "12";
};
YAHOO.lang.extend(MCSCA.asn1.DERNumericString, MCSCA.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER PrintableString
 * @name MCSCA.asn1.DERPrintableString
 * @class class for ASN.1 DER PrintableString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends MCSCA.asn1.DERAbstractString
 * @description
 * @see MCSCA.asn1.DERAbstractString - superclass
 */
MCSCA.asn1.DERPrintableString = function (params) {
  MCSCA.asn1.DERPrintableString.superclass.constructor.call(this, params);
  this.hT = "13";
};
YAHOO.lang.extend(MCSCA.asn1.DERPrintableString, MCSCA.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER TeletexString
 * @name MCSCA.asn1.DERTeletexString
 * @class class for ASN.1 DER TeletexString
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends MCSCA.asn1.DERAbstractString
 * @description
 * @see MCSCA.asn1.DERAbstractString - superclass
 */
MCSCA.asn1.DERTeletexString = function (params) {
  MCSCA.asn1.DERTeletexString.superclass.constructor.call(this, params);
  this.hT = "14";
};
YAHOO.lang.extend(MCSCA.asn1.DERTeletexString, MCSCA.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER IA5String
 * @name MCSCA.asn1.DERIA5String
 * @class class for ASN.1 DER IA5String
 * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
 * @extends MCSCA.asn1.DERAbstractString
 * @description
 * @see MCSCA.asn1.DERAbstractString - superclass
 */
MCSCA.asn1.DERIA5String = function (params) {
  MCSCA.asn1.DERIA5String.superclass.constructor.call(this, params);
  this.hT = "16";
};
YAHOO.lang.extend(MCSCA.asn1.DERIA5String, MCSCA.asn1.DERAbstractString);

// ********************************************************************
/**
 * class for ASN.1 DER UTCTime
 * @name MCSCA.asn1.DERUTCTime
 * @class class for ASN.1 DER UTCTime
 * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
 * @extends MCSCA.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 * <h4>EXAMPLES</h4>
 * @example
 * var d1 = new MCSCA.asn1.DERUTCTime();
 * d1.setString('130430125959Z');
 *
 * var d2 = new MCSCA.asn1.DERUTCTime({'str': '130430125959Z'});
 * var d3 = new MCSCA.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
 * var d4 = new MCSCA.asn1.DERUTCTime('130430125959Z');
 */
MCSCA.asn1.DERUTCTime = function (params) {
  MCSCA.asn1.DERUTCTime.superclass.constructor.call(this, params);
  this.hT = "17";

  /**
   * set value by a Date object
   * @name setByDate
   * @memberOf MCSCA.asn1.DERUTCTime
   * @function
   * @param {Date} dateObject Date object to set ASN.1 value(V)
   */
  this.setByDate = function (dateObject) {
    this.hTLV = null;
    this.isModified = true;
    this.date = dateObject;
    this.s = this.formatDate(this.date, 'utc');
    this.hV = stohex(this.s);
  };

  if (typeof params != "undefined") {
    if (typeof params['str'] != "undefined") {
      this.setString(params['str']);
    } else if (typeof params == "string" && params.match(/^[0-9]{12}Z$/)) {
      this.setString(params);
    } else if (typeof params['hex'] != "undefined") {
      this.setStringHex(params['hex']);
    } else if (typeof params['date'] != "undefined") {
      this.setByDate(params['date']);
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERUTCTime, MCSCA.asn1.DERAbstractTime);

// ********************************************************************
/**
 * class for ASN.1 DER GeneralizedTime
 * @name MCSCA.asn1.DERGeneralizedTime
 * @class class for ASN.1 DER GeneralizedTime
 * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
 * @extends MCSCA.asn1.DERAbstractTime
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
 * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
 * <li>date - specify Date object.</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
MCSCA.asn1.DERGeneralizedTime = function (params) {
  MCSCA.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
  this.hT = "18";

  /**
   * set value by a Date object
   * @name setByDate
   * @memberOf MCSCA.asn1.DERGeneralizedTime
   * @function
   * @param {Date} dateObject Date object to set ASN.1 value(V)
   * @example
   * When you specify UTC time, use 'Date.UTC' method like this:<br/>
   * var o = new DERUTCTime();
   * var date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
   * o.setByDate(date);
   */
  this.setByDate = function (dateObject) {
    this.hTLV = null;
    this.isModified = true;
    this.date = dateObject;
    this.s = this.formatDate(this.date, 'gen');
    this.hV = stohex(this.s);
  };

  if (typeof params != "undefined") {
    if (typeof params['str'] != "undefined") {
      this.setString(params['str']);
    } else if (typeof params == "string" && params.match(/^[0-9]{14}Z$/)) {
      this.setString(params);
    } else if (typeof params['hex'] != "undefined") {
      this.setStringHex(params['hex']);
    } else if (typeof params['date'] != "undefined") {
      this.setByDate(params['date']);
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERGeneralizedTime, MCSCA.asn1.DERAbstractTime);

// ********************************************************************
/**
 * class for ASN.1 DER Sequence
 * @name MCSCA.asn1.DERSequence
 * @class class for ASN.1 DER Sequence
 * @extends MCSCA.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
MCSCA.asn1.DERSequence = function (params) {
  MCSCA.asn1.DERSequence.superclass.constructor.call(this, params);
  this.hT = "30";
  this.getFreshValueHex = function () {
    var h = '';
    for (var i = 0; i < this.asn1Array.length; i++) {
      var asn1Obj = this.asn1Array[i];
      h += asn1Obj.getEncodedHex();
    }
    this.hV = h;
    return this.hV;
  };
};
YAHOO.lang.extend(MCSCA.asn1.DERSequence, MCSCA.asn1.DERAbstractStructured);

// ********************************************************************
/**
 * class for ASN.1 DER Set
 * @name MCSCA.asn1.DERSet
 * @class class for ASN.1 DER Set
 * @extends MCSCA.asn1.DERAbstractStructured
 * @description
 * <br/>
 * As for argument 'params' for constructor, you can specify one of
 * following properties:
 * <ul>
 * <li>array - specify array of ASN1Object to set elements of content</li>
 * </ul>
 * NOTE: 'params' can be omitted.
 */
MCSCA.asn1.DERSet = function (params) {
  MCSCA.asn1.DERSet.superclass.constructor.call(this, params);
  this.hT = "31";
  this.getFreshValueHex = function () {
    var a = new Array();
    for (var i = 0; i < this.asn1Array.length; i++) {
      var asn1Obj = this.asn1Array[i];
      a.push(asn1Obj.getEncodedHex());
    }
    a.sort();
    this.hV = a.join('');
    return this.hV;
  };
};
YAHOO.lang.extend(MCSCA.asn1.DERSet, MCSCA.asn1.DERAbstractStructured);

// ********************************************************************
/**
 * class for ASN.1 DER TaggedObject
 * @name MCSCA.asn1.DERTaggedObject
 * @class class for ASN.1 DER TaggedObject
 * @extends MCSCA.asn1.ASN1Object
 * @description
 * <br/>
 * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
 * For example, if you find '[1]' tag in a ASN.1 dump,
 * 'tagNoHex' will be 'a1'.
 * <br/>
 * As for optional argument 'params' for constructor, you can specify *ANY* of
 * following properties:
 * <ul>
 * <li>explicit - specify true if this is explicit tag otherwise false
 *     (default is 'true').</li>
 * <li>tag - specify tag (default is 'a0' which means [0])</li>
 * <li>obj - specify ASN1Object which is tagged</li>
 * </ul>
 * @example
 * d1 = new MCSCA.asn1.DERUTF8String({'str':'a'});
 * d2 = new MCSCA.asn1.DERTaggedObject({'obj': d1});
 * hex = d2.getEncodedHex();
 */
MCSCA.asn1.DERTaggedObject = function (params) {
  MCSCA.asn1.DERTaggedObject.superclass.constructor.call(this);
  this.hT = "a0";
  this.hV = '';
  this.isExplicit = true;
  this.asn1Object = null;

  /**
   * set value by an ASN1Object
   * @name setString
   * @memberOf MCSCA.asn1.DERTaggedObject
   * @function
   * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
   * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
   * @param {ASN1Object} asn1Object ASN.1 to encapsulate
   */
  this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
    this.hT = tagNoHex;
    this.isExplicit = isExplicitFlag;
    this.asn1Object = asn1Object;
    if (this.isExplicit) {
      this.hV = this.asn1Object.getEncodedHex();
      this.hTLV = null;
      this.isModified = true;
    } else {
      this.hV = null;
      this.hTLV = asn1Object.getEncodedHex();
      this.hTLV = this.hTLV.replace(/^../, tagNoHex);
      this.isModified = false;
    }
  };

  this.getFreshValueHex = function () {
    return this.hV;
  };

  if (typeof params != "undefined") {
    if (typeof params['tag'] != "undefined") {
      this.hT = params['tag'];
    }
    if (typeof params['explicit'] != "undefined") {
      this.isExplicit = params['explicit'];
    }
    if (typeof params['obj'] != "undefined") {
      this.asn1Object = params['obj'];
      this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
    }
  }
};
YAHOO.lang.extend(MCSCA.asn1.DERTaggedObject, MCSCA.asn1.ASN1Object);

module.exports = MCSCA