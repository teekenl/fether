// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import React, { Component } from 'react';
import { Card, Form as FetherForm } from 'fether-ui';
import { inject, observer } from 'mobx-react';
import { Scanner } from 'fether-ui';

@inject('createAccountStore')
@observer
class AccountImportOptions extends Component {
  state = {
    error: '',
    isLoading: false,
    phrase: '',
    importingFromSigner: false
  };

  handleNextStep = async () => {
    const {
      history,
      location: { pathname }
    } = this.props;
    const currentStep = pathname.slice(-1);
    history.push(`/accounts/new/${+currentStep + 1}`);
  };

  handlePhraseChange = ({ target: { value: phrase } }) => {
    this.setState({ phrase });
  };

  handleSubmitPhrase = async () => {
    const phrase = this.state.phrase.trim();
    const {
      createAccountStore: { setPhrase }
    } = this.props;

    this.setState({ isLoading: true, phrase });
    try {
      await setPhrase(phrase);
      this.handleNextStep();
    } catch (e) {
      this.setState({
        isLoading: false,
        error:
          'The passphrase was not recognized. Please verify that you entered your passphrase correctly.'
      });
    }
  };

  handleChangeFile = async jsonString => {
    const {
      createAccountStore: { setJsonString }
    } = this.props;

    this.setState({ isLoading: true });
    try {
      await setJsonString(jsonString);
      this.handleNextStep();
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          'Invalid file. Please check this is your actual Parity backup JSON keyfile and try again.'
      });
      console.error(error);
    }
  };

  handleSignerImported = async ({ address }) => {
    const {
      createAccountStore: { setAddressOnly }
    } = this.props;

    await setAddressOnly(address);

    this.handleNextStep();
  };

  handleSignerImport = () => {
    this.setState({
      importingFromSigner: true
    });
  };

  render () {
    const {
      history,
      location: { pathname }
    } = this.props;
    const { error, phrase, importingFromSigner } = this.state;
    const currentStep = pathname.slice(-1);

    const jsonCard = (
      <Card>
        <div key='createAccount'>
          <div className='text -centered'>
            <p>Recover from JSON Keyfile</p>

            <FetherForm.InputFile
              label='JSON Backup Keyfile'
              onChangeFile={this.handleChangeFile}
              required
            />
          </div>
        </div>
      </Card>
    );

    const signerCard = (
      <Card>
        <div key='createAccount'>
          <div className='text -centered'>
            <p>Recover from Parity Signer</p>

            {importingFromSigner ? (
              <Scanner onScan={this.handleSignerImported} label="Please show the QR code of the account on the webcam."/>
            ) : (
              <button
                className='button -footer'
                onClick={this.handleSignerImport}
              >
                Scan QR code
              </button>
            )}
          </div>
        </div>
      </Card>
    );

    const phraseCard = (
      <Card>
        <div key='importBackup'>
          <div className='text -centered'>
            <p>Recover from Seed Phrase</p>

            <FetherForm.Field
              as='textarea'
              label='Recovery phrase'
              onChange={this.handlePhraseChange}
              required
              phrase={phrase}
            />

            {this.renderButton()}
          </div>
        </div>
      </Card>
    );

    return (
      <div className='center-md'>
        {!importingFromSigner && jsonCard}
        <br />
        {signerCard}
        <br />
        {!importingFromSigner && phraseCard}
        <br />
        <p>{error}</p>
        <nav className='form-nav -space-around'>
          {currentStep > 1 && (
            <button className='button -cancel' onClick={history.goBack}>
              Back
            </button>
          )}
        </nav>
      </div>
    );
  }

  renderButton = () => {
    const { isLoading, json, phrase } = this.state;

    // If we are importing an existing account, the button goes to the next step
    return (
      <button
        className='button'
        disabled={(!json && !phrase) || isLoading}
        onClick={this.handleSubmitPhrase}
      >
        Next
      </button>
    );
  };
}

export default AccountImportOptions;
