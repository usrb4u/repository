angular.module('searchApp',[]).controller('prodCtrl', function($scope, $http){
	console.log('Testing the App');
	$scope.footerStatus=" ";
	var vendRecords;
	var count=0;
	$scope.add = function(){
		console.log($scope.prodObj);
		$http.post('/product',$scope.prodObj).success(function(response){
			console.log(response)
			$scope.all();
			$scope.prodObj = '';
			$scope.footerStatus="Added Successfully";
		});
	}

	$scope.all = function() {
		$http.get('/product/all').success(function(response){
			vendRecords = response;
		});
	}
	$scope.all();
	$scope.next = function() {
		if(count < vendRecords.length) {
			count=count+1;
			$scope.prodObj = vendRecords[count-1];
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
			$scope.prodObj = vendRecords[count];
		}
		else {
			$scope.footerStatus = "No Records found";
		}			
	}
	$scope.first = function(){
		if(vendRecords.length !=0) {
			$scope.prodObj = vendRecords[0];
			count=1;
			$scope.footerStatus = ""
		}
		else
			$scope.footerStatus = "No Records found";
	}

	$scope.last = function(){
		//console.log("Length:"+vendRecords[length-1]);
		if(vendRecords.length !=0) {
			$scope.prodObj = vendRecords[vendRecords.length-1];
			count = vendRecords.length;
			$scope.footerStatus = ""
		}
		else
			$scope.footerStatus = "No Records found";
	}


	$scope.enq = function() {
		var id = $scope.prodObj.no;
		console.log("vendNO: "+id);
		
		$http.get('/product/'+id)
		.success(function(response){
			$scope.prodObj = response;
			$scope.footerStatus="Retrieved Successfully";
		});
	}

	$scope.del = function() {
		var id = $scope.prodObj._id;
		console.log("remove: "+id);
		$http.delete("/product/"+id)
		.success(function(response){
			console.log(response);
			$scope.prodObj="";
			$scope.footerStatus="Deleted Successfully";
			$scope.all();
		});
	}
	$scope.update = function () {
		$http.put('/product',$scope.prodObj)
		.success(function(response){
			console.log(response);
			$scope.prodObj='';	
			$scope.footerStatus="Updated record Successfully";
			$scope.all();
		});
	}
	
});
