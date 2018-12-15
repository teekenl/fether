// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { PureComponent } from 'react';
import { AccountHeader } from 'fether-ui';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Health from '../Health';
import TokensList from './TokensList';
import withAccount from '../utils/withAccount';
import withAccountsInfo from '../utils/withAccountsInfo';

@withRouter
@withAccount
@withAccountsInfo
class Tokens extends PureComponent {
  handleGoToBackup = () => {
    this.props.history.push(`/backup/${this.props.accountAddress}`);
  };

  handleGoToWhitelist = () => {
    this.props.history.push(`/whitelist/${this.props.accountAddress}`);
  };

  render () {
    // todo il faut réinjecter ici en plus le localstorage...
    // faire @withAccountsInfo
    const { accountsInfo, accountAddress } = this.props;

    // If the accountsInfo object is empty (i.e. no accounts), then we redirect
    // to the accounts page to create an account
    if (accountsInfo && !Object.keys(accountsInfo).length) {
      return <Redirect to='/accounts/new' />;
    }

    return (
      <div>
        <AccountHeader
          address={accountAddress}
          copyAddress
          name={
            accountsInfo &&
            accountsInfo[accountAddress] &&
            accountsInfo[accountAddress].name
          }
          left={
            <Link to='/accounts' className='icon -back'>
              Back
            </Link>
          }
        />

        <TokensList />

        <nav className='footer-nav'>
          <div className='footer-nav_status'>
            <Health />
          </div>
          <div className='footer-nav_icons'>
            {accountsInfo &&
              accountsInfo[accountAddress] &&
              // Hide option to do a backup if this is a Parity Signer account
              accountsInfo[accountAddress].type === 'node' && (
              <button
                className='button -tiny'
                onClick={this.handleGoToBackup}
              >
                  Backup Account
              </button>
            )}
            <button className='button -tiny' onClick={this.handleGoToWhitelist}>
              Add tokens
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

export default Tokens;
