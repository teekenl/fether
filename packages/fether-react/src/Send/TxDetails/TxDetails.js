// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import { toWei } from '@parity/api/lib/util/wei';
import styled, { css } from 'styled-components';
import SlideLeftIn from '../../assets/theme/shared/animations/SlideLeftIn';

const animationRuleSlideLeftIn = css`
  animation-name: ${SlideLeftIn}; /* required */
  animation-duration: 0.5s; /* required */
  animation-timing-function: ease-in;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: normal;
  animation-play-state: playing;
`;

const DivTxForm = styled.div`
  ${animationRuleSlideLeftIn};
  border-radius: 0.25rem;
  background: rgba(${props => props.theme.faint}, 0.25);
  margin: 0.5rem 0;
  position: relative;
`;

const AnchorTxDetails = styled.a`
  color: ${props => props.theme.darkGrey};
  font-size: 0.8rem;
  font-weight: 400;
`;

const LabelTextareaTxDetails = styled.label`
  color: ${props => props.theme.black};
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.75;
  padding: 0.5rem 0.5rem 0;
`;

const TextareaTxDetails = styled.textarea`
  background: transparent;
  border: 0;
  color: ${props => props.theme.darkGrey};
  font-family: ${props => props.theme.mono};
  font-size: 0.6rem;
  font-weight: 400;
  height: 4.75rem;
  line-height: 1.3rem;
  margin-top: -0.25rem;
  opacity: 0.75;
  overflow: hidden;
  padding: 0.5rem;
  resize: none;
  width: calc(100% - 1rem);
  word-wrap: break-word;
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
