angular.module('fillup.services', [])

// SERVICE - Returned alle Gutscheine und Detailinformationen zum Gutschein
//
.factory('Friends', function($http, $ionicLoading, $ionicPopup) {

    return {

        async: function(city) {
            // $http returns a promise, which has a then function, which also returns a promise
            promise = $http({
                url: "http://dev.tellthedj.de/db/getGutscheine.php",
                method: "POST",
                cache: true,
                data: {"city":city}
            }).error(function(data, status, headers, config){
              setTimeout(function() {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Fehler',
                  template: '<div style="text-align:center">Bitte überprüfe Deine <br>Internet-Verbindung</div>',
                  okType: "button-calm"
                });
                alertPopup.then(function(res) {
                });

              }, 2000);

            }).success(function(data, status, headers, config){
            }).then(function(response) {
                // The then function here is an opportunity to modify the response
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        },

        asyncDone: function(city) {
            // $http returns a promise, which has a then function, which also returns a promise
            promise = $http({
                url: "http://dev.tellthedj.de/db/getDoneGutscheine.php",
                method: "POST",
                cache: true,
                data: {"city":city}
            }).error(function(data, status, headers, config){
              setTimeout(function() {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Fehler',
                  template: '<div style="text-align:center">Bitte überprüfe Deine <br>Internet-Verbindung</div>',
                  okType: "button-calm"
                });
                alertPopup.then(function(res) {
                });

              }, 2000);

            }).success(function(data, status, headers, config){
            }).then(function(response) {
              // The then function here is an opportunity to modify the response
              // The return value gets picked up by the then in the controller.
              return response.data;
            });
            // Return the promise to the controller
            return promise;
        },

        getDetail: function(friendId) {
            // $http returns a promise, which has a then function, which also returns a promise
            promise2 = $http({
                url: "http://dev.tellthedj.de/db/getGutschein.php",
                method: "POST",
                data: {"gutscheinId":friendId}
            }).error(function(data, status, headers, config){
              setTimeout(function() {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Fehler',
                  template: '<div style="text-align:center">Bitte überprüfe Deine <br>Internet-Verbindung</div>',
                  okType: "button-calm"
                });
                alertPopup.then(function(res) {
                });

              }, 2000);

            }).success(function(data, status, headers, config){
            }).then(function(response2) {
              // The then function here is an opportunity to modify the response
              // The return value gets picked up by the then in the controller.
              return response2.data;
            });
            // Return the promise to the controller
            return promise2;
        }

    }



});
