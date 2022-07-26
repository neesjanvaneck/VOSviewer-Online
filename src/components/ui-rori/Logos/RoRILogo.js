import React from 'react';
import { css } from '@emotion/css';

import { device, media } from 'utils/variables-rori';
import roriLogo from 'assets/images/rori-logo.svg';

const imgStyle = css`
  position: absolute;
  width: 130px;
  height: 23.95px;
  top: 0px;
  right: 0px;
  margin: 12px;

  ${media(device.phone)} {
    width: 120px;
    height: 21.11px;
    top: auto;
    bottom: 4px;
    right: 92px;
  }
`;

const Logo = () => (
  <img className={imgStyle} src={roriLogo} alt="RoRI" />
);

export default Logo;
