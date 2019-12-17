const Int32 = {
  minValue: -parseInt('10000000000000000000000000000000', 2),
  maxValue: parseInt('1111111111111111111111111111111', 2),
  parse: function (n) {
    if (n < this.minValue) {
      var bigInteger = new Number(-n);
      var bigIntegerRadix = bigInteger.toString(2);
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 31, 31);
      var reBigIntegerRadix = '';
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1);
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2);
      return (result + 1)
    } else if (n > this.maxValue) {
      var bigInteger = Number(n);
      var bigIntegerRadix = bigInteger.toString(2);
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 31, 31);
      var reBigIntegerRadix = '';
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1);
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2);
      return -(result + 1)
    } else {
      return n
    }
  },
  parseByte: function (n) {
    if (n < 0) {
      var bigInteger = new Number(-n);
      var bigIntegerRadix = bigInteger.toString(2);
      var subBigIntegerRadix = bigIntegerRadix.substr(bigIntegerRadix.length - 8, 8);
      var reBigIntegerRadix = '';
      for (var i = 0; i < subBigIntegerRadix.length; i++) {
        var subBigIntegerRadixItem = subBigIntegerRadix.substr(i, 1);
        reBigIntegerRadix += subBigIntegerRadixItem == '0' ? '1' : '0'
      }
      var result = parseInt(reBigIntegerRadix, 2);
      return (result + 1)
    } else if (n > 255) {
      var bigInteger = Number(n);
      var bigIntegerRadix = bigInteger.toString(2);
      return parseInt(bigIntegerRadix.substr(bigIntegerRadix.length - 8, 8), 2)
    } else {
      return n
    }
  }
};
module.exports = Int32