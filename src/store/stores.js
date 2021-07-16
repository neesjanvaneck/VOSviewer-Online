import React from 'react';

import ConfigStore from 'store/config';
import ClusteringStore from 'store/clustering';
import FileDataStore from 'store/filedata';
import LayoutStore from 'store/layout';
import NormalizationStore from 'store/normalization';
import QueryStringStore from 'store/querystring';
import UiStore from 'store/ui';
import UiRoriStore from 'store/ui-rori';
import VisualizationStore from 'store/visualization';
import WebworkerStore from 'store/webworker';

const configStore = new ConfigStore();
const clusteringStore = new ClusteringStore();
const fileDataStore = new FileDataStore();
const layoutStore = new LayoutStore();
const normalizationStore = new NormalizationStore();
const queryStringStore = new QueryStringStore();
const uiStore = new UiStore();
const uiRoriStore = new UiRoriStore();
const visualizationStore = new VisualizationStore();
const webworkerStore = new WebworkerStore();

export const ConfigStoreContext = React.createContext(configStore);
export const ClusteringStoreContext = React.createContext(clusteringStore);
export const FileDataStoreContext = React.createContext(fileDataStore);
export const LayoutStoreContext = React.createContext(layoutStore);
export const NormalizationStoreContext = React.createContext(normalizationStore);
export const QueryStringStoreContext = React.createContext(queryStringStore);
export const UiStoreContext = React.createContext(uiStore);
export const UiRoriStoreContext = React.createContext(uiRoriStore);
export const VisualizationStoreContext = React.createContext(visualizationStore);
export const WebworkerStoreContext = React.createContext(webworkerStore);
