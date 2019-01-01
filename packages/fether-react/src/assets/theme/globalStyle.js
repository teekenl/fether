// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: BSD-3-Clause

import { createGlobalStyle } from 'styled-components';

// https://www.styled-components.com/docs/faqs
const GlobalStyle = createGlobalStyle`
`;

// Define props.theme that will overwrite a styled component's
// default theme (i.e. `xyz.defaultProps`) when wrapping
// components with `<ThemeProvider theme={theme}></ThemeProvider>`
const fetherTheme = {
  black: '#222',
  chrome: '#f5f6f6',
  darkGrey: '#444444',
  faint: '#ddd',
  // TODO - how to add alternatives fonts: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace
  mono: 'Menlo'
};

export { fetherTheme, GlobalStyle };
