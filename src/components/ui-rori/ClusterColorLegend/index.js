import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { clusterNames } from 'utils/variables-rori';
import * as s from './styles';

const ClusterColorLegend = observer(() => {
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);

  useEffect(() => {}, [visualizationStore.lastItemUpdate]);

  return (
    <div className={s.legendBox} style={{ display: uiStore.colorIndex > 0 ? 'none' : 'block' }}>
      {clusterNames.map((name, i) => (
        <div key={name} style={{ whiteSpace: 'pre' }}>
          <div className="circle" style={{ backgroundColor: visualizationStore.clusterColorScheme((i + 1).toString()) }} />
          <div className="text">{name}</div>
        </div>

      ))}
    </div>
  );
});

export default ClusterColorLegend;
