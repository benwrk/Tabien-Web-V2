"use_strict";

var app = angular.module('tabien-app', ['ngRoute', 'ngResource']).run(function ($rootScope, $http, $location) {
    $rootScope.authenticated = false;
    $rootScope.currentUser = {};
    $rootScope.currentUserProfile = {};
    $rootScope.signout = function () {
        $http.get('/auth/signout').success(function (data) {
            console.log('Successfully signed out');
            $rootScope.currentUser = undefined;
        });
    };
});

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'dashboard.html',
        controller: 'tabien-app'
    }).when('/login', {
        templateUrl: 'login.html',
        controller: 'authController'
    }).when('/signup', {
        templateUrl: 'signup.html',
        controller: 'authController'
    });
});

app.factory('postService', function ($rootScope, $http) {
    var factory = {};
    factory.getProfile = function () {
        return $http.get('/api/user/' + $rootScope.currentUser.user_id + '/profile');
    };
    return factory;
});

app.controller('tabienApp', function ($scope, $rootScope, postFactory) {
    $scope.profile = {};
    

    postFactory.query();
    // postFactory.getAll().success(function (data) {
    //     console.log(data);
    //     $scope.posts = data;
    // });

    $scope.post = function () {
        // console.log($rootScope.currentUser.username);
        $scope.newPost.created_by = $rootScope.currentUser.username;
        $scope.newPost.created_time = Date.now();
        // console.log($scope.newPost);
        // console.log($scope.posts);

        postFactory.save($scope.newPost, function () {
            $scope.newPost.created_by = '';
            $scope.newPost.created_time = '';
            $scope.newPost.text = '';
            $scope.posts = postFactory.query();
        });
    };
});

app.controller('authController', function ($scope, $rootScope, $http, $location) {
    $scope.user = { username: '', password: '' };
    $scope.error_message = '';

    $scope.login = function () {
        console.log('[app.js] Logging in...');
        $http.post('/auth/login', $scope.user).success(function (data) {
            console.log('[app.js] Successfully logged in.');
            $rootScope.authenticated = true;
            $rootScope.currentUser = data.user;
            console.log($rootScope.currentUser);
            $location.path('/');
        });
    };

    $scope.signup = function () {
        console.log('[app.js] Signing up...');
        $http.post('/auth/signup', $scope.user).success(function (data) {
            console.log('[app.js] Successfully signed up.');
            $rootScope.authenticated = true;
            $rootScope.currentUser = data.user;

            $location.path('/');
        });
    };
});