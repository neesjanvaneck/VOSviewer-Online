import { color, lab } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';

import {
  visualizationBackgroundColors, circleColors, lineColors, labelColors
} from 'utils/variables';

export const VisualizationStatus = {
  DIMMED: 'dimmed', // Delayed dimming of the visualization is applied when an item or link is hovered or selected.
  DEFAULT: 'default',
};

export const ItemStatus = {
  HOVERED: 'hovered', // Hovered item (mouse over).
  SELECTED: 'selected', // Clicked item.
  HIGHLIGHTED: 'highlighted', // Items adjacent to a hovered or selected item or link.
  DEFAULT: 'default',
};

export const LinkStatus = {
  HOVERED: 'hovered', // Hovered link (mouse over).
  SELECTED: 'selected', // Clicked link.
  HIGHLIGHTED: 'highlighted', // Links adjacent to a hovered or selected item.
  DEFAULT: 'default',
};

export function drawItemCircle(ctx, item, visualizationStore, uiStore, overlappingStatus) {
  const { zTransform, zoomSquare, visualizationStatus } = visualizationStore;
  const { colorIndex, darkTheme } = uiStore;
  let circleRadius = item._circleRadius / zTransform.k;
  if (!(zoomSquare
    && item._cx + item._circleRadius * 2 > zoomSquare[0][0]
    && item._cx - item._circleRadius * 2 < zoomSquare[1][0]
    && item._cy + item._circleRadius * 2 > zoomSquare[0][1]
    && item._cy - item._circleRadius * 2 < zoomSquare[1][1])) return;

  const itemStatus = overlappingStatus || item._status;
  const itemColor = item[`${colorIndex === 0 ? '_cluster' : '_score'}Color`];
  let circleOpacity;
  switch (itemStatus) {
    case ItemStatus.DEFAULT: {
      circleOpacity = circleColors.ALPHA_DEFAULT;
      break;
    }
    case ItemStatus.HIGHLIGHTED:
    case ItemStatus.SELECTED: {
      circleOpacity = circleColors.ALPHA_HIGHLIGHTED;
      break;
    }
    case ItemStatus.HOVERED: {
      circleOpacity = circleColors.ALPHA_HIGHLIGHTED;
      circleRadius += 2 / zTransform.k;
      break;
    }
    default: break;
  }
  let circleColor = itemColor;
  circleColor.opacity = circleOpacity;
  if ((itemStatus === ItemStatus.DEFAULT) && (visualizationStatus === VisualizationStatus.DIMMED)) {
    circleColor = darkTheme
      ? _interpolateColor(itemColor, visualizationBackgroundColors.DARK, circleColors.TRANSITION_STRENTH_DIMMED_DARK_BACKGROUND)
      : _interpolateColor(itemColor, visualizationBackgroundColors.LIGHT, circleColors.TRANSITION_STRENTH_DIMMED_LIGHT_BACKGROUND);
  } else if (uiStore.gradientCircles) {
    circleColor = ctx.createLinearGradient(item._cx, item._cy - circleRadius, item._cx, item._cy + circleRadius);
    circleColor.addColorStop(0, _calcLightColor(itemColor, circleColors.TRANSITION_STRENTH_LIGHT_COLOR));
    circleColor.addColorStop(1, _calcDarkColor(itemColor, circleColors.TRANSITION_STRENTH_DARK_COLOR));
  }
  ctx.beginPath();
  ctx.arc(item._cx, item._cy, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = circleColor;
  ctx.fill();
  if (!uiStore.gradientCircles && (itemStatus === ItemStatus.SELECTED || itemStatus === ItemStatus.HOVERED || itemStatus === ItemStatus.HIGHLIGHTED)) {
    ctx.strokeStyle = _calcDarkColor(itemColor, circleColors.TRANSITION_STRENTH_BORDER_COLOR);
    ctx.lineWidth = 3 / zTransform.k;
    ctx.stroke();
  }
  if (itemStatus === ItemStatus.SELECTED) {
    ctx.beginPath();
    ctx.arc(item._cx, item._cy, circleRadius + 8 / zTransform.k, 0, 2 * Math.PI);
    ctx.lineWidth = 4 / zTransform.k;
    ctx.strokeStyle = _calcDarkColor(itemColor, circleColors.TRANSITION_STRENTH_BORDER_COLOR);
    ctx.stroke();
  }
}

export function drawLink(ctx, link, visualizationStore, uiStore, overlappingStatus) {
  const {
    zTransform, zoomSquare, visualizationStatus, itemsForLinks
  } = visualizationStore;
  const { colorIndex, coloredLinks, curvedLinks, darkTheme } = uiStore;
  const from = itemsForLinks[link.from];
  const to = itemsForLinks[link.to];
  const x1 = from._cx;
  const y1 = from._cy;
  const x2 = to._cx;
  const y2 = to._cy;
  let minX;
  let minY;
  let maxX;
  let maxY;
  const cp = getControlPointsCurvedLink(x1, x2, y1, y2);
  if (curvedLinks) {
    minX = Math.min(x1, x2, cp.x);
    minY = Math.min(y1, y2, cp.y);
    maxX = Math.max(x1, x2, cp.x);
    maxY = Math.max(y1, y2, cp.y);
  } else {
    minX = Math.min(x1, x2);
    minY = Math.min(y1, y2);
    maxX = Math.max(x1, x2);
    maxY = Math.max(y1, y2);
  }
  if (!(zoomSquare
    && minX < zoomSquare[1][0]
    && maxX > zoomSquare[0][0]
    && minY < zoomSquare[1][1]
    && maxY > zoomSquare[0][1])) return;

  const linkStatus = overlappingStatus || link._status;
  let lineWidth = link._lineWidth / zTransform.k;
  let lineOpacity;
  switch (linkStatus) {
    case LinkStatus.DEFAULT: {
      lineOpacity = lineColors.ALPHA_DEFAULT;
      break;
    }
    case LinkStatus.HIGHLIGHTED: {
      lineOpacity = lineColors.ALPHA_HIGHLIGHTED;
      break;
    }
    case LinkStatus.SELECTED:
    case LinkStatus.HOVERED: {
      lineOpacity = lineColors.ALPHA_HIGHLIGHTED;
      lineWidth += 2 / zTransform.k;
      break;
    }
    default: break;
  }
  if (coloredLinks) {
    const lineColor = ctx.createLinearGradient(x1, y1, x2, y2);
    let c1 = from[`${colorIndex === 0 ? '_cluster' : '_score'}Color`];
    let c2 = to[`${colorIndex === 0 ? '_cluster' : '_score'}Color`];
    if (visualizationStatus === VisualizationStatus.DIMMED && linkStatus === LinkStatus.DEFAULT) {
      c1 = darkTheme
        ? _interpolateColor(c1, visualizationBackgroundColors.DARK, lineColors.TRANSITION_STRENTH_DIMMED_DARK_BACKGROUND)
        : _interpolateColor(c1, visualizationBackgroundColors.LIGHT, lineColors.TRANSITION_STRENTH_DIMMED_LIGHT_BACKGROUND);
      c2 = darkTheme
        ? _interpolateColor(c2, visualizationBackgroundColors.DARK, lineColors.TRANSITION_STRENTH_DIMMED_DARK_BACKGROUND)
        : _interpolateColor(c2, visualizationBackgroundColors.LIGHT, lineColors.TRANSITION_STRENTH_DIMMED_LIGHT_BACKGROUND);
    } else {
      c1 = _calcLightColor(c1, lineColors.TRANSITION_STRENTH);
      c2 = _calcLightColor(c2, lineColors.TRANSITION_STRENTH);
    }
    c1.opacity = lineOpacity;
    c2.opacity = lineOpacity;
    lineColor.addColorStop(0, c1);
    lineColor.addColorStop(1, c2);
    ctx.strokeStyle = lineColor;
  } else {
    let lineColor = color(lineColors.DEFAULT);
    if (visualizationStatus === VisualizationStatus.DIMMED && linkStatus === LinkStatus.DEFAULT) {
      lineColor = darkTheme
        ? _interpolateColor(lineColor, visualizationBackgroundColors.DARK, lineColors.TRANSITION_STRENTH_DIMMED_DARK_BACKGROUND)
        : _interpolateColor(lineColor, visualizationBackgroundColors.LIGHT, lineColors.TRANSITION_STRENTH_DIMMED_LIGHT_BACKGROUND);
    }
    lineColor.opacity = lineOpacity;
    ctx.strokeStyle = lineColor;
  }
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  if (curvedLinks) {
    ctx.quadraticCurveTo(cp.x, cp.y, x2, y2);
  } else {
    ctx.lineTo(x2, y2);
  }
  ctx.stroke();
}

export function drawLinkForMouseInteraction(ctx, link, visualizationStore, uiStore) {
  const { zTransform, zoomSquare, itemsForLinks } = visualizationStore;
  const { curvedLinks } = uiStore;
  const from = itemsForLinks[link.from];
  const to = itemsForLinks[link.to];
  const x1 = from._cx;
  const y1 = from._cy;
  const x2 = to._cx;
  const y2 = to._cy;
  let minX;
  let minY;
  let maxX;
  let maxY;
  const cp = getControlPointsCurvedLink(x1, x2, y1, y2);
  if (curvedLinks) {
    minX = Math.min(x1, x2, cp.x);
    minY = Math.min(y1, y2, cp.y);
    maxX = Math.max(x1, x2, cp.x);
    maxY = Math.max(y1, y2, cp.y);
  } else {
    minX = Math.min(x1, x2);
    minY = Math.min(y1, y2);
    maxX = Math.max(x1, x2);
    maxY = Math.max(y1, y2);
  }
  if (zoomSquare
    && minX < zoomSquare[1][0]
    && maxX > zoomSquare[0][0]
    && minY < zoomSquare[1][1]
    && maxY > zoomSquare[0][1]
  ) {
    ctx.lineWidth = (link._lineWidth + 10) / zTransform.k;
    ctx.strokeStyle = link._uniqueColor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    if (curvedLinks) {
      const cp = getControlPointsCurvedLink(x1, x2, y1, y2);
      ctx.quadraticCurveTo(cp.x, cp.y, x2, y2);
    } else {
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    return 1;
  } else {
    return 0;
  }
}

export function drawItemLabel(ctx, item, font, visualizationStore, uiStore, overlappingStatus) {
  const { zTransform, zoomSquare, visualizationStatus } = visualizationStore;
  const { darkTheme } = uiStore;
  if (!(zoomSquare
    && item._cx + item._circleRadius * 2 > zoomSquare[0][0]
    && item._cx - item._circleRadius * 2 < zoomSquare[1][0]
    && item._cy + item._circleRadius * 2 > zoomSquare[0][1]
    && item._cy - item._circleRadius * 2 < zoomSquare[1][1])) return;

  const nodeStatus = overlappingStatus || item._status;
  const labelColor = color(darkTheme ? labelColors.DARK_BACKGROUND : labelColors.LIGHT_BACKGROUND);
  switch (nodeStatus) {
    case ItemStatus.DEFAULT: {
      labelColor.opacity = (visualizationStatus === VisualizationStatus.DIMMED) ? labelColors.ALPHA_DIMMED : labelColor.opacity = labelColors.ALPHA_DEFAULT;
      break;
    }
    case ItemStatus.HIGHLIGHTED:
    case ItemStatus.SELECTED:
    case ItemStatus.HOVERED: {
      labelColor.opacity = labelColors.ALPHA_HIGHLIGHTED;
      break;
    }
    default: break;
  }
  const fontWeight = darkTheme ? 200 : 400;
  ctx.font = `${fontWeight} ${(item._fontSize) / zTransform.k}px ${font}`;
  ctx.fillStyle = labelColor;
  ctx.fillText(item._labelText, item._cx, item._cy);
}

export function drawRoundedRectangle(ctx, x, y, width, height, cornerRadius, color, darkTheme) {
  ctx.beginPath();
  ctx.moveTo(x + cornerRadius, y);
  ctx.lineTo(x + width - cornerRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
  ctx.lineTo(x + width, y + height - cornerRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
  ctx.lineTo(x + cornerRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
  ctx.lineTo(x, y + cornerRadius);
  ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
  ctx.closePath();
  ctx.fillStyle = darkTheme ? visualizationBackgroundColors.DARK : visualizationBackgroundColors.LIGHT;
  ctx.shadowColor = color;
  ctx.shadowBlur = 3;
  ctx.fill();
  ctx.shadowBlur = 0;
}

export function zoomContext(ctx, visualizationStore, callback, restoreBefore = false) {
  const { zTransform, pixelRatio, canvasPixelWidth, canvasPixelHeight } = visualizationStore;
  if (restoreBefore) ctx.restore();
  ctx.save();
  ctx.clearRect(0, 0, canvasPixelWidth, canvasPixelHeight);
  ctx.translate(zTransform.x * pixelRatio, zTransform.y * pixelRatio);
  ctx.scale(zTransform.k, zTransform.k);
  callback();
  if (!restoreBefore) ctx.restore();
}

export const getControlPointsCurvedLink = (x1, x2, y1, y2) => {
  const alpha = 0.3;
  const xm = (x1 + x2) / 2;
  const ym = (y1 + y2) / 2;
  const sign = -1; // (outerCurved ? 1 : -1);
  const x3 = xm + sign * alpha * (y2 - y1);
  const y3 = ym - sign * alpha * (x2 - x1);
  return { x: x3, y: y3 };
};

export function calcDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function _calcLightColor(color, transitionStrength = 0.7) {
  const lightColor = lab(color);
  lightColor.l = (1 - transitionStrength) * lightColor.l + transitionStrength * 100;
  return lightColor;
}

function _calcDarkColor(color, transitionStrength = 0) {
  const darkColor = lab(color);
  darkColor.l *= (1 - transitionStrength);
  return darkColor;
}

function _interpolateColor(color1, color2, pixelRatio) {
  return color(interpolateRgb(color1, color2)(pixelRatio));
}
