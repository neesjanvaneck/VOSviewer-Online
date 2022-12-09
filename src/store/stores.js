import React, { useRef } from 'react';

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

// https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
function getStore(Store) {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = new Store();
  }
  return ref.current;
}

export const ConfigProvider = ({ children }) => (
  <ConfigStoreContext.Provider value={getStore(ConfigStore)}>
    {children}
  </ConfigStoreContext.Provider>
);

export const ClusteringProvider = ({ children }) => (
  <ClusteringStoreContext.Provider value={getStore(ClusteringStore)}>
    {children}
  </ClusteringStoreContext.Provider>
);

export const DataProvider = ({ children }) => (
  <DataStoreContext.Provider value={getStore(DataStore)}>
    {children}
  </DataStoreContext.Provider>
);

export const LayoutProvider = ({ children }) => (
  <LayoutStoreContext.Provider value={getStore(LayoutStore)}>
    {children}
  </LayoutStoreContext.Provider>
);

export const NormalizationProvider = ({ children }) => (
  <NormalizationStoreContext.Provider value={getStore(NormalizationStore)}>
    {children}
  </NormalizationStoreContext.Provider>
);

export const QueryStringProvider = ({ children }) => (
  <QueryStringStoreContext.Provider value={getStore(QueryStringStore)}>
    {children}
  </QueryStringStoreContext.Provider>
);

export const UiProvider = ({ children }) => (
  <UiStoreContext.Provider value={getStore(UiStore)}>
    {children}
  </UiStoreContext.Provider>
);

export const UiRoriProvider = ({ children }) => (
  <UiRoriStoreContext.Provider value={getStore(UiRoriStore)}>
    {children}
  </UiRoriStoreContext.Provider>
);

export const VisualizationProvider = ({ children }) => (
  <VisualizationStoreContext.Provider value={getStore(VisualizationStore)}>
    {children}
  </VisualizationStoreContext.Provider>
);

export const WebworkerProvider = ({ children }) => (
  <WebworkerStoreContext.Provider value={getStore(WebworkerStore)}>
    {children}
  </WebworkerStoreContext.Provider>
);
