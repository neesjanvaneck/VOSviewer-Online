/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

// RoRI brand colours.
export const roriPantone3005 = '#0075bf';
export const roriPantoneCoolGray7 = ' #9d9d9c';

// RoRI support colours.
export const roriPantone282 = '#1e386c';
export const roriPantone299 = '#00a3e2';
export const roriPantone298 = '#36bcee';
export const roriPantoneCoolGray11 = '#3b3c43';
export const roriPantoneCoolGray4 = '#bfc0c1';
export const roriPantoneCoolGray1 = '#e9eae8';

export const clusterNames = [
  'Social sciences and humanities',
  'Biomedical and health sciences',
  'Physical sciences and engineering',
  'Life and earth sciences',
  'Mathematics and computer science'
];

export const globalIntro = () => (
  <div className="intro-content">
    <h3>RoRI Research Funding Landscape</h3>
    <p>This funding landscape shows 2890 research fields across all sciences. By changing the size and color coding, the contribution of a specific research funder to the different fields can be made visible. The mouse can be used to zoom in and to move through the landscape.</p>
    <p>The landscape can be interpreted as follows:</p>
    <ul>
      <li>Each <span className="bold-span">bubble</span> represents a field.</li>
      <li>The <span className="bold-span">size</span> of a field indicates the number of publications with a certain property, for instance the number of publications supported by a specific funder. By default, the size of a field indicates the total number of publications in the field.</li>
      <li>The <span className="bold-span">color</span> of a field indicates the proportion of publications with a certain property, for instance the proportion of publications supported by a specific funder. By default, the color of a field indicates the main discipline to which the field belongs.</li>
      <li>The <span className="bold-span">proximity</span> of two fields approximately indicates the relatedness of the fields as determined by citation links. In general, the closer two fields are located to each other, the stronger their relatedness.</li>
      <li>The <span className="bold-span">horizontal and vertical axes</span> have no special meaning.</li>
    </ul>
  </div>
);

export const healthIntro = () => (
  <div className="intro-content">
    <h3>RoRI Health Research Funding Landscape</h3>
    <p>This funding landscape shows 1313 research fields in the health sciences. By changing the size and color coding, the contribution of a specific research funder to the different fields can be made visible. It is also possible to show the amount of research on a specific disease that is done in the different fields. The mouse can be used to zoom in and to move through the landscape.</p>
    <p> The landscape can be interpreted as follows:</p>
    <ul>
      <li>Each <span className="bold-span">bubble</span> represents a field.</li>
      <li>The <span className="bold-span">size</span> of a field indicates the number of publications with a certain property, for instance the number of publications supported by a specific funder. By default, the size of a field indicates the total number of publications in the field.</li>
      <li>The <span className="bold-span">color</span> of a field indicates the proportion of publications with a certain property, for instance the proportion of publications supported by a specific funder. By default, the color of a field indicates the proportion of publications indexed in PubMed.</li>
      <li>The <span className="bold-span">proximity</span> of two fields approximately indicates the relatedness of the fields as determined by citation links. In general, the closer two fields are located to each other, the stronger their relatedness.</li>
      <li>The <span className="bold-span">horizontal and vertical axes</span> have no special meaning.</li>
    </ul>
  </div>
);

// Style variables.
export const device = {
  phone: '(max-width: 767px)',
  phonePortrait: '(max-width: 767px) and (orientation: portrait)',
  phoneLandscape: '(max-width: 768px) and (orientation: landscape)',
  tablet: '(min-width: 768px) and (max-width: 1279px)',
  tabletPortrait: '(min-width: 768px) and (max-width: 1279px) and (orientation: portrait)',
  tabletLandscape: '(min-width: 768px) and (max-width: 1279px) and (orientation: landscape)',
  laptop: '(min-width: 1280px)',
  laptop15: '(min-width: 1680px)',
  desktop: '(min-width: 1920px)',
};
export const media = (...query) => `@media ${query.join(',')}`;
