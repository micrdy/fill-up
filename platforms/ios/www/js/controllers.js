angular.module('fillup.controllers', ["ionic"])

// Intro Controller
//
.controller('IntroCtrl', function($scope, $state, $rootScope, $location, $ionicSlideBoxDelegate, $stateParams) {
	$rootScope.isIntro = "true";
  console.log("introctrl");
  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('stadt');
    // zeige Intro nur beim ersten Mal!
    window.localStorage['didTutorial'] = true;
  };

  if(window.localStorage['didTutorial'] === "true") {
    $scope.startApp();
    return;
  }
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})


.controller('StadtCtrl', function($scope, $rootScope, $ionicPopup, $ionicActionSheet, $state) {
	$rootScope.hideHeader = true;
	$rootScope.isIntro = "false";
    $scope.cities = [{
        id: '001',
        text: 'Konstanz'
    }//, {
      //  id: "002",
        //text: "Freiburg"
    //}
		];

    // Button Funktion Stadt setzen
    $scope.setCity = function() {

    	// Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: $scope.cities,
     titleText: 'Weitere Städte folgen.',
     cancelText: 'Abbrechen',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
		switch(index){
			case 0: $scope.selectedCity = "Konstanz";
							$rootScope.selectedCity = "Konstanz";
			break;
		//	case 1: $rootScope.selectedCity = "Freiburg";
		//	break;
		}
      		$rootScope.hideHeader = false;
            $state.go("tab.gutscheine", {
                "city": $scope.selectedCity
            });

     }
   });

    }
})

.controller('GutscheineCtrl', function($scope, $stateParams, $rootScope, $ionicLoading, Friends) {

    $ionicLoading.show({
        template: '<i class="icon ion-loading-a"></i><br>Lade Gutscheine...',
        noBackdrop: true
    });


    $scope.city = "none";
    $scope.city = $stateParams.city;

		$scope.$on('$ionicView.afterEnter', function(){
			$ionicLoading.show({
				template: '<i class="icon ion-loading-a"></i><br>Lade Gutscheine...',
				noBackdrop: true
			});
			Friends.async($scope.city).then(function(d) {
				$scope.friends = d;
				$scope.empty = "";
				if ($scope.friends.length == 0) {
					$scope.empty = "Leider sind im Moment keine Gutscheine in "+$stateParams.city+" aktiv. Schau doch später noch einmal vorbei!";
				}
				$ionicLoading.hide();
			});

		});

    Friends.async($scope.city).then(function(d) {
        $scope.friends = d;
				$scope.empty = "";
        if ($scope.friends.length == 0) {
            $scope.empty = "Leider sind im Moment keine Gutscheine in "+$stateParams.city+" aktiv. Schau doch später noch einmal vorbei!";
        }
        $ionicLoading.hide();
    });

		$scope.doRefresh = function() {
    	setTimeout(function(){Friends.async($scope.city).then(function(d) {
							$scope.friends = d;
							$scope.empty = "";
							if ($scope.friends.length == 0) {
									$scope.empty = "Leider sind im Moment keine Gutscheine in "+$stateParams.city+" aktiv. Schau doch später noch einmal vorbei!";
							}
							$scope.$broadcast('scroll.refreshComplete');

					});},800);
  	};
		$scope.doRefreshLoading = function() {
			$ionicLoading.show({
				template: '<i class="icon ion-loading-a"></i><br>Lade Gutscheine...',
				noBackdrop: true
			});
			setTimeout(function(){Friends.async($scope.city).then(function(d) {
				$scope.friends = d;
				$scope.empty = "";
				$ionicLoading.hide();
				if ($scope.friends.length == 0) {
					$scope.empty = "Leider sind im Moment keine Gutscheine in "+$stateParams.city+" aktiv. Schau doch später noch einmal vorbei!";
				}
				$scope.$broadcast('scroll.refreshComplete');

			});},800);
		};

})

// CONTROLLER DETAIL INFORMATIONEN UND EINLÖSEN
//
.controller('GutscheinDetailCtrl', function($scope, $rootScope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, Friends) {
    $ionicLoading.show({
        template: '<i class="icon ion-loading-a"></i><br>Lade Details...',
        noBackdrop: true
    });
		$scope.currentTitle = $stateParams.title;

    function initialize(location, adress) {

			var map = new google.maps.Map(document.getElementById('map'), {
				mapTypeId: google.maps.MapTypeId.MAP,
				zoom: 15
			});

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'address': adress
			},
			function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {
					var image = new google.maps.MarkerImage("img/cursor.png", null, null, null, new google.maps.Size(30,34));
					new google.maps.Marker({
						position: results[0].geometry.location,
						map: map,
						icon: image,
						optimized: false
					});
					map.setCenter(results[0].geometry.location);
				}
			});
      }

    // Detail Informationen holen
    $scope.detail = {};
    Friends.getDetail($stateParams.friendId).then(function(b) {
        $scope.detail = b;
       	initialize($scope.detail[0].location, $scope.detail[0].adress);
				$ionicLoading.hide();
    });

		$scope.doRefreshDetailLoading = function() {
			$ionicLoading.show({
				template: '<i class="icon ion-loading-a"></i><br>Lade Details...',
				noBackdrop: true
			});
			setTimeout(function(){Friends.getDetail($stateParams.friendId).then(function(e) {
				$scope.detail = e;
				$ionicLoading.hide();
			});},800);

		};

    $scope.drink = function(gutscheinId) {

        $scope.code = {};

        // An elaborate, custom popup
        var confirmPopup = $ionicPopup.show({
            template: '<input type="tel" ng-model="code.c" pattern="[0-9]*" autofocus />',
            title: 'Gutschein jetzt einlösen',
            subTitle: 'Bitte den freundlichen Barkeeper darum, den Code einzugeben und zu bestätigen. Dann bekommst du dein kostenloses Getränk. Yeah!',
            scope: $scope,
            buttons: [{
                text: 'Abbrechen'
            }, {
                text: '<b>Einlösen</b>',
                type: 'button-calm',
                onTap: function(e) {
                    $ionicLoading.show({
                        template: '<i class="icon ion-loading-a"></i><br>Einlösen...',
                        noBackdrop: true
                    });
                    if (!$scope.code.c) {
                        //don't allow the user to close without input
                        e.preventDefault();
                        $ionicLoading.hide();
                    } else {
                        console.log("checkGutschein");
                        promise3 = $http({
                            url: "http://dev.tellthedj.de/db/checkGutschein.php",
                            method: "POST",
                            data: {
                                "gutscheinId": gutscheinId,
                                "code": $scope.code.c
                            }
                        }).then(function(response3) {
                            // The then function here is an opportunity to modify the response
                            // The return value gets picked up by the then in the controller.
                            check = response3.data;
                            return response3.data;

                        });
                        // Return the promise to the controller
                        return promise3;
                    }
                }
            }, ]
        });

				// wenn button einlösen clicked
        confirmPopup.then(function(res) {
						console.log("localstorage: ", localStorage.getItem($stateParams.friendId));
						if(!res){

						}else if(localStorage.getItem($stateParams.friendId)){
							console.log("Schon benutzt");
							$ionicLoading.hide();
							var alertPopup = $ionicPopup.alert({
								title: 'Sorry',
								template: 'Du hast diesen Gutschein schon eingelöst.',
								okType: "button-calm"
							});
						}else if(check == "false") {

                // Zeige Fehlermeldung das der Code falsch ist
                console.log("Code falsch");
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Code falsch',
                    template: 'Leider ist der eingegebene Code falsch oder der Gutschein gerade abgelaufen.',
                    okType: "button-calm"
                });

            } else {
                // Decrement Counter
                console.log("Code richtig, Decrement");
                promise4 = $http({
                    url: "http://dev.tellthedj.de/db/decrementCount.php",
                    method: "POST",
                    data: {
                        "gutscheinId": gutscheinId
                    }
                }).then(function(response4) {
                    // The then function here is an opportunity to modify the response
                    // The return value gets picked up by the then in the controller.
                    if (response4.data.length == 0) {
                        console.log("Fehler DB");
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Damn!',
                            template: 'Sorry das ist was schief gelaufen!',
                            okType: "button-calm"
                        });
                    } else {
                        console.log("Gutschein eingelöst");
                        ok = response4.data;
                        if (!ok) {
                            $ionicLoading.hide();
                        } else {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Yeah!',
                                template: 'Der Gutschein wurde eingelöst. Du bekommst dein Freigetränk!',
                                okType: "button-calm"
                            });
                            alertPopup.then(function(res) {
                                $scope.code = null;
																// save gutschein in local database
																localStorage.setItem($stateParams.friendId,true);
                                console.log($scope.code);
                                $state.go("tab.gutscheine", {
                                    "city": $stateParams.city
                                });

                            });
                            console.log("Gutschein komplett engelöst");
                        }
                    }
                });
                // Erfolg Popup
            }


        });


    };

})

// CONTROLLER ABGELAUFENE GUTSCHEINE
//
.controller('AbgelaufenCtrl', function($scope, $state, Friends, $ionicLoading, $rootScope, $stateParams) {
	$rootScope.isDash = "false";
	$ionicLoading.show({
        template: '<i class="icon ion-loading-a"></i><br>Lade abgelaufene Gutscheine...',
        noBackdrop: true
    });

    $scope.city = $rootScope.selectedCity;
    Friends.asyncDone($scope.city).then(function(d) {
        $scope.friends = d;
        if ($scope.friends.length == 0) {
            $scope.empty = "Es sind im Moment keine abgelaufenen Gutscheine in "+$scope.city+" aktiv. Schau doch später noch einmal vorbei!";
        }
        $ionicLoading.hide();
    });

		$scope.doRefreshAbgelaufen = function(){
			$ionicLoading.show({
				template: '<i class="icon ion-loading-a"></i><br>Lade abgelaufene Gutscheine...',
				noBackdrop: true
			});
			Friends.asyncDone($scope.city).then(function(d) {
				$scope.friends = d;
				if ($scope.friends.length == 0) {
					$scope.empty = "Es sind im Moment keine abgelaufenen Gutscheine in "+$scope.city+" aktiv. Schau doch später noch einmal vorbei!";
				}
				$ionicLoading.hide();
			});
		}
})

.controller('EinstellungenCtrl', function($scope, $rootScope, $state) {
	$scope.einstellungen = "Einstellungen";
	$rootScope.isDash = "false";

	$scope.goToUber = function(){
		$state.go("tab.uber");
	}
})
.controller('UberCtrl', function($scope, $state) {

})
