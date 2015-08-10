'use strict';

var dragula = require('dragula');
var dragulaService = require('./service');
var dragulaDirective = require('./directive');

function register (angular) {
  var app = angular.module('dragula', ['ng']);

  app.factory('dragulaService', dragulaService(angular));
  app.directive('dragula', ['dragulaService', dragulaDirective(angular)]);

  return 'dragula';
}

module.exports = register;
