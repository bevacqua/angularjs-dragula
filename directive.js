'use strict';

var dragula = require('dragula');

/*jshint unused: false*/
function register (angular) {
  return ['dragulaService', function angularDragula (dragulaService) {
    return {
      restrict: 'A',
      scope: {
        dragulaScope: '='
      },
      link: link
    };

    function link (scope, elem, attrs) {
      var dragulaScope = scope.dragulaScope || scope.$parent;
      var container = elem[0];
      var name = scope.$eval(attrs.dragula);
      var bag = dragulaService.find(dragulaScope, name);
      if (bag) {
        bag.drake.containers.push(container); return;
      }
      var drake = dragula({
        containers: [container]
      });
      dragulaService.add(dragulaScope, name, drake);
    }
  }];
}

module.exports = register;
