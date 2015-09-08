angular.module('fillup.services', [])

// SERVICE - Returned alle Gutscheine und Detailinformationen zum Gutschein
//
.factory('Friends', function($http, $ionicLoading, $ionicPopup) {
    var path = "http://dev.tellthedj.de/db-v1.1/";

    return {


        // hole alle aktiven Gutscheine
        async: function(city) {
            promise = $http({
                url: path + "getGutscheine.php",
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
                return response.data;
            });
            return promise;
        },


        // hole alle abgelaufenen Gutscheine
        asyncDone: function(city) {
            // $http returns a promise, which has a then function, which also returns a promise
            promise = $http({
                url: path + "getDoneGutscheine.php",
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


        // Hole Detail Informationen zum Gutschein
        getDetail: function(friendId) {
            promise2 = $http({
                url: path + "getGutschein.php",
                method: "POST",
                data: {"gutscheinId":friendId}
            }).error(function(data, status, headers, config){
              setTimeout(function() {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Fehler',
                  template: '<div style="text-align:center">Da ist etwas schief gelaufen...</div>',
                  okType: "button-calm"
                });
                alertPopup.then(function(res) {
                });

              }, 2000);

            }).success(function(data, status, headers, config){
            }).then(function(response2) {
              return response2.data;
            });
            return promise2;
        }


    }



});
