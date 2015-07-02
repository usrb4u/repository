app.controller('profileCtrl',function($scope,$http){
$scope.profile={};
$scope.footerStatus='';

$scope.getGroup = function(){
	$http.get('/profile/category').success(function(response){
		$scope.groupList = response;
		$scope.getProfile();
	})
}

$scope.update = function(){
	$http.put('/profile',$scope.profile)
	.success(function(response){
		$scope.footerStatus = "Updated Successfully";
		$scope.profile = response;
	})
}

$scope.getProfile = function(){
	$http.get('/profile/getRecord').success(function(response){
		
		$scope.profile = response;
		$scope.footerStatus='Retrieved Record Successfully';
		
	});
}
$scope.getGroup();
});
