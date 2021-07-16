import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { parse } from 'qs';

import RoRI from './pages/RoRI';

const RoRIApp = () => (
  <>
    <Helmet>
      <title>RoRI Research Funding Landscape</title>
      <meta name="description" content="RoRI Research Funding Landscape" />
    </Helmet>
    <Router>
      <Route
        path="/"
        render={d => {
          const queryString = parse(d.location.search, { ignoreQueryPrefix: true, });
          switch (queryString.map) {
            case 'health':
            case 'biomed':
              return (<RoRI dataType="health" />);
            case 'global':
            default:
              return (<RoRI dataType="global" />);
          }
        }}
      />
    </Router>
  </>
);

export default RoRIApp;
