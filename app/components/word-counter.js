import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  worker: service(),

  init() {
    this._super(...arguments);
    this.initProperties();
  },

  willDestroyElement() {
    this.get('worker').terminate();
    this._super(...arguments);
  },

  initProperties() {
    this.setProperties({
      'wordArray': [],
      'wordCountText': '',
      'error': null,
      'isRunning': false
    });
  },

  setError(header, message) {
    this.set('error', {
      header: header,
      message: message
    });
  },

  isValid() {
    let wcText = this.get('wordCountText');

    if (isEmpty(wcText)) {
      this.setError('Empty text field', 'You have to insert a text before counting');
      return false;
    }

    return true;
  },

  actions: {
    countWords() {
      this.set('error', null);

      if (!this.isValid()) {
        return;
      }

      let wcText = this.get('wordCountText');

      this.set('isRunning', true);
      this.get('worker').postMessage('word-count-worker', { text: wcText }).then((response) => {
        this.set('wordArray', JSON.parse(response));
      }, (error) => {
        // error contains the message thrown by the worker.
        this.setError('Unexpected error', error);
      });
      this.set('isRunning', false);
    },

    clearWordCounter() {
      this.initProperties();
    }
  }
});
