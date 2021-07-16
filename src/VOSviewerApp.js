import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { parseQueryString } from 'utils/helpers';
import VOSviewer from './pages/VOSviewer';

const VOSviewerApp = () => (
  <>
    <Helmet>
      <title>VOSviewer Online</title>
    </Helmet>
    <Router>
      <Route
        path="/"
        render={d => {
          const queryString = parseQueryString(d.location.search);
          return <VOSviewer queryString={queryString} />;
        }}
      />
    </Router>
  </>
);

export default VOSviewerApp;
