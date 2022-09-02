import { makeAutoObservable, runInAction } from 'mobx';
import decodeUriComponent from 'decode-uri-component';
import _clamp from 'lodash/clamp';
import _isUndefined from 'lodash/isUndefined';

import { parameterKeys, defaultParameterValues } from 'utils/variables';

export default class State {
  constructor(state = {}) {
    makeAutoObservable(this, state);
  }

  mapQueryStringValue = defaultParameterValues[parameterKeys.MAP]

  networkQueryStringValue = defaultParameterValues[parameterKeys.NETWORK]

  jsonQueryStringValue = defaultParameterValues[parameterKeys.JSON]

  coloredLinks = defaultParameterValues[parameterKeys.COLORED_LINKS]

  curvedLinks = defaultParameterValues[parameterKeys.CURVED_LINKS]

  darkTheme = defaultParameterValues[parameterKeys.DARK_UI]

  dimmingEffect = defaultParameterValues[parameterKeys.DIMMING_EFFECT]

  gradientCircles = defaultParameterValues[parameterKeys.GRADIENT_CIRCLES]

  itemSizeVariation = defaultParameterValues[parameterKeys.ITEM_SIZE_VARIATION]

  linkSizeVariation = defaultParameterValues[parameterKeys.LINK_SIZE_VARIATION]

  maxLabelLength = defaultParameterValues[parameterKeys.MAX_LABEL_LENGTH]

  maxNLinks = defaultParameterValues[parameterKeys.MAX_N_LINKS]

  minLinkStrength = defaultParameterValues[parameterKeys.MIN_LINK_STRENGTH]

  scale = defaultParameterValues[parameterKeys.SCALE]

  showInfo = defaultParameterValues[parameterKeys.SHOW_INFO]

  showItem = defaultParameterValues[parameterKeys.SHOW_ITEM]

  itemFilterText = ''

  sizeIndex = 0

  colorIndex = 0

  nLinksPerFrame = 1000

  linkTransparency = 0

  controlPanelIsOpen = false

  scoreOptionsPanelIsOpen = false

  fileType = 'vosviewer-json' // or 'vosviewer-map-network'

  mapFileSelectedName = 'No file selected'

  networkFileSelectedName = 'No file selected'

  jsonFileSelectedName = 'No file selected'

  errorDialogIsOpen = false

  unconnectedItemsDialogIsOpen = false

  unconnectedItemsExist = false

  unconnectedItemsDialogNItemsNetwork = undefined

  unconnectedItemsDialogNItemsLargestComponent = undefined

  loadingScreenIsOpen = true

  loadingScreenProcessType = undefined

  loadingScreenProgressValue = 0

  infoDialogIsOpen = false

  introDialogIsOpen = false

  componentWidth = 0

  infoPanelWidth = 0

  rootEl = undefined

  setMapQueryStringValue(mapQueryStringValue) {
    this.mapQueryStringValue = mapQueryStringValue;
  }

  setNetworkQueryStringValue(networkQueryStringValue) {
    this.networkQueryStringValue = networkQueryStringValue;
  }

  setJsonQueryStringValue(jsonQueryStringValue) {
    this.jsonQueryStringValue = jsonQueryStringValue;
  }

  setColoredLinks(coloredLinks) {
    this.coloredLinks = coloredLinks;
  }

  setCurvedLinks(curvedLinks) {
    this.curvedLinks = curvedLinks;
  }

  setDarkTheme(darkTheme) {
    this.darkTheme = darkTheme;
  }

  setDimmingEffect(dimmingEffect) {
    this.dimmingEffect = dimmingEffect;
  }

  setGradientCircles(gradientCircles) {
    this.gradientCircles = gradientCircles;
  }

  setItemSizeVariation(itemSizeVariation) {
    this.itemSizeVariation = _clamp(itemSizeVariation, 0, 1);
  }

  setLinkSizeVariation(linkSizeVariation) {
    this.linkSizeVariation = _clamp(linkSizeVariation, 0, 1);
  }

  setMaxLabelLength(maxLabelLength, onBlur) {
    if (onBlur) {
      this.maxLabelLength = _clamp(Math.round(+maxLabelLength), 0, 300);
    } else {
      this.maxLabelLength = maxLabelLength;
    }
  }

  setMaxNLinks(maxNLinks, onBlur) {
    if (onBlur) {
      this.maxNLinks = _clamp(Math.round(+maxNLinks), 0, 10000);
    } else {
      this.maxNLinks = maxNLinks;
    }
  }

  setMinLinkStrength(minLinkStrength, onBlur) {
    if (onBlur) {
      this.minLinkStrength = _clamp(Math.round(+minLinkStrength), 0, 10000);
    } else {
      this.minLinkStrength = minLinkStrength;
    }
  }

  setScale(scale) {
    this.scale = _clamp(scale, 0.5, 2);
  }

  setShowInfo(showInfo) {
    this.showInfo = showInfo;
  }

  setShowItem(showItem) {
    this.showItem = showItem;
  }

  setItemFilterText(text) {
    this.itemFilterText = text;
  }

  setSizeIndex(sizeIndex) {
    this.sizeIndex = sizeIndex;
  }

  setColorIndex(colorIndex) {
    this.colorIndex = colorIndex;
    this.scoreOptionsPanelIsOpen = false;
  }

  setnLinksPerFrame(nLinksPerFrame) {
    this.nLinksPerFrame = _clamp(Math.round(+nLinksPerFrame), 0, 2000);
  }

  setLinkTransparency(linkTransparency) {
    this.linkTransparency = _clamp(linkTransparency, 0, 1);
  }

  setControlPanelIsOpen(controlPanelIsOpen) {
    this.controlPanelIsOpen = !_isUndefined(controlPanelIsOpen) ? controlPanelIsOpen : !this.controlPanelIsOpen;
  }

  setScoreOptionsPanelIsOpen(scoreOptionsPanelIsOpen) {
    this.scoreOptionsPanelIsOpen = !_isUndefined(scoreOptionsPanelIsOpen) ? scoreOptionsPanelIsOpen : !this.scoreOptionsPanelIsOpen;
  }

  setFileType(fileType) {
    this.fileType = fileType;
  }

  setMapFileSelectedName(mapFileSelectedName) {
    this.mapFileSelectedName = mapFileSelectedName;
  }

  resetMapFileSelectedName() {
    this.mapFileSelectedName = 'No file selected';
  }

  setNetworkFileSelectedName(networkFileSelectedName) {
    this.networkFileSelectedName = networkFileSelectedName;
  }

  resetNetworkFileSelectedName() {
    this.networkFileSelectedName = 'No file selected';
  }

  setJsonFileSelectedName(jsonFileSelectedName) {
    this.jsonFileSelectedName = jsonFileSelectedName;
  }

  resetJsonFileSelectedName() {
    this.jsonFileSelectedName = 'No file selected';
  }

  setErrorDialogIsOpen(errorDialogIsOpen) {
    this.errorDialogIsOpen = errorDialogIsOpen;
  }

  setUnconnectedItemsDialogIsOpen(unconnectedItemsDialogIsOpen) {
    this.unconnectedItemsDialogIsOpen = unconnectedItemsDialogIsOpen;
  }

  setUnconnectedItemsDialog(unconnectedItemsExist = false, unconnectedItemsDialogNItemsNetwork, unconnectedItemsDialogNItemsLargestComponent) {
    this.unconnectedItemsExist = unconnectedItemsExist;
    this.unconnectedItemsDialogNItemsNetwork = unconnectedItemsDialogNItemsNetwork;
    this.unconnectedItemsDialogNItemsLargestComponent = unconnectedItemsDialogNItemsLargestComponent;
  }

  setLoadingScreenIsOpen(loadingScreenIsOpen) {
    this.loadingScreenIsOpen = loadingScreenIsOpen;
  }

  setLoadingScreenProcessType(loadingScreenProcessType) {
    this.loadingScreenProcessType = loadingScreenProcessType;
  }

  async setLoadingScreenProgressValue(loadingScreenProgressValue) {
    this.loadingScreenProgressValue = loadingScreenProgressValue;
    if (loadingScreenProgressValue === 100) {
      await new Promise((_) => setTimeout(_, 500));
      // https://mobx.js.org/actions.html#runinaction
      runInAction(() => { this.loadingScreenProgressValue = 0; });
    }
  }

  setInfoDialogIsOpen(infoDialogIsOpen) {
    this.infoDialogIsOpen = infoDialogIsOpen;
  }

  setIntroDialogIsOpen(introDialogIsOpen) {
    this.introDialogIsOpen = introDialogIsOpen;
  }

  setComponentWidth(componentWidth) {
    this.componentWidth = componentWidth;
  }

  setInfoPanelWidth(infoPanelWidth) {
    this.infoPanelWidth = infoPanelWidth;
  }

  setRootEl(el) {
    this.rootEl = el;
  }

  updateStore({ parameters }) {
    if (!parameters) return;

    if (!_isUndefined(parameters.map)) this.setMapQueryStringValue(parameters.map);
    if (!_isUndefined(parameters.network)) this.setNetworkQueryStringValue(parameters.network);
    if (!_isUndefined(parameters.json)) this.setJsonQueryStringValue(parameters.json);

    if (!_isUndefined(parameters.colored_links)) this.setColoredLinks(parameters.colored_links);
    if (!_isUndefined(parameters.curved_links)) this.setCurvedLinks(parameters.curved_links);
    if (!_isUndefined(parameters.dark_ui)) this.setDarkTheme(parameters.dark_ui);
    if (!_isUndefined(parameters.dimming_effect)) this.setDimmingEffect(parameters.dimming_effect);
    if (!_isUndefined(parameters.gradient_circles)) this.setGradientCircles(parameters.gradient_circles);
    if (!_isUndefined(parameters.item_color)) this.setColorIndex(parameters.item_color - 1);
    if (!_isUndefined(parameters.item_size)) this.setSizeIndex(parameters.item_size - 1);
    if (!_isUndefined(parameters.item_size_variation)) this.setItemSizeVariation(parameters.item_size_variation);
    if (!_isUndefined(parameters.link_size_variation)) this.setLinkSizeVariation(parameters.link_size_variation);
    if (!_isUndefined(parameters.max_label_length)) this.setMaxLabelLength(parameters.max_label_length, true);
    if (!_isUndefined(parameters.max_n_links)) this.setMaxNLinks(parameters.max_n_links, true);
    if (!_isUndefined(parameters.min_link_strength)) this.setMinLinkStrength(parameters.min_link_strength);
    if (!_isUndefined(parameters.scale)) this.setScale(parameters.scale);
    if (!_isUndefined(parameters.show_info)) this.setShowInfo(parameters.show_info);
    if (!_isUndefined(parameters.show_item)) {
      const decodedValue = decodeUriComponent(parameters.show_item);
      this.setShowItem(decodedValue);
    }
  }
}
