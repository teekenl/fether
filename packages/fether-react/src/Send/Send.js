// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import withAccount from '../utils/withAccount.js';

import Sent from './Sent';
import Unlock from './Unlock';
import TxForm from './TxForm';
import TxQrCode from './TxQrCode';

// TODO I think we can safely remove this
@withAccount
class Send extends Component {
  render () {
    const {
      match: { path }
    } = this.props;
    return (
      <Switch>
        <Route exact path={`${path}`} component={TxForm} />
        <Route path={`${path}/unlock`} component={Unlock} />
        <Route path={`${path}/txqrcode`} component={TxQrCode} />
        <Route path={`${path}/sent`} component={Sent} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

export default Send;
