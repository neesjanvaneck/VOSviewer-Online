/* eslint-disable consistent-return */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, Link, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'd3-format';
import { css } from '@emotion/css';
import _isNil from 'lodash/isNil';
import _isNull from 'lodash/isNull';
import _isUndefined from 'lodash/isUndefined';

import { ConfigStoreContext, DataStoreContext, UiStoreContext, VisualizationStoreContext } from 'store/stores';
import { parseDescription } from 'utils/helpers2';
import * as s from './styles';

const InfoItem = ({ label, value, labelStyle }) => (
  <div className={s.infoItem}>
    <span className={`${s.span} ${css(labelStyle)}`}>{label}</span>
    <span className={s.span}>{value}</span>
  </div>
);

const InfoPanel = observer(() => {
  const configStore = useContext(ConfigStoreContext);
  const dataStore = useContext(DataStoreContext);
  const uiStore = useContext(UiStoreContext);
  const visualizationStore = useContext(VisualizationStoreContext);
  const refEl = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (refEl && refEl.current) {
      uiStore.setInfoPanelWidth(refEl.current.offsetWidth);
    }
  });

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
          {itemLinkData
            && (
              <>
                <InfoItem label={dataStore.terminology.links} value={formatNumber(itemLinkData.nLinks)} labelStyle={dataStore.styles.description_heading} />
                {uiStore.componentWidth > 520
                  && (
                    <>
                      <InfoItem label={dataStore.terminology.total_link_strength} value={formatNumber(itemLinkData.totalLinkStrength)} labelStyle={dataStore.styles.description_heading} />
                    </>
                  )
                }
              </>
            )
          }
          {!_isUndefined(weightValue) && ((sizeLabel !== dataStore.terminology.total_link_strength && sizeLabel !== dataStore.terminology.links)
            || ((sizeLabel === dataStore.terminology.total_link_strength || sizeLabel === dataStore.terminology.links) && !itemLinkData))
            && (
              <InfoItem label={sizeLabel === 'weight' ? 'Custom' : sizeLabel} value={formatNumber(weightValue)} labelStyle={dataStore.styles.description_heading} />
            )
          }
          {uiStore.colorIndex === 0 && !_isNil(highlightedItem.cluster)
            && (
              <InfoItem
                label={dataStore.terminology.cluster}
                value={(
                  <div className={s.circle({ color: highlightedItem._clusterColor.formatHex() })} />
                )}
                labelStyle={dataStore.styles.description_heading}
              />
            )
          }
          {uiStore.colorIndex > 0
            && (
              <InfoItem label={scoreLabel === 'score' ? 'Custom' : scoreLabel} value={formatNumber(highlightedItem[visualizationStore.scoreKey])} labelStyle={dataStore.styles.description_heading} />
            )
          }
        </>
      )
      : (
        <>
          <InfoItem label={dataStore.terminology.link_strength} value={formatNumber(highlightedLink.strength)} labelStyle={dataStore.styles.description_heading} />
          {highlightedLink.url
            && (
              <Link target="_blank" href={highlightedLink.url}> URL </Link>
            )
          }
        </>
      )
    );
  };

  const getNetworkInfo = () => (
    <>
      <InfoItem label={dataStore.terminology.items} value={visualizationStore.items.length} labelStyle={dataStore.styles.description_heading} />
      {Boolean(visualizationStore.links.length)
        && (
          <>
            <InfoItem label={dataStore.terminology.links} value={formatNumber(visualizationStore.links.length)} labelStyle={dataStore.styles.description_heading} />
            {uiStore.componentWidth > 520
              && (
                <>
                  <InfoItem label={dataStore.terminology.total_link_strength} value={formatNumber(visualizationStore.totalLinkStrength)} labelStyle={dataStore.styles.description_heading} />
                </>
              )
            }
          </>
        )
      }
      {visualizationStore.clusters && uiStore.colorIndex === 0
        && (
          <InfoItem label={dataStore.terminology.clusters} value={visualizationStore.clusters.length} labelStyle={dataStore.styles.description_heading} />
        )
      }
    </>
  );

  const showInfoContent = () => configStore.uiConfig.information_panel;

  const showDescriptionContent = () => isOpen
      && configStore.uiConfig.description_panel
      && (
        (visualizationStore.hoveredItem && visualizationStore.hoveredItem.description)
        || (visualizationStore.clickedItem && visualizationStore.clickedItem.description && !visualizationStore.hoveredItem && !visualizationStore.hoveredLink)
        || (visualizationStore.hoveredLink && visualizationStore.hoveredLink.description)
        || (visualizationStore.clickedLink && visualizationStore.clickedLink.description && !visualizationStore.hoveredItem && !visualizationStore.hoveredLink)
        || ((visualizationStore.hoveredItem || visualizationStore.clickedItem) && dataStore.templates.item_description && !visualizationStore.hoveredLink)
        || ((visualizationStore.hoveredLink || visualizationStore.clickedLink) && dataStore.templates.link_description && !visualizationStore.hoveredItem)
      );

  const getItemDescription = (item) => parseDescription(item, 'item_description', { dataStore, visualizationStore });

  const getLinkDescription = (link) => parseDescription(link, 'link_description', { dataStore, visualizationStore });

  return (
    <>
      {(showInfoContent() || showDescriptionContent())
        && (
          <Paper className={`${s.infoPanel} ${uiStore.controlPanelIsOpen ? s.shifted : s.notshifted} ${visualizationStore.items.length ? s.visible : ''}`} ref={refEl} elevation={3}>
            {showDescriptionContent()
              && (
                <IconButton className={s.closeButton} onClick={exitInfoPanel}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )
            }
            {showDescriptionContent()
              && (
                <>
                  <Typography component="div" className={s.description}>
                    {getItemDescription(visualizationStore.hoveredItem)
                      || getLinkDescription(visualizationStore.hoveredLink)
                      || getItemDescription(visualizationStore.clickedItem)
                      || getLinkDescription(visualizationStore.clickedLink)}
                  </Typography>
                  {showInfoContent() && <hr />}
                </>
              )
            }
            {showInfoContent()
              && (
                <Typography component="div" className={s.infoBox}>
                  {visualizationStore.hoveredItem || visualizationStore.hoveredLink || visualizationStore.clickedItem || visualizationStore.clickedLink
                    ? getItemOrLinkInfo()
                    : getNetworkInfo()}
                </Typography>
              )
            }
          </Paper>
        )}
    </>
  );
});

export default InfoPanel;
