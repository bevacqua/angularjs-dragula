'use strict';

var dragula = require('dragula');

/*jshint unused: false*/
function register (angular) {
  return ['dragulaService', function angularDragula (dragulaService) {
    return {
      restrict: 'A',
      scope: {
        dragulaScope: '=',
        dragulaModel: '='
      },
      link: link
    };

    function link (scope, elem, attrs) {
      var dragulaScope = scope.dragulaScope || scope.$parent;
      var container = elem[0];
      var name = scope.$eval(attrs.dragula);

      var bag = dragulaService.find(dragulaScope, name);
      if (bag) {
        var drake = bag.drake;
        drake.containers.push(container);
      } else {
        var drake = dragula({
          containers: [container]
        });
        dragulaService.add(dragulaScope, name, drake);
      }

      scope.$watch('dragulaModel', function(model) {
        if(model){
          if(drake.models){
            drake.models.push(model);
          }else{
            drake.models = [model];
          }
        }
      });
    }
  }];
}

module.exports = register;
