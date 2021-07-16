import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { parseQueryString } from 'utils/helpers';
import Dimensions from './pages/Dimensions';

const DimensionsApp = () => (
  <>
    <Helmet>
      <title>VOSviewer Online - Dimensions</title>
    </Helmet>
    <Router>
      <Route
        path="/"
        render={d => {
          const queryString = parseQueryString(d.location.search);
          return <Dimensions queryString={queryString} />;
        }}
      />
    </Router>
  </>
);

export default DimensionsApp;
