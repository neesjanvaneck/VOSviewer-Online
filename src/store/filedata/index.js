/* global MODE */
import { extendObservable } from 'mobx';
import _clone from 'lodash/clone';
import _capitalize from 'lodash/capitalize';
import _keys from 'lodash/keys';
import _includes from 'lodash/includes';
import _merge from 'lodash/merge';

import { mapFileHeaders, defaultTerminology, defaultTemplates, defaultStyles } from 'utils/variables';

export default class State {
  constructor() {
    extendObservable(
      this,
      {
        fileError: undefined,
        mapFile: undefined,
        networkFile: undefined,
        jsonFile: undefined,
        clusters: new Map(),
      },
    );
    this.mapData = [];
    this.networkData = [];
    this.jsonData = {};
    this.terminology = _clone(defaultTerminology);
    this.templates = {};
    this.styles = {};
  }

  get parameters() {
    return this.jsonData.config ? this.jsonData.config.parameters : undefined;
  }

  get coordinatesAreAvailable() {
    const keys = _keys(this.mapData[0]);
    return keys && _includes(keys, mapFileHeaders.X) && _includes(keys, mapFileHeaders.Y);
  }

  get clustersAreAvailable() {
    const keys = _keys(this.mapData[0]);
    return keys && _includes(keys, mapFileHeaders.CLUSTER);
  }

  get networkDataIsAvailable() {
    return this.networkData.length > 0;
  }

  setMapFile(mapFile) {
    this.mapFile = mapFile;
  }

  setNetworkFile(networkFile) {
    this.networkFile = networkFile;
  }

  setJsonFile(jsonFile) {
    this.jsonFile = jsonFile;
  }

  setMapData(mapData) {
    this.mapData = mapData;
  }

  setNetworkData(networkData) {
    this.networkData = networkData;
  }

  init(data, uiStyle) {
    this.fileError = data.fileError;
    this.mapData = data.mapData ? data.mapData : [];
    this.networkData = data.networkData ? data.networkData : [];
    this.jsonData = data.jsonData ? data.jsonData : {};
    this.updateClusters(data.jsonData && data.jsonData.network && data.jsonData.network.clusters);
    this.updateTerminology(data.jsonData && data.jsonData.config && data.jsonData.config.terminology);
    this.updateTemplates(data.jsonData && data.jsonData.config && data.jsonData.config.templates);
    this.updateStyles(uiStyle, data.jsonData && data.jsonData.config && data.jsonData.config.styles);
  }

  updateClusters(clusters) {
    this.clusters = new Map();
    if (clusters) {
      this.clusters = clusters.reduce((acc, curr) => {
        acc.set(curr.cluster, curr.label);
        return acc;
      }, new Map());
    }
  }

  updateTerminology(terminology) {
    this.terminology = _clone(defaultTerminology);
    if (terminology) {
      Object.keys(terminology).forEach(k => {
        this.terminology[k] = _capitalize(terminology[k]);
      });
    }
  }

  updateTemplates(templates) {
    this.templates = (MODE === 'dimensions') ? defaultTemplates(this.terminology.item, this.terminology.link) : {};
    if (templates) {
      this.templates.item_description = templates.item_description;
      this.templates.link_description = templates.link_description;
    }
  }

  updateStyles(uiStyle, styles) {
    this.styles = defaultStyles(uiStyle);
    if (styles) {
      this.styles = _merge(this.styles, styles);
    }
  }

  getClusters() {
    return this.jsonData.network ? this.jsonData.network.clusters : undefined;
  }

  getColorSchemes() {
    return this.jsonData.config ? this.jsonData.config.color_schemes : undefined;
  }

  getTerminology() {
    return this.jsonData.config ? this.jsonData.config.terminology : undefined;
  }

  getTemplates() {
    return this.jsonData.config ? this.jsonData.config.templates : undefined;
  }

  getStyles() {
    return this.jsonData.config ? this.jsonData.config.styles : undefined;
  }
}
