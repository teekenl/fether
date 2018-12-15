import { accountsInfo$, withoutLoading } from '@parity/light.js';
import { compose, mapPropsStream, withHandlers, withProps } from 'recompose';
import keyBy from 'lodash/keyBy';
import light from '@parity/light.js-react';
import localForage from 'localforage';
import { map, switchMap } from 'rxjs/operators';

import ethereumIcon from '../assets/img/tokens/ethereum.png';
import localForage$ from './localForage';
import LS_PREFIX from '../stores/utils/lsPrefix';
import withAccount from './withAccount';

import { SIGNER_ACCOUNTS_LS_KEY } from '../stores/createAccountStore';

/**
 * HOC which injects the node's accounts as well as the Parity Signer accounts,
 * the latter being stored in local storage.
 */
const withAccountsInfo = compose(
  light({
    accountsInfo: () => accountsInfo$().pipe(withoutLoading())
  }),
  // mapPropsStream and add localForage$
  mapPropsStream(
    switchMap(({ accountsInfo: nodeAccountsInfo, ...props }) => {
      console.log('nodeAccountsInfo youhou');

      return localForage$(SIGNER_ACCOUNTS_LS_KEY).pipe(
        map(paritySignerAccounts => {
          console.log('localStorageInfo youhou');
          const paritySignerAccountsInfo = keyBy(
            paritySignerAccounts,
            'address'
          );
          Object.keys(nodeAccountsInfo).forEach(address => {
            nodeAccountsInfo[address].type = 'node';
          });
          Object.keys(paritySignerAccountsInfo).forEach(address => {
            paritySignerAccountsInfo[address].type = 'signer';
          });
          console.log('paritySignerAccountsInfo', paritySignerAccountsInfo, {
            ...props,
            accountsInfo: { ...paritySignerAccountsInfo, ...nodeAccountsInfo }
          });
          return {
            ...props,
            accountsInfo: { ...paritySignerAccountsInfo, ...nodeAccountsInfo }
          };
        })
      );
    })
  )
);

export default withAccountsInfo;
