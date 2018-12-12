"use strict";

function Word(label) {
  this.label = label;
  this.count = 1;

  this.increase = function() {
    this.count++;
  };
}

function preprocessText(text) {
  return text.trim().split(/\s+/);
}

function countWords(text) {
  let wordArray = [];

  preprocessText(text).forEach((label) => {
    let foundWord = wordArray.find((word) => {
      return word.label === label;
    });

    if (foundWord === undefined) {
      wordArray.push(new Word(label));
    }
    else {
      foundWord.increase();
    }
  });

  return wordArray;
}

self.addEventListener('message', (event) => {
  let data = event.data;
  var port = event.ports[0];
  let wordArray = countWords(data.text);

  if (port) {
    // Message sended throught a worker created with 'open' method.
    port.postMessage(JSON.stringify(wordArray));
  } else {
    // Message sended throught a worker created with 'send' or 'on' method.
    postMessage(JSON.stringify(wordArray));
  }
}, false);

// Ping the Ember service to say that everything is ok.
postMessage(true);
