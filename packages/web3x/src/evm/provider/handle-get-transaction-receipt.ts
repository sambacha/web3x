import { toBufferBE } from 'bigint-buffer';
import * as rlp from 'rlp';
import { Address } from '../../address';
import { RawTransactionReceipt, toRawTransactionReceipt } from '../../formatters';
import { TransactionHash } from '../../types';
import { bufferToHex, hexToBuffer, sha3Buffer } from '../../utils';
import { Blockchain } from '../blockchain';
import { recoverTransaction } from '../tx';

export async function handleGetTransactionReceipt(
  blockchain: Blockchain,
  transactionHash: TransactionHash,
): Promise<RawTransactionReceipt | null> {
  const txHash = hexToBuffer(transactionHash);
  const receipt = await blockchain.getTransactionReceipt(txHash);

  if (!receipt) {
    return null;
  }

  // If there is a receipt, we can assume tx exists.
  const { blockHash, blockHeader, tx, txIndex } = (await blockchain.getMinedTransaction(txHash))!;
  const { to, nonce } = tx;
  // TODO: Store from in tx so no need to recover? This is slow.
  const from = recoverTransaction(tx);

  const { cumulativeGasUsed, logs, status } = receipt;

  const receiptLogs = logs.map((log, logIndex) => ({
    id: null,
    removed: false,
    logIndex,
    blockNumber: blockHeader.number,
    blockHash: bufferToHex(blockHash),
    transactionHash,
    transactionIndex: txIndex,
    address: log.address,
    data: bufferToHex(log.data),
    topics: log.topics.map(bufferToHex),
  }));

  const txReceipt = {
    transactionHash,
    transactionIndex: txIndex,
    blockHash: bufferToHex(blockHash),
    blockNumber: blockHeader.number,
    from,
    to,
    cumulativeGasUsed: Number(cumulativeGasUsed),
    gasUsed: Number(cumulativeGasUsed),
    contractAddress: !to ? getContractAddress(from, nonce) : undefined,
    logs: receiptLogs,
    status,
  };

  return toRawTransactionReceipt(txReceipt);
}

function getContractAddress(from: Address, nonce: bigint) {
  return new Address(sha3Buffer(rlp.encode([from.toBuffer(), toBufferBE(nonce, 32)])).slice(12));
}
