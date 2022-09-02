import { css } from '@emotion/css';
import { panelMargin, panelPadding, legendPanelMaxWidth } from 'utils/variables';

export const previewIsOpen = css`
  label: preview-is-open;
`;

export const legendContainer = (showLegend, previewPanelWidth) => css`
  label: legend-container;
  visibility: ${showLegend ? 'visible' : 'hidden'};
  position: absolute;
  max-width: ${legendPanelMaxWidth}px;
  bottom: 0;
  right: 0px;
  margin: ${panelMargin}px;
  user-select: none;

  &${`.${previewIsOpen}`} {
    right: ${previewPanelWidth}px;
  }
`;

export const legendPanel = css`
  label: legend-panel;
  display: flex;
  flex-direction: row-reverse;
  padding: ${panelPadding}px;
  line-height: 0.6;
`;

export const colorLegend = css`
  label: color-legend;
  display: inline-block;
  cursor: pointer;
  pointer-events: all;
`;

export const sizeLegend = (width, scoreColorLegendIsVisible, clusterColorLegendIsVisible) => {
  let marginLeft = 0;
  if (scoreColorLegendIsVisible) marginLeft = panelPadding;
  else if (clusterColorLegendIsVisible) marginLeft = -width;
  return css`
  label: radius-legend;
  display: inline-block;
  margin-left: ${marginLeft}px;
  margin-top: auto;
  margin-bottom: auto;
`;
};
