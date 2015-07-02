angular.module('testApp',[]).controller('ServicesCtrl', function($scope, $http){
	console.log('Testing the App');
	$scope.message="Hello from Controller";

	$scope.create = function(){
		if(form.no.$valid)
			alert('pass '+form.$valid);
		else
			alert('fail '+form.$invalid);
		console.log($scope.serviceClient);
		$http.post('/serviceClients',$scope.serviceClient)
		.success(function(response){$scope.all()});
		$scope.serviceClient = '';
	}
	var renderServiceClients = function(response) {
		$scope.serviceClients = response;
	}
	$scope.all = function(){
	$http.get("/serviceClients").success(renderServiceClients);
	}
	$scope.all();

	$scope.remove = function(id) {
		console.log("remove: "+id);
		$http.delete("/serviceClients/"+id)
		.success(function(response){$scope.all()});
	}
	$scope.edit = function () {
		$http.post('/serviceClient',$scope.serviceClient)
		.success(function(response){
			$scope.all();
			$scope.serviceClient='';	
		});
	}
	$scope.inq = function(id) {
		$http.get('/serviceClients/'+id)
		.success(function(response){
			$scope.serviceClient = response;
		});
	}
});
