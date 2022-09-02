import { injectGlobal } from '@emotion/css';

import ttfFontLight from 'assets/fonts/Roboto-Light.ttf';
import ttfFontLightItalic from 'assets/fonts/Roboto-LightItalic.ttf';
import ttfFontRegular from 'assets/fonts/Roboto-Regular.ttf';
import ttfFontItalic from 'assets/fonts/Roboto-Italic.ttf';
import ttfFontMedium from 'assets/fonts/Roboto-Medium.ttf';
import ttfFontMediumItalic from 'assets/fonts/Roboto-MediumItalic.ttf';
import ttfFontBold from 'assets/fonts/Roboto-Bold.ttf';
import ttfFontBoldItalic from 'assets/fonts/Roboto-BoldItalic.ttf';

export const globalStyles = injectGlobal`
@font-face {
  font-family: "Roboto";
  src: url(${ttfFontLight}) format('truetype');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url(${ttfFontLightItalic}) format('truetype');
  font-weight: 300;
  font-style: italic;
}

@font-face {
  font-family: "Roboto";
  src: url(${ttfFontRegular}) format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url(${ttfFontItalic}) format('truetype');
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: "Roboto";
  src: url(${ttfFontMedium}) format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url(${ttfFontMediumItalic}) format('truetype');
  font-weight: 500;
  font-style: italic;
}

@font-face {
  font-family: "Roboto";
  src: url(${ttfFontBold}) format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Roboto";
  src: url(${ttfFontBoldItalic}) format('truetype');
  font-weight: 700;
  font-style: italic;
}
`;
