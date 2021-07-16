import { extendObservable } from 'mobx';
import _isUndefined from 'lodash/isUndefined';

export default class State {
  constructor(state = {}) {
    extendObservable(
      this,
      {
        legendSettingsPanelIsOpen: false,
        legendSettingsPanelType: 'color',
      },
      state
    );
  }

  setLegendSettingsPanelIsOpen(legendSettingsPanelIsOpen) {
    this.legendSettingsPanelIsOpen = !_isUndefined(legendSettingsPanelIsOpen) ? legendSettingsPanelIsOpen : !this.legendSettingsPanelIsOpen;
  }

  setLegendSettingsPanelType(legendSettingsPanelType) {
    if (this.legendSettingsPanelType === legendSettingsPanelType) {
      this.setLegendSettingsPanelIsOpen();
    } else {
      this.setLegendSettingsPanelIsOpen(true);
    }
    this.legendSettingsPanelType = legendSettingsPanelType;
  }
}
