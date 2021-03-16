import { inputTransactionFormatter } from './input-transaction-formatter';

const tests = [
  {
    input: {
      data: '0x34234bf23bf4234',
      value: '100',
      from: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // checksum address
      to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
      nonce: 1000,
      gas: 1000,
      gasPrice: '1000',
    },
    result: {
      data: '0x34234bf23bf4234',
      value: '0x64',
      from: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
      to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
      nonce: '0x3e8',
      gas: '0x3e8',
      gasPrice: '0x3e8',
    },
  },
  {
    input: {
      data: '0x34234bf23bf4234',
      value: '100',
      from: '00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe', // checksum address
    },
    result: {
      data: '0x34234bf23bf4234',
      value: '0x64',
      from: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      to: '0x11f4d0a3c12e86b4b5f39b213f7e19d048276dae',
    },
  },
  {
    input: {
      data: '0x34234bf23bf4234',
      value: '100',
      from: '00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      to: '00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      gas: '1000',
      gasPrice: '1000',
    },
    result: {
      data: '0x34234bf23bf4234',
      value: '0x64',
      from: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      to: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      gas: '0x3e8',
      gasPrice: '0x3e8',
    },
  },
  {
    input: {
      data: '0x34234bf23bf4234',
      value: '100',
      from: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
      to: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
      gas: '1000',
      gasPrice: '1000',
    },
    result: {
      data: '0x34234bf23bf4234',
      value: '0x64',
      from: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      to: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      gas: '0x3e8',
      gasPrice: '0x3e8',
    },
  },
  {
    input: {
      data: '0x34234bf23bf4234',
      value: '100',
      from: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS',
      gas: '1000',
      gasPrice: '1000',
    },
    result: {
      data: '0x34234bf23bf4234',
      value: '0x64',
      from: '0x00c5496aee77c1ba1f0854206a26dda82a81d6d8',
      gas: '0x3e8',
      gasPrice: '0x3e8',
    },
  },
];

describe('core-helpers', () => {
  describe('formatters', () => {
    describe('inputTransactionFormatter', function() {
      tests.forEach(function(test) {
        it('should return the correct value', function() {
          expect(inputTransactionFormatter(test.input)).toEqual(test.result);
        });
      });
    });
  });
});
