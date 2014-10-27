angular.module('app.filters',[])
	.filter("htmlTrust",["$sce",function($sce){
        return function(stringHtml){
            return $sce.trustAsHtml(stringHtml);
        };
    }]);