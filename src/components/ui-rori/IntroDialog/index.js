import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import { globalIntro, healthIntro } from 'utils/variables-rori';
import * as s from './styles';

const IntroDialog = ({ type }) => {
  const [isClosed, setIsClosed] = useState(false);

  const exitIntroDialog = () => {
    setIsClosed(!isClosed);
  };

  return (
    <div className={`${s.introStyle} ${isClosed && 'close'}`}>
      <div className="intro-box">
        {type === 'health' ? healthIntro() : globalIntro()}
        <Button
          variant="outlined"
          className={`close-btn ${isClosed ? 'hidden' : ''}`}
          onClick={exitIntroDialog}
        >
          Explore Landscape
        </Button>
      </div>
    </div>
  );
};

export default IntroDialog;
