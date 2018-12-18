// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import { withRouter } from 'react-router-dom';
import withAccountsInfo from '../utils/withAccountsInfo';

const AccountAddressFromRouter = withRouter(props =>
  props.children(props.match.params.accountAddress)
);

// TODO Light.js nonce

// We do not want to pass the router props nor the accountsInfo props, both
// used internally, down to the component returned by withAccount.
export default Component =>
  withAccountsInfo(({ accountsInfo, ...initialProps }) => {
    return (
      <AccountAddressFromRouter>
        {accountAddress => (
          <Component
            account={{
              address: accountAddress,
              name: accountsInfo[accountAddress].name,
              type: accountsInfo[accountAddress].type
            }}
            {...initialProps}
          />
        )}
      </AccountAddressFromRouter>
    );
  });
