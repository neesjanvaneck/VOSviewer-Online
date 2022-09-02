import React from 'react';
import { css } from '@emotion/css';

import { device, media, roriPantoneCoolGray7 } from 'utils/variables-rori';
import dimensionsLogo from 'assets/images/dimensions-logo.svg';
import vosviewerLogo from 'assets/images/vosviewer-logo.svg';

export const logosStyle = css`
  label: logo;
  position: absolute;
  bottom: 0px;
  right: 0px;
  margin: 12px;
  font-family: Nexa Light;

  span {
    display: block;
    font-size: 9pt;
    color: ${roriPantoneCoolGray7};
  }

  img {
    display: block;
  }

  .dimensions-logo {
    width: 100px;
    height: 15px;
    margin-bottom: 1px;

    ${media(device.phone)} {
      width: 90px;
      height: 13.72px;
    }
  }

  .vosviewer-logo {
    width: 94px;
    height: 19.5px;

    ${media(device.phone)} {
      width: 80px;
      height: 16.59px;
    }
  }
 `;

const Logo = () => (
  <div className={logosStyle}>
    <span>Powered by</span>
    <img className="dimensions-logo" src={dimensionsLogo} alt="Dimensions" />
    <img className="vosviewer-logo" src={vosviewerLogo} alt="VOSviewer" />
  </div>

);

export default Logo;
