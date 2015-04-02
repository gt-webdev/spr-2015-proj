/*
  Angular app for George's Resume 
*/
angular.module('GeorgesResume', ['tkw']);


/*
  Databse Service for retriving data from the api
*/
angular.module('GeorgesResume').service('Database', [
  '$http',
  function($http){
      this.getData = function() {
          return $http.get('/api/');
      }
      this.getSection = function(section) {
        return $http.get('/api/' + section);
      }   
      this.updateProfile = function(data) {
        return $http.put('/api/Profile', data);
      }
      this.updateSubsection = function(section, id, data) {
        return $http.put('/api/' + section + '/' + id, data);
      }
      this.deleteSubsection = function(section, id) {
         return $http.delete('/api/' + section + '/' + id);
      }
  }]);

/*
  Controller for the main page. Handles passing data from the databse to the
  scope.
*/
angular.module('GeorgesResume').controller('MainController', [
  '$scope',
  'Database',
  function($scope, Database) {
    Database.getData().then(function(response){
      $scope.education = response.data['Education'];
      $scope.profile = response.data['Profile'];
      $scope.skills = response.data['Skills'];
      $scope.experience = response.data['Experience'];
      $scope.projects = response.data['Projects'];
      $scope.leadership = response.data['Leadership'];
      $scope.honors = response.data['Honors'];
    });
    $scope.updateSubsection = function(section, data){
	if (section === 'Profile') {
		Database.updateProfile(data)
	}
	else {
		Database.updateSubsection(section, data._id, data)
	}
    }
  }]);


/*
  Sanitizes strings to be treated as embedded html
*/
angular.module('GeorgesResume').filter('sanitize',['$sce', function($sce) {
    return function(htmlcode) {
      return $sce.trustAsHtml(htmlcode);
    }
}]);
