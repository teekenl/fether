// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Header } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import QrSigner from '@parity/qr-signer';
import { withProps } from 'recompose';

import RequireHealth from '../../RequireHealthOverlay';
import withAccount from '../../utils/withAccount.js';
import withTokens from '../../utils/withTokens';

function transactionToRLP ({ to, amount: value, gas: gasLimit, gasPrice }) {
  /*
  export function transactionToRLP(tx: EthTx): string {
  const { v, r, s } = tx;
  // Poor man's serialize without signature.
  tx.v = Buffer.from([tx._chainId]);
  tx.r = Buffer.from([0]);
  tx.s = Buffer.from([0]);
  const rlp = '0x' + tx.serialize().toString('hex');
  */

  // ?? - -nonce ??
  const txParams = {
    // nonce?
    to,
    value, // todo check ("0x...")
    gasLimit,
    gasPrice
  };

  console.log('tx params are', txParams);

  // const tx =
  const rlp = 'temp';
  console.log('serialized');

  /*

NEXT UP
TX TO RLP
(actuellement amount from gas gasPrice To)
voir si je veux utiliser ethereumjs-tx pour serialize
ou si je veux faire ça à la mano
(je vais en avoir besoin pour la signature aussi HUM)

    console.log('setting tx',values)
    */

  // console.log('transactiontorlp INPUT',tx);
  // const { v, r, s } = tx;
  // // Poor man's serialize without signature.
  // tx.v = Buffer.from([tx._chainId]);
  // tx.r = Buffer.from([0]);
  // tx.s = Buffer.from([0]);
  // const rlp = '0x' + tx.serialize().toString('hex');
  // // Restore previous values
  // tx.v = v;
  // tx.r = r;
  // tx.s = s;
  // console.log('transactiontorlp OUTPUT',rlp);
  return rlp;
}

@inject('sendStore')
@withAccount
@withTokens
@withProps(({ match: { params: { tokenAddress } }, tokens }) => ({
  token: tokens[tokenAddress]
}))
@observer
class TxQrCode extends Component {
  handleAccept = values => {
    // const { accountAddress, history, sendStore, token } = this.props;
    // return sendStore
    //   .send(token, values.password)
    //   .then(() =>
    //     history.push(`/send/${token.address}/from/${accountAddress}/sent`)
    //   )
    //   .catch(error => ({
    //     password: error.text
    //   }));
  };

  render () {
    const {
      account: { address },
      history,
      sendStore: { tx },
      token
    } = this.props;

    if (!tx || !token) {
      return <Redirect to='/' />;
    }

    return (
      <div>
        <Header
          left={
            <Link to={`/tokens/${address}`} className='icon -back'>
              Close
            </Link>
          }
          title={token && <h1>Send {token.name}</h1>}
        />

        <RequireHealth require='sync'>
          <div className='window_content'>
            <div className='box -padded'>
              Please scan the QR code of the transaction on Parity Signer
              <QrSigner
                scan={false}
                account={address}
                rlp={transactionToRLP(tx)}
              />
              <nav className='form-nav -binary'>
                <button
                  className='button -cancel'
                  onClick={history.goBack}
                  type='button'
                >
                  Back
                </button>

                <button className='button -submit'>Next step</button>
              </nav>
            </div>
          </div>
        </RequireHealth>
      </div>
    );
  }
}

export default TxQrCode;
