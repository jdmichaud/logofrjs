define(function() {
  'use strict';

  var fileRetrievalService = function fileRetrievalService() {
    var httpGetAsync = function (url, callback, waitcb, errorcb) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          callback(xmlHttp.responseText);
        } else if (xmlHttp.status === 200 || xmlHttp.status === 0) { // No particular error, just busy...
          waitcb();
        } else {
          errorcb(xmlHttp.status);
        }
      };
      xmlHttp.open('GET', url, true); // true for asynchronous
      xmlHttp.send(null);
    };

    return {
      retrieve: function (url) {
        var promise = new Promise(function(resolve, reject) {
          httpGetAsync(url, function (fileContent) {
            console.log('Ready to parse');
            resolve(fileContent);
          }, function () {
            console.log('Grammar loading...');
          }, function (httpStatus) {
            console.log('Could not load the logo grammar file, status: ',
                        httpStatus);
            reject(httpStatus);
          });
        });
        return promise;
      }
    };
  };

  return fileRetrievalService;
});

