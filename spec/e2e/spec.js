describe('logofrjs App', function() {
  'use strict';
  it('should have a title', function() {
    browser.get('http://localhost:9042/');

    expect(browser.getTitle()).toEqual('logofrjs');
  });
});

