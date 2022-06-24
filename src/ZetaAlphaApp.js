import React from 'react';

import ZetaAlpha from './pages/ZetaAlpha';

const ZetaAlphaApp = ({ parameters, fullscreenHandle }) => (
  <ZetaAlpha queryString={parameters} fullscreenHandle={fullscreenHandle} />
);

export default ZetaAlphaApp;
