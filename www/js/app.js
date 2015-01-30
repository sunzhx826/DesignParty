// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
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
    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $stateProvider
          .state('tabs', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
          })
          .state('tabs.home', {
            url: "/home",
            views: {
              'home-tab': {
                templateUrl: "templates/home.html",
                controller: 'HomeTabCtrl'
              }
            }
          })
          .state('tabs.facts', {
            url: "/facts/:user",
            views: {
              'home-tab': {
                templateUrl: "templates/facts.html",
                controller: 'playerCtrl'
              }
            }
          })
          .state('tabs.facts2', {
            url: "/facts2",
            views: {
              'home-tab': {
                templateUrl: "templates/facts2.html"
              }
            }
          })
          .state('tabs.about', {
            url: "/about",
            views: {
              'about-tab': {
                templateUrl: "templates/about.html"
              }
            }
          })
          .state('tabs.navstack', {
            url: "/navstack",
            views: {
              'about-tab': {
                templateUrl: "templates/nav-stack.html"
              }
            }
          })
          .state('tabs.contact', {
            url: "/contact",
            views: {
              'contact-tab': {
                templateUrl: "templates/contact.html"
              }
            }
          });


      $urlRouterProvider.otherwise("/tab/home");

    })
    .service ("NEWART",["$http","$log","$timeout",NEWART])
    .service ("playerinfo",function(){
        this.playerid="none";

})
    .service ("getplayer",["$http","$log",
          function($http,$log){
            this.playerArt=function($scope,username){
              $http.jsonp("http://api.dribbble.com/players/"+username+"/shots?callback=JSON_CALLBACK")
                  .success(function(result){
                    $scope.player=result.shots;
                    //$log.info(JSON.stringify(result.shots));
                  })
            }

          }])
    .controller('playerCtrl',function($scope,$log,$stateParams,playerinfo,getplayer){
      //var playerid=playerinfo.playerid;
      //$log.info(playerid);
      var playerid=$stateParams.user;
      getplayer.playerArt($scope,playerid);
     /* var TestObject = AV.Object.extend("TestObject");
      var testObject = new TestObject();
      testObject.save({foo: "bar"}, {
        success: function(object) {
          alert("LeanCloud works!");
        }
      });*/
    })
    .controller('HomeTabCtrl', function($scope,$log,$state,NEWART,playerinfo) {
      $scope.page=1;
      $scope.shots=[];

      //alert(12);
     // AV.initialize("q850ksnrzmkyqkayjz3q6rfq2msgcvmkd30jmtrrudw53yk2", "flv8wll40ekqwwu85tk93w7i4fp3yvb0anww21ehf8upsx5o");
// 初始化 param1：应用 id、param2：应用 key

      $scope.reload = function(){

          $scope.page=1;
        /*var slength =$scope.shots.length;
        for (var sl= 0;sl<slength;sl++)
            $scope.shots[sl]=null;*/
          $scope.shots=[];//未改

             // $scope.$broadcast('scroll.refreshComplete');//未改


        $state.go($state.current.name, $state.params, { reload: true });

      };



      //$scope.player=55;
      $scope.loadnew = function() {
//$log.info("L" + $scope.shots.length + "P" + $scope.page);

          NEWART.getNew($scope);

      };
      $scope.goplayer=function(index) {
        //$scope.isplayer = true;
        var username = $scope.shots[index].player.username;
        playerinfo.playerid=username;
        //$log.info(username);
        //$location.path("/tab/facts");
      }

    });




function NEWART ($http,$log,$timeout){
  this.getNew=function($scope){

    $http.jsonp("http://api.dribbble.com/shots/everyone?page="+$scope.page+"&callback=JSON_CALLBACK")
        .success(function(result){
          for (var sl=0; sl<result.shots.length; sl++) {
            $scope.shots.push(result.shots[sl]);
          }
          $scope.page=$scope.page+1;
          //$log.info($scope.shots);

          $timeout (function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');

          });


        });
  };

}
