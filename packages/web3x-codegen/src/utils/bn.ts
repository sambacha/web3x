import BN from 'bn.js';
import { numberToBN } from './number-to-bn';

/**
 * Returns true if object is BN, otherwise false
 *
 * @method isBN
 * @param {Object} object
 * @return {Boolean}
 */
export var isBN = function(object) {
  return object instanceof BN || (object && object.constructor && object.constructor.name === 'BN');
};

/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 * @param {Number|String|BN} number, string, HEX string or BN
 * @return {BN} BN
 */
export var toBN = function(number: number | string | BN) {
  try {
    return numberToBN.apply(null, arguments);
  } catch (e) {
    throw new Error(e + ' Given value: "' + number + '"');
  }
};

/**
 * Takes and input transforms it into BN and if it is negative value, into two's complement
 *
 * @method toTwosComplement
 * @param {Number|String|BN} number
 * @return {String}
 */
export var toTwosComplement = function(number: number | string | BN) {
  return (
    '0x' +
    toBN(number)
      .toTwos(256)
      .toString(16, 64)
  );
};