
app.controller('categoryCtrl', function($scope, $http){
    console.log('Testing the App');
    $scope.category = {};
    $scope.categoryNames='';
    $scope.category.groupName='ABSuite';
    $scope.button = 'Add'
    $scope.footerStatus='';
    
    $scope.add = function () {
        var mess = $scope.category.name.split('-')
        if(mess.length > 1) {
          $scope.category.groupName = mess[0];
          $scope.category.name = mess[1];
        }
        if($scope.button=='Update') {
          $http.put('/category',$scope.category)
          .success(function(response){
            $scope.footerStatus='Updated Successfully';
          })
        }
        else {
          $http.post('/category',$scope.category)
          .success(function(response){
           console.log(response);
           window.location.href='/profile';
        });   
        }
        
	}
  
    $scope.searchName = function (){
      $http.get('/category/getTeamName/'+$scope.category.name)
      .success(function(response){
        if(response!='') {
          $scope.category = response;
          $scope.button='Update'
          $scope.footerStatus='Record found and Retrieved';
        }
        else {
          $scope.category.description='';
          $scope.category.email='';
          $scope.button='Add';
        }
          
          
      })
    }
    $scope.teamNames = function() {
      	$http.get('/category/getAll')
       	.success(function(response){
       		$scope.categoryNames = response;
          console.log(response);
       	});
    }
    $scope.teamNames();
        
	
});