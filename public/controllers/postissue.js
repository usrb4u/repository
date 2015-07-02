//var app = angular.module('searchApp',[]);

app.controller('postIssueCtrl', function($scope, $http,$upload){
    // console.log('Testing the App');
    $scope.teams = [];
    $scope.postObj={};
    $scope.postObj.notification=false;
    $scope.person={};
    $scope.notify=false;
    $scope.attachments=[]
     $scope.save = function () {
        if($scope.postObj.team=='ABSuite'&&$scope.postObj.notification)
            alert("ABSuite Group Can't be notified");
        $scope.postObj.txtMsg = '<h2>'+$scope.postObj.title+'</h2>'+tinyMCE.activeEditor.getContent();
        if($scope.postObj.team==undefined)
            $scope.postObj.team='';  
        $scope.postObj.attachments = $scope.attachments;
        alert($scope.postObj.attachments.length);
        $http.post('/postissue',$scope.postObj)
        .success(function(response){
            if($scope.postObj.notification) {
                $scope.postObj.txtMsg=$scope.postObj.txtMsg+'<hr><p>Answer can be posted through <a href='+response+'>this URL</a>'
                $scope.sendMessage(); 
            }
                
            window.location.href=response;
        })
        .error(function(data){
            alert(data);
        });

    }

    $scope.sendMessage= function(){
        $scope.postObj.email = $scope.person.emailId;
        $http.post('/postissue/send',$scope.postObj)
            .success(function(response){
                alert('Message Delivered successfully')
        });
    }
// $scope.sendMessage();
    $scope.getProfile = function() {
        $http.get('profile/person')
        .success(function(response){

            if(response.team!='')
                $scope.postObj.team = response.team;
            else
                $scope.postObj.team = 'ABSuite';
            $scope.person= response;
            if($scope.person.emailId=='')
            {
                alert("Notify to Team option disabled until your profile updated");
                // $scope.notify =true;
            }
                
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
    $scope.remove = function(id){     
     $http.delete('/postissue/image/'+id).success(function(response){
        var lastItem = $scope.attachments.length-1;
        $scope.attachments.splice(lastItem);
     })

        
    }
    $scope.getTeam();
    $scope.comm={};
    $scope.postanswer = function(){
        $scope.comm.ansMsg=tinyMCE.activeEditor.getContent();
        $scope.comm.url = window.location.href.toString().split(window.location.host)[1];
        alert($scope.comm.queryId);
       $http.post('/postissue/answer',$scope.comm)
        .success(function(response){    
            // console.log(response);        
            window.location.href=response;
        })
        .error(function(data){
            alert(data);
        });
    }

$scope.onFileSelect = function(image) {
    $scope.postObj.fileName=image[0].name;
  $scope.uploadInProgress = true;
  $scope.uploadProgress = 0;
  
  if (angular.isArray(image)) {
    image = image[0];
    console.log(image);
  }
  // if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
  //      alert('Only PNG and JPEG are accepted.');
  //           return;
  //   }
  $scope.upload = $upload.upload({
    url: '/postissue/image',
    method: 'POST',
    data: {
      type: image.type
    },
    file: image
  }).progress(function(event) {
    $scope.uploadProgress = "In Progress";
    // $scope.$apply();
  }).success(function(response,data, status, headers, config) {
    $scope.uploadProgress = 'Done'
    $scope.postObj.fileName=''
    var newItemNo = $scope.attachments.length+1;
    $scope.attachments.push({'url':'http://inblr-uppalasr:3000/image/'+response+'/'+image.name, 'id':response })
  }).error(function(err) {
    $scope.uploadInProgress = false;
    alert('Error uploading file: ' + err.message || err);
  });
};


});