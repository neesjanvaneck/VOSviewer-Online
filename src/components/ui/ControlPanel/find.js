import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import HTMLReactParser from 'html-react-parser';
import parse from 'autosuggest-highlight/parse';
import _sortBy from 'lodash/sortBy';
import _isUndefined from 'lodash/isUndefined';

import { DataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import * as s from './styles';

const Find = observer(() => {
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [itemFilterText, setItemFilterText] = useState();
  const debouncedText = useDebounce(itemFilterText, 500);

  useEffect(
    () => {
      if (!_isUndefined(debouncedText)) uiStore.setItemFilterText(debouncedText);
    },
    [debouncedText]
  );

  useEffect(
    () => {},
    [visualizationStore.lastDataUpdate]
  );

  const changeItemFilterText = (itemFilterText) => {
    setItemFilterText(itemFilterText);
  };

  const changeClickedItem = (item) => {
    visualizationStore.updateClickedItem(item, uiStore.dimmingEffect);
    visualizationStore.zoomTo(item);
  };

  const itemList = () => _sortBy(visualizationStore.items, ['label', 'id'])
    .filter(item => item.label.toLowerCase().indexOf(uiStore.itemFilterText.toLowerCase()) !== -1)
    .map((item, i) => {
      const label = HTMLReactParser(item.label);
      const matchPosition = label.toLowerCase().indexOf(uiStore.itemFilterText.toLowerCase());
      const labelParts = parse(label, [[matchPosition, matchPosition + uiStore.itemFilterText.length]]);
      return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <p
          className={s.listItem}
          key={`${label}-${String(i)}`}
          onClick={() => changeClickedItem(item)}
        >
          {
            labelParts.map((labelPart, index) => (
              <span className={labelPart.highlight ? s.labelPartHighlighted : s.labelPartNormal} key={String(index)}>
                {labelPart.text}
              </span>
            ))
          }
        </p>
      );
    });

  return (
    <>
      <TextField
        placeholder={`Find ${dataStore.terminology.item.toLowerCase()}`}
        value={itemFilterText || ''}
        fullWidth
        margin="normal"
        onChange={event => changeItemFilterText(event.target.value)}
      />
      <div>{itemList()}</div>
    </>
  );
});

export default Find;
