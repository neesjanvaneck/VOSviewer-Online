import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { parseQueryString } from 'utils/helpers';
import ZetaAlpha from './pages/ZetaAlpha';

const ZetaAlphaApp = () => (
  <>
    <Helmet>
      <title>VOSviewer Online - Zeta Alpha</title>
    </Helmet>
    <Router>
      <Route
        path="/"
        render={d => {
          const queryString = parseQueryString(d.location.search);
          return <ZetaAlpha queryString={queryString} />;
        }}
      />
    </Router>
  </>
);

export default ZetaAlphaApp;
