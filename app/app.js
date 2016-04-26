var app = angular.module('chirpApp', []);

app.controller('chirpController', function ($scope) {
    $scope.posts = [];
    $scope.newPost = {
        created_by: "",
        text: "",
        created_time: ""
    };

    $scope.post = function () {
        $scope.newPost.created_time = Date.now();
        $scope.posts.push($scope.newPost);
        $scope.newPost = { created_by: "", text: "", created_time: "" };
    };
});