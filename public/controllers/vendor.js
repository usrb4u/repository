angular.module('searchApp',[]).controller('vendControl', function($scope, $http){
	console.log('Testing the App');
	$scope.message="Hello from Controller";
	$scope.footerStatus=" ";
	var vendRecords;
	var count=0;
	$scope.add = function(){
		console.log($scope.vendObj);
		$http.post('/vendor',$scope.vendObj).success(function(response){
			console.log(response)
			$scope.all();
			$scope.vendObj = '';
			$scope.footerStatus="Added Successfully";
		});
	}

	$scope.all = function() {
		$http.get('/vendor/all').success(function(response){
			vendRecords = response;
		});
	}
	$scope.all();
	$scope.next = function() {
		if(count < vendRecords.length) {
			count=count+1;
			$scope.vendObj = vendRecords[count-1];
			$scope.footerStatus = ""
		}
		else {
			$scope.footerStatus = "No Records found";
		}			
	}

	$scope.previous = function() {
		if(count > 0) {
			$scope.footerStatus = ""
			count = count -1;
			$scope.vendObj = vendRecords[count];
		}
		else {
			$scope.footerStatus = "No Records found";
		}			
	}
	$scope.first = function(){
		if(vendRecords.length !=0) {
			$scope.vendObj = vendRecords[0];
			count=1;
			$scope.footerStatus = ""
		}
		else
			$scope.footerStatus = "No Records found";
	}

	$scope.last = function(){
		//console.log("Length:"+vendRecords[length-1]);
		if(vendRecords.length !=0) {
			$scope.vendObj = vendRecords[vendRecords.length-1];
			count = vendRecords.length;
			$scope.footerStatus = ""
		}
		else
			$scope.footerStatus = "No Records found";
	}


	$scope.enq = function() {
		var id = $scope.vendObj.no;
		console.log("vendNO: "+id);
		
		$http.get('/vendor/'+id)
		.success(function(response){
			$scope.vendObj = response;
			$scope.footerStatus="Retrieved Successfully";
		});
	}

	$scope.del = function() {
		var id = $scope.vendObj._id;
		console.log("remove: "+id);
		$http.delete("/vendor/"+id)
		.success(function(response){
			console.log(response);
			$scope.vendObj="";
			$scope.footerStatus="Deleted Successfully";
			$scope.all();
		});
	}
	$scope.update = function () {
		$http.put('/vendor',$scope.vendObj)
		.success(function(response){
			console.log(response);
			$scope.vendObj='';	
			$scope.footerStatus="Updated record Successfully";
			$scope.all();
		});
	}
	
});
