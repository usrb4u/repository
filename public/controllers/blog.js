// var app = angular.module('searchApp',[]);

app.controller('blogControl', function($scope, $http,$document){	
	// $scope.message="Hello from controller";
        $scope.teams=[];
        $scope.srepObj={};
	 $scope.save = function () {
		
		$scope.srepObj.txtMsg ='<h2>'+$scope.srepObj.title+'</h2>'+tinyMCE.activeEditor.getContent();
		if($scope.srepObj.team==undefined)
            $scope.srepObj.team='';
		alert($scope.srepObj.team);
		$http.post('/blog',$scope.srepObj)
		.success(function(response){
			console.log(response);
			window.location.href=response;
			
		})
		.error(function(data){
			alert(data);
		})
	}
    $scope.getProfile = function() {
        $http.get('profile/person')
        .success(function(response){
            if(response.team!='')
                $scope.srepObj.team = response.team;
            else
                $scope.srepObj.team = 'ABSuite';
        })
    }
    $scope.getTeam =function(){
        $http.get('profile/category')
        .success(function(response){
            response.push({name:'ABSuite'});
            $scope.teams = response;
             $scope.getProfile();
        });
    }
    $scope.getTeam();
});

function MainCtrl($scope) {
    $scope.count = 0;
}

app.directive('ngEnter',function(){
		return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
});

app.directive("addcomment", function(){
    return {
        restrict: "E",
        template: "<textarea ng-model='comm.feedback' class='form-control' ng-keypress='($event.which === 13 && !$event.shiftKey)?postComment():0'> </textarea>"
    }
});


app.controller('commentCtrl', function($scope, $compile,$http) {
	$scope.postComment = function(){
        $scope.comm.url = window.location.href.toString().split(window.location.host)[1];
        // angular.element(document.getElementById('space-for-comment')).append(("<hr><label>"+$scope.username +"</label>+<br><h5>"+$scope.comm.feedback+"</h5>"));
       // angular.element(document.getElementById('space-for-comment')).append($compile("<div><label>+"$scope.username"+</label>+h5"$scope.myTextArea"+</h5></div>");
		// alert($scope.comm.feedback);
	   $http.post('/blog/addComment',$scope.comm)
        .success(function(response){            
            window.location.href=response;
        })
        .error(function(data){
            alert(data);
        });	
    }
});