// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React from 'react';
import Blockies from 'react-blockies';
import PropTypes from 'prop-types';

import signerIcon from './signerIcon.png';
import { Placeholder } from '../../Placeholder';

export const Avatar = ({ address, signer, ...otherProps }) => (
  <div className='account_avatar' {...otherProps}>
    {address ? (
      <figure style={{ margin: '0', position: 'relative' }}>
        <Blockies seed={address.toLowerCase()} />
        {signer && (
          <img
            src={signerIcon}
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          />
        )}
      </figure>
    ) : (
      <Placeholder height={36} width={36} />
    )}
  </div>
);

Avatar.propTypes = {
  address: PropTypes.string
};
