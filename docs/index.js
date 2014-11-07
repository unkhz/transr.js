/*global angular*/
'use strict';

// Require the almost-static-site main module
var mainModule = require('../node_modules/almost-static-site/main');

// Define the Demo App
var app = window.app = angular.module('docs', [
  'assMain'
]);

// Here you can define app specific angular extensions to the almost-static-site main module

module.exports = app;