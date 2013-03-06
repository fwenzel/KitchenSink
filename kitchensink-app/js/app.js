// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

define(function(require) {

  var $ = require('zepto');
  var apis = require('./apis');
  var log = require('logger');

  var testElement = $('#apis');

  for (id in apis) {
    var api = apis[id];
    var prepared = api.noPreparation;

    // add li
    var apiHTML = '<li id="' + id + '">' + api.name + '</span></li>';
    testElement.append(apiHTML);
    var apiElement = $('#' + id);

    if (api.isCertified) {
      apiElement.append('<span class="certified">[C]</span>');
      apiElement.addClass('certified');
    }

    // if there's a touch action - assign it to onclick event
    if (api.action) {
      apiElement.on('click', api.action)
                 .addClass('clickable');
    }

    // check if DOM is prepared
    if (!prepared && api.isPrepared) {
      prepared = api.isPrepared()
      apiElement.append('<span class="' + 
                        (prepared ? 'success' : 'fail') + '">' + 
                        (prepared ? '+' : '-') + '</span>');
      if (prepared) {
        apiElement.addClass('success');
      } else {
        if (api.tests) {
          log.error(api.name + ' is not prepared (tests not run)');
        }
        apiElement.addClass('fail');
      }
    } else if (!prepared) {
      // if should be prepared and failed
      apiElement.append('<span class="notest">?</span>');
      apiElement.addClass('notest');
      log.error('No test for ' + api.name);
    }

    // run tests only id DOM prepared or no need for the preparation
    if (prepared && api.tests) {
      api.tests.forEach(function(test) {
        test(function(result, inID, apiName, testName, message) {
          $('#' + inID).append('<span class="' + 
                             (result ? 'success' : 'fail') + '">' + 
                             (result ? '*' : 'F') + '</span>');
          $('#' + inID).addClass((result ? 'success' : 'fail')); 
          if (!result) {
            var response = '[FAIL] ' + apiName + '.' + testName;
            if (message) response += ': ' + message;
            log.info(response);
          }
        });
      });
    }
  }
});
