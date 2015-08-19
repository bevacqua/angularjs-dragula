'use strict';

var dragula = require('dragula');
var dragulaKey = '$$dragula';
var replicateEvents = require('./replicate-events');

function register (angular) {
  return [function dragulaService () {
    return {
      add: add,
      find: find,
      options: setOptions,
      destroy: destroy
    };
    function getOrCreateCtx (scope) {
      var ctx = scope[dragulaKey];
      if (!ctx) {
        ctx = scope[dragulaKey] = {
          bags: []
        };
      }
      return ctx;
    }
    function domIndexOf(child, parent) {
      return Array.prototype.indexOf.call(angular.element(parent).children(), child);
    }
    function add (scope, name, drake) {
      var bag = find(scope, name);
      if (bag) {
        throw new Error('Bag named: "' + name + '" already exists in same angular scope.');
      }
      var ctx = getOrCreateCtx(scope);
      bag = {
        name: name,
        drake: drake
      };
      ctx.bags.push(bag);
      replicateEvents(angular, bag, scope);
      if(drake.models){ // models to sync with (must have same structure as containers)
        var dragElm;
        var dragIndex;
        var dropIndex;
        drake.on('remove',function removeModel () {
          console.log('removeModel', arguments);
        });
        drake.on('drag',function dragModel (el, source) {
          dragElm = el;
          dragIndex = domIndexOf(el, source);
        });
        drake.on('drop',function dropModel (dropElm, target, source) {
          dropIndex = domIndexOf(dropElm, target);
          scope.$applyAsync(function applyDrop() {
            var sourceModel = drake.models[drake.containers.indexOf(source)];
            if (target === source) {
              sourceModel.splice(dropIndex, 0, sourceModel.splice(dragIndex, 1)[0]);
            } else {
              var notCopy = dragElm === dropElm;
              var targetModel = drake.models[drake.containers.indexOf(target)];
              var dropElmModel = notCopy ? sourceModel[dragIndex] : angular.copy(sourceModel[dragIndex]);
              
              if (notCopy) {
                sourceModel.splice(dragIndex, 1);
              }
              targetModel.splice(dropIndex, 0, dropElmModel);
              target.removeChild(dropElm); // element must be removed for ngRepeat to apply correctly
            }
          });
        });
      }
      return bag;
    }
    function find (scope, name) {
      var bags = getOrCreateCtx(scope).bags;
      for (var i = 0; i < bags.length; i++) {
        if (bags[i].name === name) {
          return bags[i];
        }
      }
    }
    function destroy (scope, name) {
      var bags = getOrCreateCtx(scope).bags;
      var bag = find(scope, name);
      var i = bags.indexOf(bag);
      bags.splice(i, 1);
      bag.drake.destroy();
    }
    function setOptions (scope, name, options) {
      add(scope, name, dragula(options));
    }
  }];
}

module.exports = register;
