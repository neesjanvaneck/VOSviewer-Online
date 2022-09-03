/* eslint-disable no-bitwise */
import HTMLReactParser from 'html-react-parser';
import { makeAutoObservable } from 'mobx';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { extent, sum } from 'd3-array';
import { color } from 'd3-color';
import _clamp from 'lodash/clamp';
import _groupBy from 'lodash/groupBy';
import _keys from 'lodash/keys';
import _find from 'lodash/find';
import _each from 'lodash/each';
import _cloneDeep from 'lodash/cloneDeep';
import _clone from 'lodash/clone';
import _isUndefined from 'lodash/isUndefined';
import _isNil from 'lodash/isNil';
import _isNull from 'lodash/isNull';
import _filter from 'lodash/filter';
import _flatten from 'lodash/flatten';
import _toNumber from 'lodash/toNumber';
import _isNaN from 'lodash/isNaN';
import _uniq from 'lodash/uniq';

import {
  canvasMargin, clusterColors, circleColors, circleMinDiameter, circleAvgDiameter, lineMinWidth, lineAvgWidth, labelMinFontSize, labelFontSizeScalingConstant, mapDataHeaders, scoreColorLegendPropScoresBetweenMinAndMax, scoreColorLegendDesiredNTicks, parameterKeys, defaultParameterValues, defaultTerminology
} from 'utils/variables';
import { ItemStatus, LinkStatus, VisualizationStatus, calcDistance } from 'utils/drawing';
import {
  getLabelValue, getClusterKeys, getWeightKeys, getScoreKeys, getColorScheme, getNiceMinValue, getNiceMaxValue
} from 'utils/helpers';

export default class State {
  constructor(state = {}) {
    makeAutoObservable(this, state);
    this.largestComponent = defaultParameterValues[parameterKeys.LARGEST_COMPONENT];
    this.initialZoomLevel = defaultParameterValues[parameterKeys.ZOOM_LEVEL];
    this.canvasMargin = { left: canvasMargin, right: canvasMargin, top: canvasMargin, bottom: canvasMargin };
    this.pixelRatio = window.devicePixelRatio || 1;
    this.cxScale = undefined;
    this.cyScale = undefined;
    this.zoomSquare = undefined;
    this.updateZoomLevel = undefined;
    this.resetZoom = undefined;
    this.zoomIn = undefined;
    this.zoomOut = undefined;
    this.zoomFit = undefined;
    this.zoomTo = undefined;
    this.translateTo = undefined;
    this.visualizationStatus = VisualizationStatus.DEFAULT;
    this.highlightedItems = [];
    this.highlightedLinks = [];
    this.highlightedItemTimerId = undefined;
    this.highlightedLinkTimerId = undefined;
    this.labelCanvasContext = undefined;
    this.interactionCanvasContext = undefined;
    this.clusterKeys = [];
    this.clusterKey = undefined;
    this.weightKeys = [];
    this.weightKey = undefined;
    this.scoreKey = undefined;
    this.items = [];
    this.links = [];
    this.filteredLinks = [];
    this.visibleLinks = {};
    this.uniqueColorToLink = {};
    this.itemsForLinks = {};
    this.clusters = undefined;
    this.defaultClusterColors = _cloneDeep(clusterColors);
    this.lightClusterColors = _clone(clusterColors.LIGHT);
    this.darkClusterColors = _clone(clusterColors.DARK);
    this.clusterColorScheme = scaleOrdinal().range(clusterColors.LIGHT).unknown(clusterColors.DEFAULT);
    this.scoreColorSchemeNames = [
      'Viridis',
      'Plasma',
      'Rainbow',
      'White-blue-purple',
      'White-yellow-green-blue',
      'White-yellow-orange-red',
      'Coolwarm',
      'Spectral',
    ];
    this.scoreColorScheme = getColorScheme(this.scoreColorSchemeName);
    this.customScoreColors = undefined;
    this.scoreColorLegendScoreRange = scaleLinear().range([0, 1]);
    this.scoreColorLegendAutoMinScore = 0;
    this.scoreColorLegendAutoMaxScore = 0;
    this.normalizeScoresMethods = [
      'Do not normalize',
      'Divide by mean',
      'Subtract mean',
      'Subtract mean and divide by st. dev.'
    ];
    this.totalLinkStrength = 0;
    this.itemLinkData = {};
    this.getScreenshotImage = () => {};
    this.getDefaultLinkCanvasImage = () => {};
    this.getDefaultItemCircleCanvasImage = () => {};
    this.getHighlightedItemCircleLinkCanvasImage = () => {};
    this.getItemLabelCanvasImage = () => {};
    this.getScoreColorLegendCanvasImage = () => {};
    this.getSizeLegendCanvasImage = () => {};
    this.getClusterLegendCanvasImage = () => {};
    this.getLogoImages = () => ([]);
  }

  lastDataUpdate = Date.now()

  lastItemUpdate = Date.now()

  lastLinkUpdate = Date.now()

  hoveredItem = undefined

  clickedItem = undefined

  hoveredLink = undefined

  clickedLink = undefined

  zTransform = { x: 0, y: 0, k: 1 }

  weightKeysCustomTerminology = []

  scoreKeys = []

  clusterKeyIndex = 0

  weightIndex = 0

  scoreIndex = 0

  scoreColorSchemeName = defaultParameterValues[parameterKeys.SCORE_COLORS]

  scoreColorLegendMinScore = 0

  scoreColorLegendMaxScore = 0

  scoreColorLegendMinScoreAutoValue = true

  scoreColorLegendMaxScoreAutoValue = true

  normalizeScoresMethodName = 'Do not normalize'

  degreesToRotate = 90

  get itemsOrLinksWithUrl() {
    const itemsWithUrl = this.items.filter(item => item.url);
    const linksWithUrl = this.links.filter(link => link.url);
    return itemsWithUrl.length > 0 || linksWithUrl.length > 0;
  }

  setCanvasSize(canvasWidth, canvasHeight) {
    this.canvasPixelWidth = canvasWidth * this.pixelRatio;
    this.canvasPixelHeight = canvasHeight * this.pixelRatio;
  }

  setCanvasMarginTop(canvasMarginTop) {
    this.canvasMargin.top = canvasMarginTop;
  }

  setCanvasMarginBottom(canvasMarginBottom) {
    this.canvasMargin.bottom = canvasMarginBottom;
  }

  setLabelCanvasContext(labelCanvasContext) {
    this.labelCanvasContext = labelCanvasContext;
  }

  setInteractionCanvasContext(interactionCanvasContext) {
    this.interactionCanvasContext = interactionCanvasContext;
  }

  init(mapData, networkData, terminology) {
    const keys = _keys(mapData[0]);
    this.weightKeys = getWeightKeys(keys);
    this.scoreKeys = getScoreKeys(keys);
    this.clusterKeys = getClusterKeys(keys);

    const filteredWeightKeys = this.weightKeys.filter(weightKey => weightKey !== `weight<${defaultTerminology.links}>` && weightKey !== `weight<${defaultTerminology.total_link_strength}>`);
    this.weightIndex = filteredWeightKeys.length ? this.weightKeys.indexOf(filteredWeightKeys[0]) : 0;
    this.weightKey = this.weightKeys.length ? this.weightKeys[this.weightIndex] : undefined;
    this.scoreIndex = 0;
    this.scoreKey = this.scoreKeys.length ? this.scoreKeys[this.scoreIndex] : undefined;
    this.clusterKeyIndex = 0;
    this.clusterKey = this.clusterKeys.length ? this.clusterKeys[this.clusterKeyIndex] : undefined;
    this.clusters = this.clusterKey ? _uniq(_filter(mapData.map(item => item[this.clusterKey]), d => d !== null)).sort((a, b) => a - b) : undefined;

    this.items = _cloneDeep(mapData);
    _each(this.items, (item, i) => {
      item._originalData = { ...item };
      item._initialOrderId = i;
      item._status = ItemStatus.DEFAULT;

      item.id = _isNaN(_toNumber(item.id)) ? item.id : _toNumber(item.id);
      item.label = getLabelValue(item);
      item._normalizedScore = undefined;
    });

    this.itemsForLinks = {};
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      this.itemsForLinks[item.id] = item;
    }

    const links = {};
    _each(networkData, link => {
      let item1 = link[0];
      let item2 = link[1];
      if (item1 !== item2 && this.itemsForLinks[item1] && this.itemsForLinks[item2]) {
        if (item1 > item2) {
          const swap = item1;
          item1 = item2;
          item2 = swap;
        }
        const strength = !_isNaN(+link[2]) ? +link[2] : 1;
        if (links[`${item1}-${item2}`]) {
          links[`${item1}-${item2}`].strength += strength;
        } else {
          links[`${item1}-${item2}`] = {
            from: !_isNaN(+item1) ? +item1 : item1,
            to: !_isNaN(+item2) ? +item2 : item2,
            strength,
            url: link[3],
            description: link[4],
          };
        }
      }
    });
    this.links = Object.values(links);
    this.links.sort((a, b) => b.strength - a.strength);
    const nLinksForStrengthRescaling = this.links.length < 1000 ? this.links.length : 1000;
    let meanLinkStrength = 0;
    for (let i = 0; i < nLinksForStrengthRescaling; i++) {
      meanLinkStrength += this.links[i].strength;
    }
    meanLinkStrength /= nLinksForStrengthRescaling;
    this.filteredLinks = [];
    this.uniqueColorToLink = {};
    let i = 0;
    const rgbIncrement = Math.floor(256 * 256 * 256 / networkData.length);
    _each(this.links, link => {
      const rgb = Math.floor((i * rgbIncrement) + Math.random() * rgbIncrement);
      const r = (rgb >> 16) & 0xFF;
      const g = (rgb >> 8) & 0xFF;
      const b = (rgb) & 0xFF;
      const uniqueColor = `rgb(${r}, ${g}, ${b})`;
      this.uniqueColorToLink[uniqueColor] = link;
      i += 1;
      link._uniqueColor = uniqueColor;
      link._rescaledStrength = link.strength / meanLinkStrength;
      link._status = LinkStatus.DEFAULT;
    });

    this.totalLinkStrength = sum(this.links, link => link.strength);
    this.itemLinkData = {};
    _each(this.links, link => {
      if (this.itemLinkData[link.from]) {
        this.itemLinkData[link.from].nLinks += 1;
        this.itemLinkData[link.from].totalLinkStrength += link.strength;
      } else {
        this.itemLinkData[link.from] = {};
        this.itemLinkData[link.from].nLinks = 1;
        this.itemLinkData[link.from].totalLinkStrength = link.strength;
      }
      if (this.itemLinkData[link.to]) {
        this.itemLinkData[link.to].nLinks += 1;
        this.itemLinkData[link.to].totalLinkStrength += link.strength;
      } else {
        this.itemLinkData[link.to] = {};
        this.itemLinkData[link.to].nLinks = 1;
        this.itemLinkData[link.to].totalLinkStrength = link.strength;
      }
    });
    if (_keys(this.itemLinkData).length) {
      if (!this.weightKeys.length) {
        this.weightKeys = [];
        this.weightIndex = 0;
      }
      if (!this.weightKeys.includes(`weight<${defaultTerminology.total_link_strength}>`)) {
        this.weightKeys.unshift(`weight<${defaultTerminology.total_link_strength}>`);
        _each(this.items, item => {
          item[`weight<${defaultTerminology.total_link_strength}>`] = this.itemLinkData[item.id] ? this.itemLinkData[item.id].totalLinkStrength : 0;
        });
        this.weightIndex = 1;
      }
      if (!this.weightKeys.includes(`weight<${defaultTerminology.links}>`)) {
        this.weightKeys.unshift(`weight<${defaultTerminology.links}>`);
        _each(this.items, item => {
          item[`weight<${defaultTerminology.links}>`] = this.itemLinkData[item.id] ? this.itemLinkData[item.id].nLinks : 0;
        });
        this.weightIndex = this.weightKeys.length === 2 ? 1 : 2;
      }
    }

    this.weightKeysCustomTerminology = this.weightKeys.map(weightKey => {
      if (weightKey === `weight<${defaultTerminology.links}>`) return `weight<${terminology.links}>`;
      if (weightKey === `weight<${defaultTerminology.total_link_strength}>`) return `weight<${terminology.total_link_strength}>`;
      return weightKey;
    });

    this.updateClusterColors(false);

    this.clickedItem = undefined;
    this.clickedLink = undefined;
    this.highlightedItems = [];
    this.highlightedLinks = [];
    this.visualizationStatus = VisualizationStatus.DEFAULT;
  }

  updateFilteredAndVisibleLinks(minLinkStrength, maxNLinks) {
    const filteredLinks = this.links.filter(link => link.strength >= minLinkStrength);
    this.filteredLinks = filteredLinks.length > maxNLinks ? filteredLinks.slice(0, maxNLinks) : filteredLinks;
    this.visibleLinks = {};
    _each(this.filteredLinks, link => {
      if (!this.visibleLinks[link.from]) this.visibleLinks[link.from] = { [link.to]: link };
      else this.visibleLinks[link.from][link.to] = link;
    });
  }

  updateWeightKeysCustomTerminology(keys = [], terminology) {
    this.weightKeysCustomTerminology = keys.map(key => {
      if (key === `weight<${defaultTerminology.links}>`) return `weight<${terminology.links}>`;
      if (key === `weight<${defaultTerminology.total_link_strength}>`) return `weight<${terminology.total_link_strength}>`;
      return key;
    });
  }

  updateWeights(weightIndex) {
    if (weightIndex >= 0 && weightIndex < this.weightKeys.length) {
      this.weightIndex = weightIndex;
      this.weightKey = this.weightKeys[this.weightIndex];
    }
    const weights = this.items.map(item => +item[this.weightKey]);
    let meanWeight = 0;
    for (let i = 0; i < weights.length; i++) {
      meanWeight += weights[i];
    }
    meanWeight /= weights.length;
    this.meanWeight = meanWeight;
    _each(this.items, item => {
      item._normalizedWeight = meanWeight > 0 ? +item[this.weightKey] / meanWeight : 1;
    });
  }

  updateScores(scoreIndex) {
    if (scoreIndex >= 0 && scoreIndex < this.scoreKeys.length) {
      this.scoreIndex = scoreIndex;
      this.scoreKey = this.scoreKeys[this.scoreIndex];
    }
    let scores = this.items.map(item => item[this.scoreKey]);
    let meanScore = 0;
    let stDevScore = 0;
    let nItems = 0;
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      if (score) {
        meanScore += score;
        nItems += 1;
      }
    }
    if (nItems > 0) {
      meanScore /= nItems;
      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        if (score) {
          stDevScore += (score - meanScore) * (score - meanScore);
        }
      }
      stDevScore = Math.sqrt(stDevScore / nItems);
    }
    if (this.normalizeScoresMethodName !== 'Do not normalize') {
      switch (this.normalizeScoresMethodName) {
        case 'Divide by mean':
          _each(this.items, item => {
            item._normalizedScore = item[this.scoreKey] ? item[this.scoreKey] / meanScore : item[this.scoreKey];
          });
          break;
        case 'Subtract mean':
          _each(this.items, item => {
            item._normalizedScore = item[this.scoreKey] ? item[this.scoreKey] - meanScore : item[this.scoreKey];
          });
          break;
        case 'Subtract mean and divide by st. dev.':
          _each(this.items, item => {
            item._normalizedScore = item[this.scoreKey] ? (stDevScore !== 0 ? (item[this.scoreKey] - meanScore) / stDevScore : item[this.scoreKey] - meanScore) : item[this.scoreKey];
          });
          break;
        default:
          break;
      }
      this.scoreKey = '_normalizedScore';
      scores = this.items.map(item => item[this.scoreKey]);
    }
    const sortedScores = scores.filter(x => x === 0 || Boolean(x)).sort((a, b) => a - b);
    let minScore = 0;
    let maxScore = 0;
    if (sortedScores.length) {
      minScore = sortedScores[(Math.round(((1 - scoreColorLegendPropScoresBetweenMinAndMax) / 2) * (sortedScores.length - 1)))];
      maxScore = sortedScores[Math.round((1 - (1 - scoreColorLegendPropScoresBetweenMinAndMax) / 2) * (sortedScores.length - 1))];
    }
    if (minScore !== maxScore) {
      this.scoreColorLegendAutoMinScore = getNiceMinValue(minScore, maxScore, scoreColorLegendDesiredNTicks);
      this.scoreColorLegendAutoMaxScore = getNiceMaxValue(minScore, maxScore, scoreColorLegendDesiredNTicks);
    } else {
      // eslint-disable-next-line prefer-destructuring
      this.scoreColorLegendAutoMinScore = sortedScores[0];
      this.scoreColorLegendAutoMaxScore = sortedScores[sortedScores.length - 1];
    }
    if (this.scoreColorLegendAutoMaxScore < this.scoreColorLegendMinScore || this.scoreColorLegendAutoMinScore > this.scoreColorLegendMaxScore) {
      this.scoreColorLegendMinScore = this.scoreColorLegendAutoMinScore;
      this.scoreColorLegendMaxScore = this.scoreColorLegendAutoMaxScore;
      this.scoreColorLegendMinScoreAutoValue = true;
      this.scoreColorLegendMaxScoreAutoValue = true;
    } else {
      if (this.scoreColorLegendMinScoreAutoValue) {
        this.scoreColorLegendMinScore = this.scoreColorLegendAutoMinScore;
      }
      if (this.scoreColorLegendMaxScoreAutoValue) {
        this.scoreColorLegendMaxScore = this.scoreColorLegendAutoMaxScore;
      }
    }
    this.scoreColorLegendScoreRange.domain([this.scoreColorLegendMinScore, this.scoreColorLegendMaxScore]);
    this.updateItemScoreColor();
  }

  setScoreColorLegendMinScoreAutoValue(minScoreAutoValue) {
    this.scoreColorLegendMinScoreAutoValue = !_isUndefined(minScoreAutoValue) ? minScoreAutoValue : !this.scoreColorLegendMinScoreAutoValue;
  }

  setScoreColorLegendMaxScoreAutoValue(maxScoreAutoValue) {
    this.scoreColorLegendMaxScoreAutoValue = !_isUndefined(maxScoreAutoValue) ? maxScoreAutoValue : !this.scoreColorLegendMaxScoreAutoValue;
  }

  updateScoreColorLegendMinScore(scoreColorLegendMinScore, onBlur) {
    this.scoreColorLegendMinScore = scoreColorLegendMinScore;
    const newScoreColorLegendMinScore = this.scoreColorLegendMinScore !== '' ? +this.scoreColorLegendMinScore : this.scoreColorLegendAutoMinScore;
    if (newScoreColorLegendMinScore > this.scoreColorLegendMaxScore) {
      this.scoreColorLegendMaxScore = newScoreColorLegendMinScore;
      this.scoreColorLegendMaxScoreAutoValue = false;
    }
    if (onBlur) {
      this.scoreColorLegendMinScore = newScoreColorLegendMinScore;
    }
    const newScoreColorLegendMaxScore = this.scoreColorLegendMaxScore !== '' ? this.scoreColorLegendMaxScore : this.scoreColorLegendAutoMaxScore;
    this.scoreColorLegendScoreRange.domain([newScoreColorLegendMinScore, newScoreColorLegendMaxScore]);
    this.updateItemScoreColor();
  }

  updateScoreColorLegendMaxScore(scoreColorLegendMaxScore, onBlur) {
    this.scoreColorLegendMaxScore = scoreColorLegendMaxScore;
    const newScoreColorLegendMaxScore = this.scoreColorLegendMaxScore !== '' ? +this.scoreColorLegendMaxScore : this.scoreColorLegendAutoMaxScore;
    if (newScoreColorLegendMaxScore < this.scoreColorLegendMinScore) {
      this.scoreColorLegendMinScore = newScoreColorLegendMaxScore;
      this.scoreColorLegendMinScoreAutoValue = false;
    }
    if (onBlur) {
      this.scoreColorLegendMaxScore = newScoreColorLegendMaxScore;
    }
    const newScoreColorLegendMinScore = this.scoreColorLegendMinScore !== '' ? this.scoreColorLegendMinScore : this.scoreColorLegendAutoMinScore;
    this.scoreColorLegendScoreRange.domain([newScoreColorLegendMinScore, newScoreColorLegendMaxScore]);
    this.updateItemScoreColor();
  }

  setNormalizeScoresMethodName(normalizeScoresMethodName) {
    this.normalizeScoresMethodName = normalizeScoresMethodName;
  }

  updateClusterColors(darkTheme) {
    const clusterColors = darkTheme ? this.darkClusterColors : this.lightClusterColors;
    this.clusterColorScheme.range(clusterColors);
    if (this.clusters) this.clusterColorScheme.domain(this.clusters.slice(0, clusterColors.length));
    this.updateItemClusterColor();
  }

  updateClusterColor(darkTheme, clusterIndex, color) {
    const clusterColors = darkTheme ? this.darkClusterColors : this.lightClusterColors;
    clusterColors[clusterIndex] = color;
    this.clusterColorScheme.range(clusterColors);
    this.updateItemClusterColor();
  }

  updateCustomDefaultClusterColors(customClusterColors = [], updateItemClusterColor = true) {
    this.defaultClusterColors = _cloneDeep(clusterColors);
    customClusterColors.forEach(cluster => {
      const clusterIndex = cluster.cluster - 1;
      this.defaultClusterColors.LIGHT[clusterIndex] = cluster.color;
      this.defaultClusterColors.DARK[clusterIndex] = cluster.color;
    });
    this.resetClusterColors(false, updateItemClusterColor);
  }

  resetClusterColors(darkTheme, updateItemClusterColor = true) {
    this.lightClusterColors = _clone(this.defaultClusterColors.LIGHT);
    this.darkClusterColors = _clone(this.defaultClusterColors.DARK);
    this.clusterColorScheme.range(darkTheme ? this.darkClusterColors : this.lightClusterColors);
    if (updateItemClusterColor) {
      this.updateItemClusterColor();
    }
  }

  updateCustomScoreColors(customScoreColors, updateItemScoreColor = true) {
    this.customScoreColors = customScoreColors;
    this.scoreColorSchemeNames = this.scoreColorSchemeNames.filter(scoreColorSchemeName => scoreColorSchemeName !== 'Custom');
    if (customScoreColors) {
      this.scoreColorSchemeNames.unshift('Custom');
      this.updateScoreColorScheme('custom', updateItemScoreColor);
    } else {
      this.updateScoreColorScheme(this.scoreColorSchemeName !== 'custom' ? this.scoreColorSchemeName : defaultParameterValues[parameterKeys.SCORE_COLORS], updateItemScoreColor);
    }
  }

  updateScoreColorScheme(scoreColorSchemeName, updateItemScoreColor = true) {
    let scoreColorSchemeNameLowerCase = scoreColorSchemeName.toLowerCase();
    if (!this.scoreColorSchemeNames.map(scoreColorSchemeName => scoreColorSchemeName.toLowerCase()).includes(scoreColorSchemeNameLowerCase) || (scoreColorSchemeNameLowerCase === 'custom' && !this.customScoreColors)) {
      scoreColorSchemeNameLowerCase = defaultParameterValues[parameterKeys.SCORE_COLORS];
    }
    this.scoreColorSchemeName = scoreColorSchemeNameLowerCase;
    const rescaledScores = scoreColorSchemeNameLowerCase === 'custom' && this.customScoreColors.map(scoreColor => scoreColor.rescaled_score);
    const colors = scoreColorSchemeNameLowerCase === 'custom' && this.customScoreColors.map(scoreColor => scoreColor.color);
    this.scoreColorScheme = getColorScheme(scoreColorSchemeName, rescaledScores, colors);
    if (updateItemScoreColor) {
      this.updateItemScoreColor();
    }
  }

  updateItemPixelPositionAndScaling() {
    const marginPixelLeft = this.canvasMargin.left * this.pixelRatio;
    const marginPixelRight = this.canvasMargin.right * this.pixelRatio;
    const marginPixelTop = this.canvasMargin.top * this.pixelRatio;
    const marginPixelBottom = this.canvasMargin.bottom * this.pixelRatio;

    const [minX, maxX] = extent(this.items.map(item => +item.x));
    const [minY, maxY] = extent(this.items.map(item => +item.y));

    const logicalWidth = maxX - minX;
    const logicalHeight = maxY - minY;
    const pixelWidth = this.canvasPixelWidth - marginPixelLeft - marginPixelRight;
    const pixelHeight = this.canvasPixelHeight - marginPixelTop - marginPixelBottom;
    const minScalingFactor = Math.min(pixelWidth / logicalWidth, pixelHeight / logicalHeight);
    const deltaPixelX = (pixelWidth - minScalingFactor * logicalWidth) / 2;
    const deltaPixelY = (pixelHeight - minScalingFactor * logicalHeight) / 2;

    const cxScale = scaleLinear().domain([minX, maxX]).range([deltaPixelX + marginPixelLeft, minScalingFactor * logicalWidth + deltaPixelX + marginPixelLeft]);
    const cyScale = scaleLinear().domain([minY, maxY]).range([minScalingFactor * logicalHeight + deltaPixelY + marginPixelTop, deltaPixelY + marginPixelTop]);
    [this.clickedItem, ...this.items].forEach(item => {
      if (!item) return;
      item._cx = cxScale(+item.x);
      item._cy = cyScale(+item.y);
    });
    if (this.cxScale && this.cyScale && this.zTransform.invert && this.translateTo) {
      const oldPixelXRange = this.cxScale.range();
      const oldPixelYRange = this.cyScale.range();
      const centerPixelX = ((oldPixelXRange[0] + (oldPixelXRange[1] - oldPixelXRange[0]) / 2) - this.zTransform.x * this.pixelRatio) / this.zTransform.k;
      const centerPixelY = ((oldPixelYRange[0] + (oldPixelYRange[1] - oldPixelYRange[0]) / 2) - this.zTransform.y * this.pixelRatio) / this.zTransform.k;
      const centerX = this.cxScale.invert(centerPixelX);
      const centerY = this.cyScale.invert(centerPixelY);
      this.translateTo(cxScale(centerX), cyScale(centerY));
    }
    this.cxScale = cxScale;
    this.cyScale = cyScale;

    this.zoomSquare = [[0, 0], [this.canvasPixelWidth, this.canvasPixelHeight]];
  }

  updateItemFontSizeAndCircleSize(scale, itemSizeVariation, maxLabelLength, fontFamily = 'Roboto') {
    _each(this.items, item => {
      item._circleRadius = this.pixelRatio * (scale * Math.max(circleAvgDiameter * item._normalizedWeight ** itemSizeVariation, circleMinDiameter)) / 2;
      item._fontSize = this.pixelRatio * (scale * labelMinFontSize + labelFontSizeScalingConstant * item._normalizedWeight ** itemSizeVariation);
      if (this.labelCanvasContext) {
        this.labelCanvasContext.font = `${item._fontSize}px ${fontFamily}`;
        const label = HTMLReactParser(item.label);
        item._labelText = (label || '').slice(0, maxLabelLength) || '';
        item._labelTextWidth = this.labelCanvasContext.measureText(item._labelText).width;
      }
    });
    this.items.sort((a, b) => b._circleRadius - a._circleRadius);
    this.updateLabelScalingFactors();
  }

  updateLabelScalingFactors() {
    for (let i = 0; i < this.items.length; i++) {
      const item1 = this.items[i];
      item1._labelScalingFactor = 0;
      for (let j = 0; j < i; j++) {
        const item2 = this.items[j];
        const labelScalingFactor = this.calcLabelScalingFactor(item1, item2);
        if (labelScalingFactor > item1._labelScalingFactor && labelScalingFactor > item2._labelScalingFactor) {
          item1._labelScalingFactor = labelScalingFactor;
        }
      }
    }
  }

  calcLabelScalingFactor(item1, item2) {
    const xLabelScalingFactor = (0.5 * (item1._labelTextWidth + item2._labelTextWidth + 2)) / Math.abs(item1._cx - item2._cx || 0.1);
    const yLabelScalingFactor = (0.5 * (item1._fontSize + item2._fontSize + 2)) / Math.abs((item1._cy) - (item2._cy) || 0.1);
    return Math.min(xLabelScalingFactor, yLabelScalingFactor);
  }

  updateLinkLineWidth(scale, linkSizeVariation) {
    _each(this.links, link => {
      link._lineWidth = this.pixelRatio * (scale * Math.max(lineAvgWidth * link._rescaledStrength ** linkSizeVariation, lineMinWidth));
    });
  }

  updateItemClusterColor() {
    _each(this.items, item => {
      const cluster = item[this.clusterKey];
      item._clusterColor = color(this.clusterColorScheme(cluster));
    });
  }

  updateItemScoreColor() {
    _each(this.items, item => {
      const value = item[this.scoreKey];
      item._scoreColor = color(_isNull(value) ? circleColors.DEFAULT : this.scoreColorScheme(this.scoreColorLegendScoreRange(value)));
    });
  }

  findHoveredItem(mousePosition, dimmingIsEnabled = false) {
    let foundItem;
    if (mousePosition) {
      const x = (mousePosition[0] - this.zTransform.x * this.pixelRatio) / this.zTransform.k;
      const y = (mousePosition[1] - this.zTransform.y * this.pixelRatio) / this.zTransform.k;
      foundItem = _find(this.items, item => calcDistance(item._cx, item._cy, x, y) < item._circleRadius / this.zTransform.k);
    }
    const prevItem = this.hoveredItem;
    this.hoveredItem = foundItem;
    if (prevItem === undefined && foundItem === undefined) return false;
    if (prevItem && foundItem && prevItem.id === foundItem.id) return true;
    this.updateVisualization(dimmingIsEnabled);
    if (dimmingIsEnabled) {
      this._clearHighlightedItemTimer();
      // Do not set timeout if an item or a link is clicked.
      if (foundItem && this.clickedItem === undefined && this.clickedLink === undefined) {
        this.highlightedItemTimerId = setTimeout(() => {
          this.updateVisualization(dimmingIsEnabled, true);
        }, 1500);
      }
    }
    return true;
  }

  findHoveredLink(mousePosition, dimmingIsEnabled = false) {
    if (this.hoveredItem) {
      this.hoveredLink = undefined;
      return false;
    }
    let foundLink;
    if (mousePosition) {
      const pixelData = this.interactionCanvasContext.getImageData(mousePosition[0], mousePosition[1], 1, 1).data;
      const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
      foundLink = this.uniqueColorToLink[color];
    }
    const prevLink = this.hoveredLink;
    this.hoveredLink = foundLink;
    if (prevLink === undefined && foundLink === undefined) return false;
    if (prevLink && foundLink && prevLink.from === foundLink.from && prevLink.to === foundLink.to) return true;
    this.updateVisualization(dimmingIsEnabled);
    if (dimmingIsEnabled) {
      this._clearHighlightedLinkTimer();
      // Do not set timeout if an item or a link is clicked.
      if (foundLink && this.clickedItem === undefined && this.clickedLink === undefined) {
        this.highlightedLinkTimerId = setTimeout(() => {
          this.updateVisualization(dimmingIsEnabled, true);
        }, 1500);
      }
    }
    return true;
  }

  cancelHovering(dimmingIsEnabled) {
    this.findHoveredItem(undefined, dimmingIsEnabled);
    this.findHoveredLink(undefined, dimmingIsEnabled);
    if (dimmingIsEnabled) {
      this._clearHighlightedItemTimer();
      this._clearHighlightedLinkTimer();
    }
  }

  _clearHighlightedItemTimer() {
    if (this.highlightedItemTimerId) clearTimeout(this.highlightedItemTimerId);
  }

  _clearHighlightedLinkTimer() {
    if (this.highlightedLinkTimerId) clearTimeout(this.highlightedLinkTimerId);
  }

  updateClickedItem(item, dimmingIsEnabled = false) {
    if (item) this.clickedItem = item;
    else this.clickedItem = this.hoveredItem;
    if (this.clickedItem) this.clickedLink = undefined;
    this.updateVisualization(dimmingIsEnabled);
    if (dimmingIsEnabled) this._clearHighlightedItemTimer();
  }

  updateClickedLink(link, dimmingIsEnabled = false) {
    if (link) this.clickedLink = link;
    else this.clickedLink = this.hoveredLink;
    if (this.clickedLink) this.clickedItem = undefined;
    this.updateVisualization(dimmingIsEnabled);
    if (dimmingIsEnabled) this._clearHighlightedLinkTimer();
  }

  updateHighlightedItems() {
    if (this.clickedItem) this.clickedItem = _find(this.items, item => item.id === this.clickedItem.id);
    if (this.hoveredItem) this.hoveredItem = _find(this.items, item => item.id === this.hoveredItem.id);
  }

  updateVisualization(dimmingIsEnabled = false, applyDimming = false) {
    const {
      visibleLinks, hoveredItem, clickedItem, hoveredLink, clickedLink, itemsForLinks
    } = this;

    if (dimmingIsEnabled && (clickedItem || clickedLink || (applyDimming && (hoveredItem || hoveredLink)))) {
      this.visualizationStatus = VisualizationStatus.DIMMED;
    } else {
      this.visualizationStatus = VisualizationStatus.DEFAULT;
    }

    this.highlightedItems = [];
    this.items.forEach(item => {
      item._status = ItemStatus.DEFAULT;
      const itemIsHover = hoveredItem && hoveredItem._initialOrderId === item._initialOrderId;
      const itemIsClicked = clickedItem && clickedItem._initialOrderId === item._initialOrderId;
      if (itemIsClicked) {
        item._status = ItemStatus.SELECTED;
      } else if (itemIsHover) {
        item._status = ItemStatus.HOVERED;
      } else if (_keys(visibleLinks).length) {
        const linkedToHoveredNode = hoveredItem && ((visibleLinks[hoveredItem.id] && visibleLinks[hoveredItem.id][item.id]) || (visibleLinks[item.id] && visibleLinks[item.id][hoveredItem.id]));
        const linkedToClickedNode = clickedItem && ((visibleLinks[clickedItem.id] && visibleLinks[clickedItem.id][item.id]) || (visibleLinks[item.id] && visibleLinks[item.id][clickedItem.id]));
        const linkedToHoveredLink = hoveredLink && (hoveredLink.from === item.id || hoveredLink.to === item.id);
        const linkedToClickedLink = clickedLink && (clickedLink.from === item.id || clickedLink.to === item.id);
        if (linkedToHoveredNode || linkedToClickedNode || linkedToHoveredLink || linkedToClickedLink) {
          this.highlightedItems.push(item);
          item._status = ItemStatus.HIGHLIGHTED;
        }
      }
    });

    this.highlightedLinks = [];
    const links = _flatten(Object.values(this.visibleLinks).map(d => Object.values(d)));
    links.forEach(link => {
      link._status = LinkStatus.DEFAULT;
      const linkIsHover = hoveredLink && link.from === hoveredLink.from && link.to === hoveredLink.to;
      const linkIsClicked = clickedLink && link.from === clickedLink.from && link.to === clickedLink.to;
      if (linkIsClicked) {
        link._status = LinkStatus.SELECTED;
      } else if (linkIsHover) {
        link._status = LinkStatus.HOVERED;
      } else {
        const linkedToHoveredNode = hoveredItem && (itemsForLinks[link.from].id === hoveredItem.id || itemsForLinks[link.to].id === hoveredItem.id);
        const linkedToClickedNode = clickedItem && (itemsForLinks[link.from].id === clickedItem.id || itemsForLinks[link.to].id === clickedItem.id);
        if (linkedToHoveredNode || linkedToClickedNode) {
          this.highlightedLinks.push(link);
          link._status = LinkStatus.HIGHLIGHTED;
        }
      }
    });

    this.updateItems();
  }

  updateData() {
    this.lastDataUpdate = Date.now();
    this.updateItems();
    this.updateLinks();
  }

  updateItems() {
    this.updateHighlightedItems();
    this.lastItemUpdate = Date.now();
  }

  updateLinks() {
    this.lastLinkUpdate = Date.now();
  }

  setItemIdToIndex(itemIdToIndex) {
    this.itemIdToIndex = itemIdToIndex;
  }

  setLargestComponent(largestComponent) {
    this.largestComponent = largestComponent;
  }

  updateItemCoordinates(coordinates) {
    _each(coordinates[0], (x, i) => {
      const item = _find(this.items, d => d._initialOrderId === i);
      if (item) {
        item.x = x;
        item.y = coordinates[1][i];
      }
    });
    this.updateItemPixelPositionAndScaling();
    this.updateLabelScalingFactors();
  }

  updateItemClusters(clusters, darkTheme) {
    this.clusterKey = mapDataHeaders.CLUSTER;
    _each(this.items, (item) => {
      const cluster = clusters[this.itemIdToIndex[item.id]];
      item[this.clusterKey] = !_isNil(cluster) ? cluster + 1 : undefined;
    });
    this.clusters = _filter(_keys(_groupBy(this.items, this.clusterKey)), d => d !== "undefined");
    this.updateClusterColors(darkTheme);
  }

  setDegreesToRotate(degreesToRotate, onBlur) {
    if (onBlur) {
      this.degreesToRotate = _clamp(Math.round(+degreesToRotate), 0, 360);
    } else {
      this.degreesToRotate = degreesToRotate;
    }
  }

  rotate() {
    const radians = this.degreesToRotate * Math.PI / 180;
    const sin = Math.sin(-radians);
    const cos = Math.cos(-radians);
    [this.clickedItem, ...this.items].forEach(item => {
      if (!item) return;
      const x = +item.x;
      const y = +item.y;
      item.x = cos * x - sin * y;
      item.y = sin * x + cos * y;
    });
    this.updateItemPixelPositionAndScaling();
    this.updateLabelScalingFactors();
    this.updateItems();
    this.updateLinks();
  }

  flip(how) {
    if (how === 'horizontally') {
      [this.clickedItem, ...this.items].forEach(item => {
        if (!item) return;
        item.x = -1 * +item.x;
      });
    } else if (how === 'vertically') {
      [this.clickedItem, ...this.items].forEach(item => {
        if (!item) return;
        item.y = -1 * +item.y;
      });
    }
    this.updateItemPixelPositionAndScaling();
    this.updateItems();
    this.updateLinks();
  }

  updateZTransform(zTransform) {
    if (zTransform) {
      const t0 = [(-zTransform.x * this.pixelRatio) / zTransform.k, (-zTransform.y * this.pixelRatio) / zTransform.k];
      const t1 = [(this.canvasPixelWidth - zTransform.x * this.pixelRatio) / zTransform.k, (this.canvasPixelHeight - zTransform.y * this.pixelRatio) / zTransform.k];
      this.zoomSquare = [t0, t1];
      this.zTransform = zTransform;
    }
  }

  setInitialZoomLevel(initialZoomLevel) {
    this.initialZoomLevel = initialZoomLevel;
  }

  setUpdateZoomLevel(f) {
    this.updateZoomLevel = (zoomLevel) => {
      if (zoomLevel) f(zoomLevel);
      else {
        this.resetZoom();
        if (this.initialZoomLevel) {
          f(this.initialZoomLevel);
        }
      }
    };
  }

  setResetZoom(f) {
    this.resetZoom = f;
  }

  setZoomIn(f) {
    this.zoomIn = f;
  }

  setZoomOut(f) {
    this.zoomOut = f;
  }

  setZoomFit(f) {
    this.zoomFit = f;
  }

  setZoomTo(f) {
    this.zoomTo = f;
  }

  setTranslateTo(f) {
    this.translateTo = f;
  }

  setGetScreenshotImage(f) {
    this.getScreenshotImage = f;
  }

  setGetDefaultLinkCanvasImage(f) {
    this.getDefaultLinkCanvasImage = f;
  }

  setGetDefaultItemCircleCanvasImage(f) {
    this.getDefaultItemCircleCanvasImage = f;
  }

  setGetHighlightedItemCircleLinkCanvasImage(f) {
    this.getHighlightedItemCircleLinkCanvasImage = f;
  }

  setGetItemLabelCanvasImage(f) {
    this.getItemLabelCanvasImage = f;
  }

  setGetScoreColorLegendCanvasImage(f) {
    this.getScoreColorLegendCanvasImage = f;
  }

  setGetSizeLegendCanvasImage(f) {
    this.getSizeLegendCanvasImage = f;
  }

  setGetClusterLegendCanvasImage(f) {
    this.getClusterLegendCanvasImage = f;
  }

  setGetLogoImages(f) {
    this.getLogoImages = f;
  }

  getValueByRadius(radius, scale, itemSizeVariation) {
    const value = 2 * radius / scale;
    const normalizedWeight = ((value / circleAvgDiameter) ** (1 / itemSizeVariation));
    return normalizedWeight * this.meanWeight;
  }

  getJsonData(terminology, templates, styles, parameters, colorSchemes, clusters) {
    const items = this.items.map(item => {
      const itemObject = {
        ...item._originalData,
        id: item.id,
        x: item.x,
        y: item.y,
        cluster: item.cluster,
      };
      let customWeight;
      const weights = this.weightKeys.reduce((acc, value) => {
        if (itemObject[value] === 0 || Boolean(itemObject[value])) delete itemObject[value];
        const findMatch = value.match(/<(.*)>/);
        if (findMatch && findMatch[1] !== defaultTerminology.links && findMatch[1] !== defaultTerminology.total_link_strength) {
          acc[findMatch[1]] = item[value];
        } else if (!findMatch) {
          customWeight = item[value];
        }
        return acc;
      }, {});
      const weightKeys = Object.keys(weights);
      if (customWeight) itemObject.weight = customWeight;
      if (weightKeys.length) itemObject.weights = weights;
      let customScore;
      const scores = this.scoreKeys.reduce((acc, value) => {
        if (itemObject[value] === 0 || Boolean(itemObject[value])) delete itemObject[value];
        const findMatch = value.match(/<(.*)>/);
        if (findMatch) acc[findMatch[1]] = item[value];
        else if (!findMatch) {
          customScore = item[value];
        }
        return acc;
      }, {});
      const scoreKeys = Object.keys(scores);
      if (customScore) itemObject.score = customScore;
      if (scoreKeys.length) itemObject.scores = scores;
      return itemObject;
    });
    items.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });

    const links = this.links.map(link => {
      const linkObject = {
        source_id: link.from,
        target_id: link.to,
        strength: link.strength,
      };
      if (link.url) linkObject.url = link.url;
      if (link.description) linkObject.description = link.description;
      return linkObject;
    });
    links.sort((a, b) => {
      if (a.source_id < b.source_id) return -1;
      if (a.source_id > b.source_id) return 1;
      if (a.target_id < b.target_id) return -1;
      if (a.target_id > b.target_id) return 1;
      return 0;
    });

    const resultObject = {};
    // Config.
    if (terminology || templates || styles || parameters || colorSchemes) {
      resultObject.config = {};
      if (terminology) resultObject.config.terminology = terminology;
      if (templates) resultObject.config.templates = templates;
      if (styles) resultObject.config.styles = styles;
      if (parameters) resultObject.config.parameters = parameters;
      if (colorSchemes) resultObject.config.color_schemes = colorSchemes;
    }
    // Network.
    resultObject.network = {};
    if (clusters) resultObject.network.clusters = clusters;
    if (items) resultObject.network.items = items;
    if (links) resultObject.network.links = links;

    return resultObject;
  }

  updateStore({ parameters, colorSchemes } = {}) {
    this.updateCustomDefaultClusterColors(colorSchemes && colorSchemes.cluster_colors, false);
    this.updateCustomScoreColors(colorSchemes && colorSchemes.score_colors, false);
    if (parameters && !_isUndefined(parameters.zoom_level)) this.setInitialZoomLevel(parameters.zoom_level);
    if (parameters && !_isUndefined(parameters.largest_component)) this.setLargestComponent(parameters.largest_component);
    if (parameters && !_isUndefined(parameters.min_score)) {
      this.setScoreColorLegendMinScoreAutoValue(false);
      this.updateScoreColorLegendMinScore(parameters.min_score);
    }
    if (parameters && !_isUndefined(parameters.max_score)) {
      this.setScoreColorLegendMaxScoreAutoValue(false);
      this.updateScoreColorLegendMaxScore(parameters.max_score);
    }
    if (parameters && !_isUndefined(parameters.score_colors)) this.updateScoreColorScheme(parameters.score_colors);
  }
}
