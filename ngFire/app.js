var movieFire = angular.module("MovieFire", ["firebase"]);

function MainController($scope, $firebase) {
    $scope.favMovies = $firebase(new Firebase('https://moviefire.firebaseio.com/movies'));
    $scope.movies = [];
    $scope.favMovies.$on('value', function() {
        $scope.movies = [];
        var mvs = $scope.favMovies.$getIndex();
        for (var i = 0; i < mvs.length; i++) {
            $scope.movies.push({
                name: $scope.favMovies[mvs[i]].name,
                key: mvs[i]
            });
        };
    });

    $scope.saveToList = function(event) {
        if (event.which == 13 || event.keyCode == 13) {
            var mvName = $scope.mvName.trim();
            if (mvName.length > 0) {
                $scope.favMovies.$add({
                    name: mvName
                });
                movieName.value = ''; //movieName is the ID of  input box - Angular rocks!
            }
        }
    }

    $scope.edit = function(index) {
    	var mv = $scope.movies[index];
        var newName = prompt("Update the movie name", mv.name); // to keep things simple and old skool :D
        if (newName && newName.length > 0) {
            // build the FB endpoint to the item in movies collection
            var updateMovieRef = buildEndPoint(mv.key, $firebase);
            updateMovieRef.$set({
                name: newName
            });
        }
    }

    $scope.del = function(index) {
    	var mv = $scope.movies[index];
        var response = confirm("Are certain about removing \"" + mv.name + "\" from the list?");
        if (response == true) {
            // build the FB endpoint to the item in movies collection
            var deleteMovieRef = buildEndPoint(mv.key, $firebase);
            deleteMovieRef.$remove();
        }
    }

}

function buildEndPoint(key, $firebase) {
    return $firebase(new Firebase('https://moviefire.firebaseio.com/movies/' + key));
}
