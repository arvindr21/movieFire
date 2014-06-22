$(document).ready(function() {
    // model
    var Movie = Backbone.Model.extend({
        defaults: function() {
            return {
                name: ""
            };
        }
    });
    //collection
    var Movies = Backbone.Firebase.Collection.extend({
        model: Movie,
        firebase: new Firebase("https://moviefire.firebaseio.com/movies")
    });
    // init collection
    var favMovies = new Movies();
    //view
    var favMovieView = Backbone.View.extend({
        tagName: "li",
        events: {
            "click .delete": "clear",
            "click .edit": "edit",
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'remove', this.remove);
        },
        render: function() {
            this.$el.html(_.template($('#movieTemplate').html().trim(), this.model.toJSON()));
            return this;
        },
        edit: function() {
            var movieName = prompt("Update the movie name", this.model.get('name').trim()); // to keep things simple and old skool :D
            if (movieName && movieName.length > 0) {
                this.model.set({
                    name: movieName
                });
            }
        },
        clear: function() {
            var response = confirm("Are certain about removing \"" + this.model.get('name').trim() + "\" from the list?");
            if (response == true) {
                favMovies.remove(this.model);
            }
        }
    });

    var AppView = Backbone.View.extend({
        el: $("body"),
        events: {
            "keypress #movieName": "saveToList"
        },
        initialize: function() {
            this.input = this.$("#movieName");
            this.listenTo(favMovies, 'add', this.addOne);
        },
        saveToList: function(e) {
            if (e.keyCode != 13) return
            else {
                if (this.input.val().length > 0)
                    favMovies.add({
                        name: this.input.val()
                    });
            }
            this.input.val('');
        },
        addOne: function(movie) {
            if ($('#loading').length > 0) $('#loading').remove();
            var view = new favMovieView({
                model: movie
            });
            this.$("#favMovies").append(view.render().el);
        }
    });
    var App = new AppView();
});
