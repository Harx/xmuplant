'use strict';

// Declare app level module which depends on views, and components
var app=angular.module('app', [
  'ngRoute',
  'app.controllers'
]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
        .when('/home',{
            templateUrl:'partials/home.html',
            controller:'homeCtrl'
        })
		.when('/map',{
			templateUrl:'partials/map.html',
			controller:"mapCtrl"
		})
        .when('/category/:id',{
            templateUrl:'partials/category.html',
            controller:"categoryCtrl"
        })
        .when('/topic/list/:page',{
            templateUrl:'partials/topicList.html',
            controller:"topicListCtrl"
        })
        //TODO not clear if /details will conflict with /:page ,wait practice
        .when('/topic/details/:id',{
            templateUrl:"partials/topicDetails.html",
            controller:'topicDetailsCtrl'
        })
        .when('/knowledge/list/:page',{
            templateUrl:'partials/knowledgeList.html',
            controller:"knowledgeListCtrl"
        })
        .when('/knowledge/details/:id',{
            templateUrl:'partials/knowledgeDetails.html',
            controller:'knowledgeDetailsCtrl'
        })
        .when('/about/:id',{
            templateUrl:'partials/about.html',
            controller:"aboutCtrl"
        })
        .when('/search',{
            templateUrl:'partials/search.html',
            controller:"searchCtrl"
        })
        .when('/messages',{
            templateUrl:'partials/messages.html',
            controller:"messagesCtrl"
        })
        .when('/speciesDetails/:id',{
            templateUrl:'partials/speciesDetails.html',
            controller:'speciesDetailsCtrl'
        })

  		.otherwise({
  			redirectTo: '/home'
  		})
  	;
}]);
