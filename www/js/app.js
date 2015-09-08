
angular.module('fillup', ['ionic', 'fillup.controllers', 'fillup.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // statusbar white
      StatusBar.styleLightContent();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state("intro",{
    	url: "/intro",
    	templateUrl: "templates/intro.html",
    	controller: "IntroCtrl"
    })
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('stadt', {
      url: '/stadt',
          templateUrl: 'templates/tab-stadt.html',
          controller: 'StadtCtrl'
    })
    .state('tab.gutscheine', {
      url: '/gutscheine/:city/',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-gutscheine.html',
          controller: 'GutscheineCtrl'
        }
      }
    })
    .state('tab.gutschein-detail', {
      url: '/gutscheinDetail/:city/:friendId/:title',
      views: {
        'tab-friends': {
          templateUrl: 'templates/gutschein-detail.html',
          controller: 'GutscheinDetailCtrl'
        }
      }
    })
    .state('tab.abgelaufen', {
      url: '/abgelaufen',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-abgelaufen.html',
          controller: 'AbgelaufenCtrl'
        }
      }
    })
    .state('tab.einstellungen', {
      url: '/einstellungen',
      views: {
        'tab-einstellungen': {
          templateUrl: 'templates/tab-einstellungen.html',
          controller: 'EinstellungenCtrl'
        }
      }
    })
    .state('tab.uber', {
      url: '/einstellungen/uber',
      views: {
        'tab-einstellungen': {
          templateUrl: 'templates/uber.html',
          controller: 'UberCtrl'
        }
      }
    })
  // callback when no other state matches
  $urlRouterProvider.otherwise('/intro');
});
