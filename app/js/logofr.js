// Jean-Daniel Michaud - 2015
//
// Main entry point for logofrjs in the Browser

require(['./parser'], function(parser) {
  'use strict';

  var httpGetAsync = function (theUrl, callback, errorcb) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        callback(xmlHttp.responseText);
      } else {
        errorcb(xmlHttp.status);
      }
    };
    xmlHttp.open('GET', theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  };

  httpGetAsync('/logo.peg', function () {
    console.log('Ready to parse');
    angular.module('turtleApp').factory('MirobotService', parser);
  }, function () {
    console.log('Could not load the logo grammar file');
    alert('Un probleme est survenu lors du chargement de la page');
  });

});
