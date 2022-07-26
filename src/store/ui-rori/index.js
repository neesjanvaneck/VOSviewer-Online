import { makeAutoObservable } from 'mobx';
import _isUndefined from 'lodash/isUndefined';

export default class State {
  constructor(state = {}) {
    makeAutoObservable(this, state);
  }

  legendSettingsPanelIsOpen = false

  legendSettingsPanelType = 'color'

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
