var HT = angular.module('HT.controllers', ['ionic']);
HT.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
HT.directive('onFinishRenderFilters',function($timeout){
  return {
    restrict: 'A',
    link : function(scope,element,attr){
      if(scope.$last === true){
        $timeout(function(){
          scope.$emit('ngRepeatFinished')
        })
      }
    }
  }
})









