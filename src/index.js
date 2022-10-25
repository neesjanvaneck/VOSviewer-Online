/* global MODE */
import React from 'react';
import { render } from 'react-dom';
import { Helmet } from 'react-helmet';

import { parseQueryString } from 'utils/helpers';
import VOSviewer from './component';

const root = document.createElement('div');
document.body.appendChild(root);
const queryString = parseQueryString(window.location.search);

render(
  <>
    {
      (() => {
        switch (MODE) {
          case 'vosviewer':
          default:
            return (
              <Helmet>
                <title>VOSviewer Online</title>
              </Helmet>
            );
          case 'dimensions':
            return (
              <Helmet>
                <title>VOSviewer Online - Dimensions</title>
              </Helmet>
            );
          case 'rori':
            return (
              <Helmet>
                <title>RoRI Research Funding Landscape</title>
                <meta name="description" content="RoRI Research Funding Landscape" />
              </Helmet>
            );
          case 'zeta-alpha':
            return (
              <Helmet>
                <title>VOSviewer Online - Zeta Alpha</title>
              </Helmet>
            );
        }
      })()
    }
    <VOSviewer parameters={queryString} />
  </>,
  root
);
