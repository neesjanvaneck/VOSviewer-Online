import _isPlainObject from 'lodash/isPlainObject';
import _merge from 'lodash/merge';

export default class State {
  constructor() {
    this.parameters = {};
  }

  init(parameters) {
    if (_isPlainObject(parameters)) this.parameters = _merge(this.parameters, parameters);
  }
}
