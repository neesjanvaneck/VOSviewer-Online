import { makeAutoObservable } from 'mobx';
import _clamp from 'lodash/clamp';
import _isPlainObject from 'lodash/isPlainObject';
import _isUndefined from 'lodash/isUndefined';
import _merge from 'lodash/merge';

import { parameterKeys, defaultParameterValues, urlPreviewPanelWidthExtent } from 'utils/variables';

export default class State {
  constructor(state = {}) {
    makeAutoObservable(this, state);
  }

  config = {
    full_mode: {
      control_panel: {
        view: {
          scale: true,
          item_size: true,
          item_color: true,
          item_size_variation: true,
          max_label_length: true,
          link_size_variation: true,
          min_link_strength: true,
          max_n_links: true,
          n_links_per_frame: false,
          link_transparency: false,
          colored_links: false,
          curved_links: true,
          cluster_colors: true,
          score_colors: true,
          gradient_circles: false,
          dimming_effect: false,
        },
        find: true,
        update: {
          rotate_flip: true,
          normalization: true,
          layout: true,
          clustering: true,
        },
      },
      url_preview_panel: false,
      zoom_panel: true,
      information_panel: true,
      description_panel: true,
      legend_panel: true,
      open_icon: true,
      save_icon: true,
      screenshot_icon: true,
      share_icon: true,
      background_icon: true,
      fullscreen_icon: true,
    },
    simple_mode: {
      control_panel: {
        view: {
          scale: true,
          item_size: true,
          item_color: true,
          item_size_variation: true,
          max_label_length: true,
          link_size_variation: true,
          min_link_strength: true,
          max_n_links: true,
          n_links_per_frame: false,
          link_transparency: false,
          colored_links: false,
          curved_links: true,
          cluster_colors: true,
          score_colors: true,
          gradient_circles: false,
          dimming_effect: false,
        },
        find: true,
        update: {
          rotate_flip: true,
          normalization: true,
          layout: true,
          clustering: true
        },
      },
      url_preview_panel: false,
      zoom_panel: true,
      information_panel: true,
      description_panel: true,
      legend_panel: true,
      open_icon: true,
      save_icon: true,
      screenshot_icon: true,
      share_icon: true,
      background_icon: true,
      fullscreen_icon: true,
    },
    ui_style: {
      font_family: '"Roboto", "Helvetica", "Arial", sans-serif',
      palette_primary_main_color: '#3f51b5'
    },
    parameters: {
      // Data.
      json: defaultParameterValues[parameterKeys.JSON],
      map: defaultParameterValues[parameterKeys.MAP],
      network: defaultParameterValues[parameterKeys.NETWORK],
      // Layout and clustering.
      attraction: defaultParameterValues[parameterKeys.ATTRACTION],
      largest_component: defaultParameterValues[parameterKeys.LARGEST_COMPONENT],
      merge_small_clusters: defaultParameterValues[parameterKeys.MERGE_SMALL_CLUSTERS],
      min_cluster_size: defaultParameterValues[parameterKeys.MIN_CLUSTER_SIZE],
      repulsion: defaultParameterValues[parameterKeys.REPULSION],
      resolution: defaultParameterValues[parameterKeys.RESOLUTION],
      // Visualization.
      colored_links: defaultParameterValues[parameterKeys.COLORED_LINKS],
      curved_links: defaultParameterValues[parameterKeys.CURVED_LINKS],
      dimming_effect: defaultParameterValues[parameterKeys.DIMMING_EFFECT],
      gradient_circles: defaultParameterValues[parameterKeys.GRADIENT_CIRCLES],
      item_color: defaultParameterValues[parameterKeys.ITEM_COLOR],
      item_size: defaultParameterValues[parameterKeys.ITEM_SIZE],
      item_size_variation: defaultParameterValues[parameterKeys.ITEM_SIZE_VARIATION],
      link_size_variation: defaultParameterValues[parameterKeys.LINK_SIZE_VARIATION],
      max_label_length: defaultParameterValues[parameterKeys.MAX_LABEL_LENGTH],
      max_n_links: defaultParameterValues[parameterKeys.MAX_N_LINKS],
      max_score: defaultParameterValues[parameterKeys.MAX_SCORE],
      min_link_strength: defaultParameterValues[parameterKeys.MIN_LINK_STRENGTH],
      min_score: defaultParameterValues[parameterKeys.MIN_SCORE],
      scale: defaultParameterValues[parameterKeys.SCALE],
      score_colors: defaultParameterValues[parameterKeys.SCORE_COLORS],
      show_item: defaultParameterValues[parameterKeys.SHOW_ITEM],
      zoom_level: defaultParameterValues[parameterKeys.ZOOM_LEVEL],
      // UI.
      dark_ui: defaultParameterValues[parameterKeys.DARK_UI],
      show_info: defaultParameterValues[parameterKeys.SHOW_INFO],
      simple_ui: defaultParameterValues[parameterKeys.SIMPLE_UI],
      url_preview_panel: defaultParameterValues[parameterKeys.URL_PREVIEW_PANEL],
    },
    proxy_url: '',
    docs_url: '',
  }

  simpleMode = false

  fullscreen = false

  urlPreviewPanelIsOpen = false

  urlPreviewPanelWidth = defaultParameterValues[parameterKeys.URL_PREVIEW_PANEL]

  get uiConfig() {
    return this.simpleMode ? this.config.simple_mode : this.config.full_mode;
  }

  get uiStyle() {
    return this.config.ui_style;
  }

  get parameters() {
    return this.config.parameters;
  }

  get tabView() {
    const optionConfig = this.uiConfig.control_panel.view;
    return optionConfig && (optionConfig.scale
    || optionConfig.item_size
    || optionConfig.item_color
    || optionConfig.item_size_variation
    || optionConfig.max_label_length
    || optionConfig.link_size_variation
    || optionConfig.min_link_strength
    || optionConfig.max_n_links
    || optionConfig.n_links_per_frame
    || optionConfig.link_transparency
    || optionConfig.colored_links
    || optionConfig.curved_links
    || optionConfig.cluster_colors
    || optionConfig.score_colors
    || optionConfig.gradient_circles
    || optionConfig.dimming_effect);
  }

  get tabFind() {
    return this.uiConfig.control_panel.find;
  }

  get tabUpdate() {
    const updateConfig = this.uiConfig.control_panel.update;
    return updateConfig && (updateConfig.normalization
      || updateConfig.layout
      || updateConfig.clustering
      || updateConfig.rotate_flip);
  }

  get urlPreviewPanel() {
    return this.uiConfig.url_preview_panel && this.urlPreviewPanelIsOpen && this.urlPreviewPanelWidth >= urlPreviewPanelWidthExtent[0];
  }

  get proxyUrl() {
    return this.config.proxy_url;
  }

  get docsUrl() {
    return this.config.docs_url;
  }

  setSimpleMode(simpleMode) {
    this.simpleMode = simpleMode;
  }

  setFullscreen(fullscreen) {
    this.fullscreen = fullscreen;
  }

  setUrlPreviewPanelIsOpen(urlPreviewPanelIsOpen) {
    this.urlPreviewPanelIsOpen = urlPreviewPanelIsOpen;
  }

  setUrlPreviewPanelWidth(urlPreviewPanelWidth) {
    if (urlPreviewPanelWidth === 0) {
      this.urlPreviewPanelWidth = 0;
    } else {
      this.urlPreviewPanelWidth = _clamp(urlPreviewPanelWidth, urlPreviewPanelWidthExtent[0], urlPreviewPanelWidthExtent[1]);
    }
  }

  init(config) {
    if (_isPlainObject(this.config.ui_style)) this.config.ui_style = _merge(this.config.ui_style, config.ui_style);
    if (_isPlainObject(this.config.parameters)) this.config.parameters = _merge(this.config.parameters, config.parameters);

    if (!_isUndefined(this.config.parameters.simple_ui)) this.setSimpleMode(this.config.parameters.simple_ui);
    if (!_isUndefined(this.config.parameters.url_preview_panel)) this.setUrlPreviewPanelWidth(this.config.parameters.url_preview_panel);

    if (config.full_mode) this._recursiveMerge(config.full_mode, this.config.full_mode);
    if (config.simple_mode) this._recursiveMerge(config.simple_mode, this.config.simple_mode);

    if (config.proxy_url) this.config.proxy_url = config.proxy_url;
    if (config.docs_url) this.config.docs_url = config.docs_url;
  }

  _recursiveMerge(newValue, initValue) {
    if (newValue === undefined) return;
    if (typeof newValue === 'boolean' && _isPlainObject(initValue)) {
      Object.keys(initValue).forEach(key => {
        if (_isPlainObject(initValue[key])) this._recursiveMerge(newValue, initValue[key]);
        else initValue[key] = newValue;
      });
    } else if (_isPlainObject(newValue) && _isPlainObject(initValue)) {
      Object.keys(initValue).forEach(key => {
        if ((typeof newValue[key] === 'boolean') && typeof initValue[key] === 'boolean') {
          initValue[key] = newValue[key];
        } else this._recursiveMerge(newValue[key], initValue[key]);
      });
    }
  }

  updateStore({ parameters }) {
    if (!parameters) return;
    if (!_isUndefined(parameters.simple_ui)) this.setSimpleMode(parameters.simple_ui);
    if (!_isUndefined(parameters.url_preview_panel)) this.setUrlPreviewPanelWidth(parameters.url_preview_panel);
  }
}
