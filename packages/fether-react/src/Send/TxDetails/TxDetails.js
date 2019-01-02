// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { toWei } from '@parity/api/lib/util/wei';
import styled from 'styled-components';

import {
  DivTxFormStyles,
  AnchorTxDetailsStyles,
  LabelTextareaTxDetailsStyles,
  TextareaTxDetailsStyles
} from './style';

const DivTxForm = styled.div`
  ${DivTxFormStyles};
`;
const AnchorTxDetails = styled.a`
  ${AnchorTxDetailsStyles};
`;
const LabelTextareaTxDetails = styled.label`
  ${LabelTextareaTxDetailsStyles};
`;
const TextareaTxDetails = styled.textarea`
  ${TextareaTxDetailsStyles};
`;

class TxDetails extends Component {
  state = {
    showDetails: false
  };

  renderCalculation = values => {
    const { estimatedTxFee } = this.props;

    const gasPriceBn = new BigNumber(values.gasPrice.toString());
    const gasLimitBn = estimatedTxFee(values)
      .div(gasPriceBn)
      .div(10 ** 9)
      .toFixed(0)
      .toString();

    return `Estimate amount of gas: ${gasLimitBn}`;
  };

  renderDetails = values => {
    return `${this.renderCalculation(values)}\n`
      .concat(`${this.renderFee(values)}\n`)
      .concat(`${this.renderTotalAmount(values)}`);
  };

  renderFee = values => {
    const { estimatedTxFee } = this.props;

    return `Fee: ${estimatedTxFee(values)
      .div(10 ** 18)
      .toFixed(9)
      .toString()} ETH (estimate * gas price)`;
  };

  renderTotalAmount = values => {
    const { estimatedTxFee, token } = this.props;

    return `Total Amount: ${estimatedTxFee(values)
      .plus(token.address === 'ETH' ? toWei(values.amount.toString()) : 0)
      .div(10 ** 18)
      .toFixed(10)
      .toString()} ETH`;
  };

  showDetailsAnchor = () => {
    return (
      <AnchorTxDetails onClick={this.toggleDetails}>
        &darr; Details
      </AnchorTxDetails>
    );
  };

  showHideAnchor = () => {
    return (
      <AnchorTxDetails onClick={this.toggleDetails}>
        &uarr; Hide
      </AnchorTxDetails>
    );
  };

  toggleDetails = () => {
    const { showDetails } = this.state;

    this.setState({ showDetails: !showDetails });
  };

  render () {
    const { isEstimatedTxFee, valid, values } = this.props;
    const { showDetails } = this.state;

    if (!valid || !isEstimatedTxFee(values) || isNaN(values.amount)) {
      return null;
    }

    return (
      <div>
        {showDetails ? this.showHideAnchor() : this.showDetailsAnchor()}
        <DivTxForm hidden={!showDetails}>
          <LabelTextareaTxDetails htmlFor='txDetails'>
            Transaction Details (Estimate):
          </LabelTextareaTxDetails>
          <TextareaTxDetails
            id='txDetails'
            readOnly
            value={this.renderDetails(values)}
          />
        </DivTxForm>
      </div>
    );
  }
}

export default TxDetails;
