// Jean-Daniel Michaud - 2015
//
// Main entry point for logofrjs in the Browser

require(['./parser'], function(parser) {
  'use strict';

  parser.parse('test');
  console.log('Nothing for now');
});
