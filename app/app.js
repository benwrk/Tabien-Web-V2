"use_strict";

var app = angular.module('chirpApp', []);

app.controller('chirpController', function ($scope) {
    $scope.posts = [];
    $scope.newPost = {
        created_by: '',
        text: '',
        created_time: ''
    };

    $scope.post = function () {
        $scope.newPost.created_time = Date.now();
        $scope.posts.push($scope.newPost);
        $scope.newPost = { created_by: "", text: "", created_time: "" };
    };
});

app.controller('authController', function ($scope) {
    $scope.user = { username: '', password: '' };
    $scope.error_message = '';

    // postService.getAll().success(function (data) {
    //     $scope.posts = data;
    // });

    $scope.login = function () {
        $scope.error_message = 'login request for ' + $scope.user.username;
    };

    $scope.signup = function () {
        $scope.error_message = 'signup request for ' + $scope.user.username;
    };
});