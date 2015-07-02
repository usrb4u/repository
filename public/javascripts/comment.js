var app = angular.module('commentApp', []);

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


app.controller('myCtrl', function($scope, $compile,$http) {
	$scope.postComment = function(){
        $scope.comm.url = window.location.href.toString().split(window.location.host)[1];
        // angular.element(document.getElementById('space-for-comment')).append(("<hr><label>"+$scope.username +"</label>+<br><h5>"+$scope.comm.feedback+"</h5>"));
       // angular.element(document.getElementById('space-for-comment')).append($compile("<div><label>+"$scope.username"+</label>+h5"$scope.myTextArea"+</h5></div>");
		// alert($scope.comm.feedback);
	   $http.post('/blogs',$scope.comm)
        .success(function(response){            
            window.location.href=response;
        })
        .error(function(data){
            alert(data);
        });	
    }
});