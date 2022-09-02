import React from 'react';

import RoRI from './pages/RoRI';

const RoRIApp = ({ parameters = {} }) => (
  <>
    {
      (() => {
        switch (parameters.map) {
          case 'health':
          case 'biomed':
            return (<RoRI dataType="health" />);
          case 'global':
          default:
            return (<RoRI dataType="global" />);
        }
      })()
    }
  </>
);

export default RoRIApp;
