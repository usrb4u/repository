app.controller('uploadCtrl',['$scope', '$http', '$upload',function($scope,$http,$upload){
  // alert('control method');
  $scope.teams=[];
  $scope.uploadObj={};
  // $scope.uploadObj.fileName='';
  $scope.saveFile=true;
  $scope.uploadObj.videoId=''
  $scope.getProfile = function() {
        $http.get('profile/person')
        .success(function(response){

            if(response.team!='')
                $scope.uploadObj.team = response.team;
            else
                $scope.uploadObj.team = 'ABSuite';
            $scope.person= response;              
        })
    }
  $scope.getTeam =function(){
        $http.get('profile/category')
        .success(function(response){
            // alert(response);
            response.push({name:'ABSuite'});
            $scope.teams = response;
            $scope.getProfile();
        });
    }

    $scope.getTeam();
    $scope.save = function() {
      if($scope.uploadProgress == 'Done' && $scope.uploadObj.videoId!='') {
        // alert('Selected file'+$scope.uploadObj.fileName);
        $http.post('upload/add',$scope.uploadObj)
        .success(function(response){
          $scope.saveFile=true;
          console.log(response);
          $scope.uploadObj='';
          alert('Uploaded Successfully');
        });
      }
      else
        alert('No File selected to Save / Upload in Progress');
    }

window.onbeforeunload = function (event) {
  if($scope.uploadObj.videoId=='') {
    var message = 'Do you want to Delete uploaded Video?';
    if (typeof event == 'undefined') {
      event = window.event;
    }
    if (!event) {
      event.returnValue = message;
      console.log('hello')
    }
    else 
      // $http.delete('postissue/image/'+$scope.uploadObj.videoId)
      // .success(function(response){
      //   alert('Deleted Successfully');
      // })

    return message;
  }
}

  $scope.onFileSelect = function(video) {
    // console.log(image[0].name);
    // $scope.uploadObj.fileName=image[0].name;
  $scope.uploadInProgress = true;
  $scope.uploadProgress = 0;

  if (angular.isArray(video)) {
    video = video[0];
  }
  
  $scope.upload = $upload.upload({
    url: '/upload/video',
    method: 'POST',
    data: {
      type: video.type
    },
    file: video
  }).progress(function(event) {
    $scope.uploadProgress = "In Progress";
    // $scope.$apply();
  }).success(function(response,data, status, headers, config) {
    $scope.saveFile=false;
    $scope.uploadObj.videoId= response;
    $scope.uploadProgress = 'Done'
  }).error(function(err) {
    $scope.uploadInProgress = false;
    alert('Error uploading file: ' + err.message || err);
  });
};

}]);


