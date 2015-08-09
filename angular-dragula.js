'use strict';

var dragula = require('dragula');
var dragulaService = require('./service');
var replicateEvents = require('./replicate-events');

function register (angular) {
  var app = angular.module('dragula', ['ng']);

  app.factory('dragulaService', dragulaService);
  app.directive('dragula', ['dragulaService', angularDragula]);

  return 'dragula';

  function angularDragula (dragulaService) {
    return {
      restrict: 'A',
      link: link
    };

    function link (scope, elem, attrs) {
      var container = elem[0];
      var name = scope.$eval(attrs.dragula);
      var bag = dragulaService.find(scope, name);
      if (bag) {
        bag.drake.containers.push(container); return;
      }
      var drake = dragula({
        containers: [container]
      });
      bag = dragulaService.add(scope, name, drake, angular);
    }
  }
}

module.exports = register;
