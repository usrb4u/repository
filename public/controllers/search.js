var app = angular.module('searchApp',['angularFileUpload']);

app.directive('textValueCopy', function($parse) {
        return function(scope, element, attrs) {
            if (attrs.ngModel) {

                if (element[0].type == "radio") {
                    if (element[0].checked == true) {
                        $parse(attrs.ngModel).assign(scope, element.val());
                    }
                } else {
                    $parse(attrs.ngModel).assign(scope, element.val());
                }
            }
        };
    });

app.controller('searchCtrl', function($scope, $http){
	$scope.search={};
	$scope.teams=[];
	$scope.groups=[];
	$scope.gNames=[];
	var teamss=[];
	 
	$scope.folders=[];
	var folderLength=0;

	$scope.getGroups = function(){
	 	$http.get('/profile/groups').success(function(response){
	 		$scope.groups=response;	
	 		});
 	}
 	$scope.getCategory = function(){
 		$http.get('/profile/category').success(function(response){
 			$scope.teams = response;
 			// console.log(response);
 		})
 	}
 	$scope.getTeam=function(team){
 		// alert(team);
 		// team.active = !team.active;
 		$http.get('/category/'+team)
 		.success(function(response){
 			$scope.teams = response;
 		});
 	}
	$scope.getDir = function(){
 	$http.get('/search/getDir').success(function(response){
 		$scope.folders = response;
 		$scope.folder=response;
 		folderLength = $scope.folders.length-1;
 		$scope.search.team=$scope.folders[folderLength];
 	});
 }
 $scope.getCategory();
 $scope.getGroups();
 $scope.getDir();
 // $scope.getTeam();
 $scope.find = function () {
 	window.location.href= '/search/'+$scope.search.info+'/'+$scope.search.team;
 }
});