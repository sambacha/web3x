import { sha3 } from '../../utils';
import { decodeEventABI } from './decode-event-abi';

describe('eth', () => {
  describe('contract', () => {
    describe('decode-event-abi', () => {
      it('decodeEventABI should return the decoded event object with topics', () => {
        const address = '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe';
        const signature = 'Changed(address,uint256,uint256,uint256)';
        const result = decodeEventABI.call(
          {
            signature: sha3(signature),
            name: 'Changed',
            type: 'event',
            inputs: [
              { name: 'from', type: 'address', indexed: true },
              { name: 'amount', type: 'uint256', indexed: true },
              { name: 't1', type: 'uint256', indexed: false },
              { name: 't2', type: 'uint256', indexed: false },
            ],
          },
          {
            address: address,
            topics: [
              sha3(signature),
              '0x000000000000000000000000' + address.replace('0x', ''),
              '0x0000000000000000000000000000000000000000000000000000000000000001',
            ],
            blockNumber: '0x3',
            transactionHash: '0x1234',
            blockHash: '0x1345',
            transactionIndex: '0x0',
            logIndex: '0x4',
            data:
              '0x0000000000000000000000000000000000000000000000000000000000000001' +
              '0000000000000000000000000000000000000000000000000000000000000008',
          },
        );

        expect(result.blockNumber).toBe(3);
        expect(result.blockHash).toBe('0x1345');
        expect(result.logIndex).toBe(4);
        expect(result.id).toBe('log_9ff24cb4');
        expect(result.transactionIndex).toBe(0);
        expect(result.returnValues.from).toBe(address);
        expect(result.returnValues.amount).toBe('1');
        expect(result.returnValues.t1).toBe('1');
        expect(result.returnValues.t2).toBe('8');
      });

      const name = 'event1';
      const address = '0xffddb67890123456789012345678901234567890';
      const resultAddress = '0xffdDb67890123456789012345678901234567890';

      var tests = [
        {
          abi: {
            name: name,
            type: 'event',
            inputs: [],
          },
          data: {
            logIndex: '0x1',
            transactionIndex: '0x10',
            transactionHash: '0x1234567890',
            address: address,
            blockHash: '0x1234567890',
            blockNumber: '0x1',
          },
          expected: {
            event: name,
            signature: null,
            returnValues: {},
            logIndex: 1,
            transactionIndex: 16,
            transactionHash: '0x1234567890',
            address: resultAddress,
            blockHash: '0x1234567890',
            blockNumber: 1,
            id: 'log_c71f2e84',
            raw: {
              topics: [],
              data: '',
            },
          },
        },
        {
          abi: {
            name: name,
            inputs: [
              {
                name: 'a',
                type: 'int',
                indexed: false,
              },
            ],
          },
          data: {
            logIndex: '0x1',
            transactionIndex: '0x10',
            transactionHash: '0x1234567890',
            address: address,
            blockHash: '0x1234567890',
            blockNumber: '0x1',
            data: '0x0000000000000000000000000000000000000000000000000000000000000001',
          },
          expected: {
            event: name,
            signature: null,
            returnValues: {
              0: '1',
              a: '1',
            },
            logIndex: 1,
            transactionIndex: 16,
            transactionHash: '0x1234567890',
            address: resultAddress,
            blockHash: '0x1234567890',
            blockNumber: 1,
            id: 'log_c71f2e84',
            raw: {
              data: '0x0000000000000000000000000000000000000000000000000000000000000001',
              topics: [],
            },
          },
        },
        {
          abi: {
            name: name,
            inputs: [
              {
                name: 'a',
                type: 'int',
                indexed: false,
              },
              {
                name: 'b',
                type: 'int',
                indexed: true,
              },
              {
                name: 'c',
                type: 'int',
                indexed: false,
              },
              {
                name: 'd',
                type: 'int',
                indexed: true,
              },
            ],
          },
          data: {
            logIndex: '0x1',
            transactionIndex: '0x10',
            transactionHash: '0x1234567890',
            address: address,
            blockHash: '0x1234567890',
            blockNumber: '0x1',
            data:
              '0x' +
              '0000000000000000000000000000000000000000000000000000000000000001' +
              '0000000000000000000000000000000000000000000000000000000000000004',
            topics: [
              address,
              '0x000000000000000000000000000000000000000000000000000000000000000a',
              '0x0000000000000000000000000000000000000000000000000000000000000010',
            ],
          },
          expected: {
            event: name,
            signature: address,
            returnValues: {
              0: '1',
              1: '10',
              2: '4',
              3: '16',
              a: '1',
              b: '10',
              c: '4',
              d: '16',
            },
            logIndex: 1,
            transactionIndex: 16,
            transactionHash: '0x1234567890',
            address: resultAddress,
            blockHash: '0x1234567890',
            blockNumber: 1,
            id: 'log_c71f2e84',
            raw: {
              data:
                '0x' +
                '0000000000000000000000000000000000000000000000000000000000000001' +
                '0000000000000000000000000000000000000000000000000000000000000004',
              topics: [
                address,
                '0x000000000000000000000000000000000000000000000000000000000000000a',
                '0x0000000000000000000000000000000000000000000000000000000000000010',
              ],
            },
          },
        },
        {
          abi: {
            name: name,
            anonymous: true,
            inputs: [
              {
                name: 'a',
                type: 'int',
                indexed: false,
              },
              {
                name: 'b',
                type: 'int',
                indexed: true,
              },
              {
                name: 'c',
                type: 'int',
                indexed: false,
              },
              {
                name: 'd',
                type: 'int',
                indexed: true,
              },
            ],
          },
          data: {
            logIndex: '0x1',
            transactionIndex: '0x10',
            transactionHash: '0x1234567890',
            address: resultAddress,
            blockHash: '0x1234567890',
            blockNumber: '0x1',
            data:
              '0x' +
              '0000000000000000000000000000000000000000000000000000000000000001' +
              '0000000000000000000000000000000000000000000000000000000000000004',
            topics: [
              '0x000000000000000000000000000000000000000000000000000000000000000a',
              '0x0000000000000000000000000000000000000000000000000000000000000010',
            ],
          },
          expected: {
            event: name,
            signature: null,
            returnValues: {
              0: '1',
              1: '10',
              2: '4',
              3: '16',
              a: '1',
              b: '10',
              c: '4',
              d: '16',
            },
            logIndex: 1,
            transactionIndex: 16,
            transactionHash: '0x1234567890',
            address: resultAddress,
            blockHash: '0x1234567890',
            blockNumber: 1,
            id: 'log_c71f2e84',
            raw: {
              data:
                '0x' +
                '0000000000000000000000000000000000000000000000000000000000000001' +
                '0000000000000000000000000000000000000000000000000000000000000004',
              topics: [
                '0x000000000000000000000000000000000000000000000000000000000000000a',
                '0x0000000000000000000000000000000000000000000000000000000000000010',
              ],
            },
          },
        },
      ];

      tests.forEach((test, index) => {
        it('test no: ' + index, () => {
          const result = decodeEventABI.call(test.abi, test.data);
          expect(result).toEqual(test.expected);
        });
      });
    });
  });
});
