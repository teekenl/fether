// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

/* eslint-env jest */
/* eslint-disable */

import React from "react";
import BigNumber from "bignumber.js";
import { mount, shallow } from "../../../../../test/enzyme";

import * as mock from "../../utils/testHelpers/mock";
import parityStore from "../../stores/parityStore"; // eslint-disable-line
import { SendStore } from "../../stores/sendStore";

import { STATUS } from "../../utils/withHealth";
import Send from "./TxForm";

// Reference; sendStore.spec.js
jest.mock("../../stores/parityStore", () => ({
  api: mock.api
}));

jest.mock("../../utils/withHealth", () => ({
  isApiConnected$: mock.isApiConnected$ // FIXME - this is wrong, help
}));

let sendStore; // Will hold the newly created instance of SendStore in each test
beforeEach(() => {
  sendStore = new SendStore();
});

describe("Send", () => {
  let fixtureProps, fixtureState, wrapper;

  beforeEach(() => {
    sendStore = new SendStore();

    sendStore.setTxStatus({ estimating: false });

    // obtain by debugging value of `this.props` in TxForm.js
    fixtureState = {
      maxSelected: false,
      form: {
        amount: "",
        gasPrice: "4",
        to: ""
      }
    };

    fixtureProps = {
      accountAddress: "0x00C53E558609d0233A2965a8388286965DAB31F5",
      balance: new BigNumber(1),
      ethBalance: new BigNumber(1),
      health: {
        status: STATUS.SYNCING
      },
      match: {
        params: {
          accountAddress: "0x00C53E558609d0233A2965a8388286965DAB31F5",
          tokenAddress: "ETH"
        }
      },
      parityStore: parityStore,
      sendStore: {
        tx: {}
      },
      token: {
        address: "ETH",
        decimals: 18,
        name: "Ether",
        symbol: "ETH"
      },
      tokens: {
        0x4a6e6c3868a279e1d9047b42c3fb356ff4680003: {
          address: "0x4A6e6C3868A279e1D9047B42C3fB356FF4680003",
          decimals: 18,
          name: "THIBCoin",
          symbol: "TIB"
        },
        ETH: {
          address: "ETH",
          decimals: 18,
          name: "Ether",
          symbol: "ETH"
        }
      }
    };

    wrapper = mount(<Send />, {});
  });

  it("creates the element", () => {
    return new Promise(resolve => {
      wrapper.setState(fixtureState, () => {
        wrapper.setProps(fixtureProps, resolve);
      });
    }).then(() => {
      wrapper.update();
      expect(wrapper).toHaveLength(1);
    });
  });
});

/* eslint-enable */
