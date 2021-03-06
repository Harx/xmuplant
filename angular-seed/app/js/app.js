'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('app', [
    'ngRoute',
    'app.controllers',
    'app.filters'
]);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/map'
            })
            .when('/home', {
                templateUrl: 'partials/home.html',
                controller: 'homeCtrl'
            })
            .when('/map', {
                templateUrl: 'partials/map.html',
                controller: "mapCtrl"
            })
            .when('/system/:dId/:fId/:gId', {
                templateUrl: 'partials/system.html',
                controller: "systemCtrl"
            })
            .when('/topic/list/:page', {
                templateUrl: 'partials/topicList.html',
                controller: "topicListCtrl"
            })
            .when('/topic/details/:id', {
                templateUrl: "partials/topicDetails.html",
                controller: 'topicDetailsCtrl'
            })
            .when('/catalog/:page', {
                templateUrl: "partials/catalog.html",
                controller: 'catalogCtrl'
            })
            .when('/knowledge/list/:catid/:page', {
                templateUrl: 'partials/knowledgeList.html',
                controller: "knowledgeListCtrl"
            })
            .when('/knowledge/details/:id', {
                templateUrl: 'partials/knowledgeDetails.html',
                controller: 'knowledgeDetailsCtrl'
            })
            .when('/about/:id', {
                templateUrl: 'partials/about.html',
                controller: "aboutCtrl"
            })
            .when('/search/:keyword', {
                templateUrl: 'partials/search.html',
                controller: "searchCtrl"
            })
            .when('/messages', {
                templateUrl: 'partials/messages.html',
                controller: "messagesCtrl"
            })
            .when('/species/details/:id', {
                templateUrl: 'partials/speciesDetails.html',
                controller: 'speciesDetailsCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });

        //    $locationProvider.html5Mode(true);

}]);