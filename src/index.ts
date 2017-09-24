import {rise} from 'risejs';
import * as lisk from 'lisk-js';

export default async function multisigAll(nodeAddress:string, multisigAddress:string, secretProvider:() => Promise<string>) {
  const api              = rise.newWrapper(nodeAddress);
  const { account }      = await api.accounts.getAccount(multisigAddress);
  const { transactions } = await api.multiSignatures.getPending(account.publicKey);


  // Check if there are any pending
  if (transactions.length === 0) {
    console.log('Relax!! :) No pending multisig transactions');
    return;
  }

  console.log(`There are ${transactions.length} pending transactions`);

  // Ask user for secret.
  const secret = await secretProvider();

  console.log('\n\nProcessing Transactions...');
  // const sigs: Signature[];
  const transportHeaders = {
    version: await api.peers.version().then(v => v.version),
    port   : 9999,
    nethash: await api.blocks.getNethash().then(r => r.nethash)
  };
  for (let _tx of transactions) {
    const { transaction } = _tx;

    // Sign the transaction with the given key.
    const signature = lisk.crypto.multiSign(
      transaction,
      lisk.crypto.getKeys(secret)
    );

    // Post the new signature to the core.
    try {
      await api.transport(transportHeaders)
        .postSignature({ signature, transaction: transaction.id });
      console.log(`${transaction.id} Signed`);
    } catch (e) {
      if (!e.message.match(/already exists/)) {
        throw e;
      } else {
        console.warn(`${transaction.id} was already signed with this secret`);
      }
    }
  }
}