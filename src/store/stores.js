import React from 'react';

import ConfigStore from 'store/config';
import ClusteringStore from 'store/clustering';
import DataStore from 'store/data';
import LayoutStore from 'store/layout';
import NormalizationStore from 'store/normalization';
import QueryStringStore from 'store/querystring';
import UiStore from 'store/ui';
import UiRoriStore from 'store/ui-rori';
import VisualizationStore from 'store/visualization';
import WebworkerStore from 'store/webworker';

export const ConfigStoreContext = React.createContext();
export const ClusteringStoreContext = React.createContext();
export const DataStoreContext = React.createContext();
export const LayoutStoreContext = React.createContext();
export const NormalizationStoreContext = React.createContext();
export const QueryStringStoreContext = React.createContext();
export const UiStoreContext = React.createContext();
export const UiRoriStoreContext = React.createContext();
export const VisualizationStoreContext = React.createContext();
export const WebworkerStoreContext = React.createContext();

export const ConfigProvider = ({ children }) => (
  <ConfigStoreContext.Provider value={new ConfigStore()}>
    {children}
  </ConfigStoreContext.Provider>
);

export const ClusteringProvider = ({ children }) => (
  <ClusteringStoreContext.Provider value={new ClusteringStore()}>
    {children}
  </ClusteringStoreContext.Provider>
);

export const DataProvider = ({ children }) => (
  <DataStoreContext.Provider value={new DataStore()}>
    {children}
  </DataStoreContext.Provider>
);

export const LayoutProvider = ({ children }) => (
  <LayoutStoreContext.Provider value={new LayoutStore()}>
    {children}
  </LayoutStoreContext.Provider>
);

export const NormalizationProvider = ({ children }) => (
  <NormalizationStoreContext.Provider value={new NormalizationStore()}>
    {children}
  </NormalizationStoreContext.Provider>
);

export const QueryStringProvider = ({ children }) => (
  <QueryStringStoreContext.Provider value={new QueryStringStore()}>
    {children}
  </QueryStringStoreContext.Provider>
);

export const UiProvider = ({ children }) => (
  <UiStoreContext.Provider value={new UiStore()}>
    {children}
  </UiStoreContext.Provider>
);

export const UiRoriProvider = ({ children }) => (
  <UiRoriStoreContext.Provider value={new UiRoriStore()}>
    {children}
  </UiRoriStoreContext.Provider>
);

export const VisualizationProvider = ({ children }) => (
  <VisualizationStoreContext.Provider value={new VisualizationStore()}>
    {children}
  </VisualizationStoreContext.Provider>
);

export const WebworkerProvider = ({ children }) => (
  <WebworkerStoreContext.Provider value={new WebworkerStore()}>
    {children}
  </WebworkerStoreContext.Provider>
);
