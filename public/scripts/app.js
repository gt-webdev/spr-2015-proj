angular.module('GeorgesResume', ['tkw'])
.service('Database', [
  '$http',
  function($http){
      this.getData = function() {
          return $http.get('/api/');
      }
      this.getSection = function(section) {
        return $http.get('/api/' + section);
      }   
      this.createSubsection = function(section, data) {
        return $http.post('/api/' + section, data);
      }
      this.updateSubsection = function(section, id, data) {
        return $http.put('/api/' + section + '/' + id, data);
      }
      this.deleteSubsection = function(section, id) {
         return $http.delete('/api/' + section + '/' + id);
      }
  }])
.controller('MainController', [
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
    $scope.updateSubsection = function(section, subsection){
      Database.updateSubsection(section, subsection._id, subsection)
    }
  }])
.filter('sanitize',['$sce', function($sce) {
    return function(htmlcode) {
      return $sce.trustAsHtml(htmlcode);
    }
}]);