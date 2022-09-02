import { injectGlobal } from "@emotion/css";

import svgFont from 'assets/fonts/nexa-bold-webfont.svg';
import woffFont from 'assets/fonts/nexa-bold-webfont.woff';
import ttfFont from 'assets/fonts/nexa-bold-webfont.ttf';

import svgFontLight from 'assets/fonts/nexa-light-webfont.svg';
import woffFontLight from 'assets/fonts/nexa-light-webfont.woff';
import ttfFontLight from 'assets/fonts/nexa-light-webfont.ttf';

export const globalStyles = injectGlobal`
@font-face {
  font-family: "Nexa Bold";
  src: 
  url(${woffFont}) format('woff'),
  url(${ttfFont}) format('truetype'),
  url(${svgFont}) 
}

@font-face {
  font-family: "Nexa Light";
  src: 
  url(${woffFontLight}) format('woff'),
  url(${ttfFontLight}) format('truetype'),
  url(${svgFontLight}) 
} 
`;
