define(function() {
  'use strict';

  var instructionDescr = [
    { labels : ['AVANCE',       'AV'],  haveArgs : true },
    { labels : ['RECULE',       'RE'],  haveArgs : true },
    { labels : ['TOURNEDROITE', 'TD'],  haveArgs : true },
    { labels : ['TOURNEGAUCHE', 'TG'],  haveArgs : true },
    { labels : ['LEVECRAYON',   'LC'],  haveArgs : false },
    { labels : ['BAISSECRAYON', 'BC'],  haveArgs : false }
  ];

  return {
    // Return the instruction with label === keyword
    getMatchingInstruction: function (keyword) {
      var matching = instructionDescr.filter(function (instr) {
        return instr.labels.indexOf(keyword.toUpperCase()) !== -1;
      });
      if (matching.length === 0) {
        return undefined;
      }
      return matching[0];
    }
  };

});