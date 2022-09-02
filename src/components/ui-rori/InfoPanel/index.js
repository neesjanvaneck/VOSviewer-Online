import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HTMLReactParser from 'html-react-parser';

import { DataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { trimTextEnd } from 'utils/helpers';
import * as s from './styles';

const VerticalDivider = () => <div component="p" className={s.divider}> | </div>;
const Content = ({ text }) => (<div component="p" className={s.infoText}>{text}</div>);
const HeadContent = ({ text }) => (
  <>
    <div className="head-content">{HTMLReactParser(text)}</div>
    <hr />
  </>
);

const InfoPanel = observer(() => {
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(
    () => {},
    [visualizationStore.lastItemUpdate, visualizationStore.lastLinkUpdate, visualizationStore.hoveredItem, visualizationStore.clickedItem]
  );

  useEffect(() => {
    if ((visualizationStore.hoveredItem || visualizationStore.clickedItem)) {
      setIsOpen(true);
    }
  }, [visualizationStore.hoveredItem, visualizationStore.clickedItem]);

  const exitInfoPanel = () => {
    setIsOpen(!isOpen);
    visualizationStore.updateClickedItem(undefined, uiStore.dimmingEffect);
  };

  const weigthName = () => {
    const text = (visualizationStore.weightKeysCustomTerminology && visualizationStore.weightKeysCustomTerminology.length > 0 ) ? visualizationStore.weightKeysCustomTerminology[visualizationStore.weightIndex] : '';
    const findMatch = text && text.match(/<(.*)>/);
    return findMatch ? findMatch[1] : text;
  };

  const scoreName = () => {
    const text = visualizationStore.scoreKeys[visualizationStore.scoreIndex];
    const findMatch = text && text.match(/<(.*)>/);
    return findMatch ? findMatch[1] : text;
  };

  const formatNumber = num => {
    const number = +num;
    if (number < 1) return number.toPrecision(2);
    else return Math.floor(number) + +(number % 1).toFixed(2);
  };

  const nodeContent = () => {
    const node = getNode();
    const name = weigthName();
    const score = scoreName();
    return (
      <>
        { name !== dataStore.terminology.total_link_strength && name !== dataStore.terminology.links ? <Content text={`${trimTextEnd(name, 30)}: ${formatNumber(node[visualizationStore.weightKeysCustomTerminology[visualizationStore.weightIndex]])} `} /> : ''}
        {uiStore.colorIndex > 0
          && (
            <>
              <VerticalDivider />
              <Content text={`${trimTextEnd(score, 30)}: ${formatNumber(node[visualizationStore.scoreKey])} `} />
            </>
          )
        }
      </>
    );
  };

  const getNode = () => visualizationStore.hoveredItem || visualizationStore.clickedItem;

  return (
    <>
      {isOpen
        && (
          <div className={s.panel} style={{ display: getNode() ? 'block' : 'none' }}>
            <IconButton className={s.closeButton} onClick={exitInfoPanel}>
              <CloseIcon fontSize="small" />
            </IconButton>
            {getNode() && getNode().description ? <HeadContent text={getNode().description} /> : '' }
            {
              getNode()
              ? nodeContent()
              : null
            }
          </div>
        )
      }
    </>
  );
});

export default InfoPanel;
