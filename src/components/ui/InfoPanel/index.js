/* eslint-disable consistent-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Link, Paper, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { format } from 'd3-format';
import _isNil from 'lodash/isNil';
import _isNull from 'lodash/isNull';
import _isUndefined from 'lodash/isUndefined';

import { ConfigStoreContext, FileDataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { trimTextEnd } from 'utils/helpers';
import { parseDescription } from 'utils/helpers2';
import * as s from './styles';

const InfoItem = ({ text }) => (<Typography component="p" className={s.infoItem}>{text}</Typography>);
const Divider = () => <Typography component="p" className={s.divider}> | </Typography>;

const InfoPanel = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const fileDataStore = useContext(FileDataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const refEl = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  if (refEl && refEl.current) {
    uiStore.setInfoPanelWidth(refEl.current.offsetWidth);
  }

  useEffect(
    () => {},
    [visualizationStore.lastItemUpdate, visualizationStore.lastLinkUpdate]
  );

  useEffect(() => {
    if (visualizationStore.hoveredItem || visualizationStore.clickedItem || visualizationStore.hoveredLink || visualizationStore.clickedLink) {
      setIsOpen(true);
    }
  }, [visualizationStore.hoveredItem, visualizationStore.clickedItem, visualizationStore.hoveredLink, visualizationStore.clickedLink]);

  const exitInfoPanel = () => {
    setIsOpen(!isOpen);
    visualizationStore.updateClickedItem(undefined, uiStore.dimmingEffect);
    visualizationStore.updateClickedLink(undefined, uiStore.dimmingEffect);
  };

  const getSizeLabel = () => {
    const text = (visualizationStore.weightKeysCustomTerminology && visualizationStore.weightKeysCustomTerminology.length > 0 ) ? visualizationStore.weightKeysCustomTerminology[visualizationStore.weightIndex] : '';
    const findMatch = text && text.match(/<(.*)>/);
    return findMatch ? findMatch[1] : text;
  };

  const getScoreLabel = () => {
    if (!visualizationStore.scoreKeys.length) return;
    const text = visualizationStore.scoreKeys[visualizationStore.scoreIndex];
    const findMatch = text && text.match(/<(.*)>/);
    return findMatch ? findMatch[1] : text;
  };

  const getItemLabel = (item) => item.label;

  const getItemLinkData = (item) => visualizationStore.itemLinkData[item.id];

  const formatNumber = (number) => {
    if (_isNull(number)) return '-';
    const isInteger = (number % 1) === 0;
    if (isInteger) {
      return format('.0f')(number);
    } else if (number > 0 && number < 0.005) {
      return format('.2e')(number);
    } else {
      return format('.2f')(number);
    }
  };

  const getItemOrLinkInfo = () => {
    const { hoveredItem, clickedItem, hoveredLink, clickedLink } = visualizationStore;
    const highlightedItem = hoveredItem || clickedItem;
    const highlightedLink = hoveredLink || clickedLink;
    const itemLinkData = highlightedItem && getItemLinkData(highlightedItem);
    const sizeLabel = highlightedItem && getSizeLabel();
    const scoreLabel = highlightedItem && getScoreLabel();
    const weightValue = (visualizationStore.weightKeys && visualizationStore.weightKeys.length > 0) ? highlightedItem && highlightedItem[visualizationStore.weightKey] : undefined;
    return (
      (highlightedItem && !hoveredLink) ? (
        <>
          <InfoItem text={`${fileDataStore.terminology.item}: ${trimTextEnd(getItemLabel(highlightedItem), 50)}`} />
          {itemLinkData
            && (
              <>
                <Divider />
                <InfoItem text={`${fileDataStore.terminology.links}: ${formatNumber(itemLinkData.nLinks)}`} />
                {uiStore.windowInnerWidth > 800
                  && (
                    <>
                      <Divider />
                      <InfoItem text={`${fileDataStore.terminology.total_link_strength}: ${formatNumber(itemLinkData.totalLinkStrength)}`} />
                    </>
                  )
                }
              </>
            )
          }
          {!_isUndefined(weightValue) && ((sizeLabel !== fileDataStore.terminology.total_link_strength && sizeLabel !== fileDataStore.terminology.links)
            || ((sizeLabel === fileDataStore.terminology.total_link_strength || sizeLabel === fileDataStore.terminology.links) && !itemLinkData))
            && (
              <>
                <Divider />
                <InfoItem text={`${sizeLabel === 'weight' ? 'Custom' : sizeLabel}: ${formatNumber(weightValue)}`} />
              </>
            )
          }
          {uiStore.colorIndex === 0 && !_isNil(highlightedItem.cluster)
            && (
              <>
                <Divider />
                <InfoItem text={`${fileDataStore.terminology.cluster}: ${fileDataStore.clusters.get(highlightedItem.cluster) || highlightedItem.cluster}`} />
              </>
            )
          }
          {uiStore.colorIndex > 0
            && (
              <>
                <Divider />
                <InfoItem text={`${scoreLabel === 'score' ? 'Custom' : scoreLabel}: ${formatNumber(highlightedItem[visualizationStore.scoreKey])}`} />
              </>
            )
          }
          {highlightedItem.url
            && (
              <>
                <Divider />
                <InfoItem text={<Link target="_blank" href={highlightedItem.url}> URL </Link>} />
              </>
            )
          }
        </>
      )
      : (
        <>
          <InfoItem text={`${fileDataStore.terminology.item} 1: ${trimTextEnd(getItemLabel(visualizationStore.itemsForLinks[highlightedLink.from]), 50)}`} />
          <Divider />
          <InfoItem text={`${fileDataStore.terminology.item} 2: ${trimTextEnd(getItemLabel(visualizationStore.itemsForLinks[highlightedLink.to]), 50)}`} />
          <Divider />
          <InfoItem text={`${fileDataStore.terminology.link_strength}: ${formatNumber(highlightedLink.strength)}`} />
          {highlightedLink.url
            && (
              <>
                <Divider />
                <InfoItem text={<Link target="_blank" href={highlightedLink.url}> URL </Link>} />
              </>
            )
          }
        </>
      )
    );
  };

  const showInfoContent = () => configStore.uiConfig.information_panel;

  const showDescriptionContent = () => isOpen
      && configStore.uiConfig.description_panel
      && (
        (visualizationStore.hoveredItem && visualizationStore.hoveredItem.description)
        || (visualizationStore.clickedItem && visualizationStore.clickedItem.description)
        || (visualizationStore.hoveredLink && visualizationStore.hoveredLink.description)
        || (visualizationStore.clickedLink && visualizationStore.clickedLink.description)
        || ((visualizationStore.hoveredItem || visualizationStore.clickedItem) && fileDataStore.templates.item_description)
        || ((visualizationStore.hoveredLink || visualizationStore.clickedLink) && fileDataStore.templates.link_description)
      );

  const getItemDescription = (item) => parseDescription(item, 'item_description', { fileDataStore, visualizationStore });

  const getLinkDescription = (link) => parseDescription(link, 'link_description', { fileDataStore, visualizationStore });

  return (
    <>
      {(showInfoContent() || showDescriptionContent())
        && (
          <Paper className={`${s.infoPanel} ${uiStore.controlPanelIsOpen ? s.shifted : s.notshifted} ${visualizationStore.items.length ? s.visible : ''}`} ref={refEl} elevation={3}>
            {showDescriptionContent() && (
              <IconButton className={s.closeButton} onClick={exitInfoPanel}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            {showDescriptionContent()
              && (
                <>
                  <Typography component="div" className={s.description}>
                    {getItemDescription(visualizationStore.hoveredItem)
                      || getLinkDescription(visualizationStore.hoveredLink)
                      || getItemDescription(visualizationStore.clickedItem)
                      || getLinkDescription(visualizationStore.clickedLink)
                    }
                  </Typography>
                  {showInfoContent() && <hr />}
                </>
              )
            }
            {showInfoContent()
              && (visualizationStore.hoveredItem || visualizationStore.hoveredLink || visualizationStore.clickedItem || visualizationStore.clickedLink
                ? getItemOrLinkInfo()
                : (
                  <>
                    <InfoItem text={`${fileDataStore.terminology.items}: ${visualizationStore.items.length}`} />
                    {Boolean(visualizationStore.links.length)
                      && (
                        <>
                          <Divider />
                          <InfoItem text={`${fileDataStore.terminology.links}: ${formatNumber(visualizationStore.links.length)}`} />
                          {uiStore.windowInnerWidth > 800
                            && (
                              <>
                                <Divider />
                                <InfoItem text={`${fileDataStore.terminology.total_link_strength}: ${formatNumber(visualizationStore.totalLinkStrength)}`} />
                              </>
                            )
                          }
                        </>
                      )
                    }
                    {visualizationStore.clusters && uiStore.colorIndex === 0
                      && (
                        <>
                          <Divider />
                          <InfoItem text={`${fileDataStore.terminology.clusters}: ${visualizationStore.clusters.length}`} />
                        </>
                      )
                    }
                  </>
                )
              )
            }
          </Paper>
        )
      }
    </>
  );
});

export default InfoPanel;
