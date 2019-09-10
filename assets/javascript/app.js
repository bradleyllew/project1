    
$(document).ready(function () {

    // LANDING PAGE REDIRECT BUTTON 
    // ================================================================
    const landLogo =  document.querySelector('#landImg')
    landLogo.classList.add('animated', 'zoomIn')

    
    $("#page-change").on("click", function () {
        location.href = "https://jeff-paul-greco.github.io/project1/search-page";
    });


    // SETUP GLOBAL VARIABLES
    // ================================================================
    var cocktailKey = "1/";
    var cocktailURLBase = "https://www.thecocktaildb.com/api/json/v1/" + cocktailKey + "search.php?s=";
    var cocktailQuery = "";
    var cocktailQueryURL = "";

    var drinkIngreds = [];
    var drinkMeasrs = [];
    // var drinkObject = {};
    var drinkInstr = "";
    var drinkThumb = "";
    // var drinkIngrThumbs = "";
    var drinkName = "";
    var measuresIngredients = [];

    var ingredientPicURL = "https://www.thecocktaildb.com/images/ingredients/" + ingredientTerm + "-Medium.png";
    var ingredientTerm = "";
    var ingredient = "";

    var YouTubeKey = "&key=AIzaSyACSXoiBj6astRGCQf_03G39FP5pO_YmhY";
    var YouTubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist" + YouTubeKey;
    var YouTubeQuery = "";
    var YouTubeQueryURL = "";
    var playlistChoices = [];

    //hide the .cocktails div until there is something to display & the tunes section until a drink is picked
    $(".cocktails").hide();
    $(".tunes").hide();
    $("#player").hide();
    $("#back-button").hide();
    $("#hide-show").hide();
    $("#modalDrinkFail").hide();
    $("#drinkInputFail").hide();
    $("#YouTubeNoInput").hide();

    // Main Process
    // ================================================================

    // code to search either input with enter key 
    $("#searchInput").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#searchBtn").click();
        }
    });

    $("#searchMusic").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#searchMusicBtn").click();
        }
    });

    $(".randomDrinkButton").on("click", function () {
        getRandomDrink();
    });

    $("#randomBtn").on("click", function () {
        getRandomDrink();
    });

    $(".jumpToYouTubeSearch").on("click", function () {
        $(".tunes").show();
    });

    // The cocktailDB API call - user input
    $("#searchBtn").on("click", function () {

        if ($("#searchInput").val() === "" || $("#searchInput").val() === " " || $("#searchInput").val() === null) {
            $("#searchInput").val("");

            //initializes modals
            $(".modal").modal();
            // triggers the modal with id #modalDrinkFail
            $('#drinkInputFail').modal('open');
            //hides the other modals
            $("#modalDrinkFail").hide();
            $("#YouTubeNoInput").hide();

            // stops the below code from running & generating errors on the page
            return;
        }

        //reset these arrays to empty so we don't keep adding into them
        drinkIngreds = [];
        drinkMeasrs = [];

        //empty the .cocktails div so we have only one drink showing at a time
        $(".cocktails").empty();
        $(".ingredients-div").empty();
        $(".directions-div").empty();

        cocktailQuery = encodeURIComponent($("#searchInput").val().trim()); //cleans user input - spaces --> %20 which are needed for this API's calls
        //building the query URL
        cocktailQueryURL = cocktailURLBase + cocktailQuery;
        console.log("cocktailQuery input: " + cocktailQuery);
        console.log(cocktailQueryURL);
        //the actual API call
        $.ajax({
            url: cocktailQueryURL,
            method: "GET"
            // this executes once the promise comes back
        }).then(function (cocktailDataReturn) {

            //check for "null" return (meaning, the search failed)
            var drinkNullCheck = cocktailDataReturn.drinks;
            console.log(drinkNullCheck);
            if (drinkNullCheck === null) {
                // alert("we didn't find that. Try again");
                //initializes modals
                $(".modal").modal();
                // triggers the modal with id #modalDrinkFail
                $('#modalDrinkFail').modal('open');
                $("#drinkInputFail").hide();
                $("#YouTubeNoInput").hide();

                // stops the below code from running & generating errors on the page
                return;
            }

            // set returned data to drinkData - easier to type/read
            var drinkData = cocktailDataReturn.drinks[0];
            console.log(drinkData);

            // show the .cocktails div now that we have something to put in it
            $(".cocktails").show();

            // each drink has 15 ingredient fields - whether used or not. This loop only pushes the actual ingredients into the drinkIngreds array
            for (var i = 1; i < 16; i++) {
                ingred = eval("drinkData.strIngredient" + i);
                console.log("ingred: " + ingred);
                if (ingred !== "" && ingred !== " " && ingred !== null) {
                    drinkIngreds.push(ingred);
                }
            }
            console.log(drinkIngreds);

            // same thing as above but for the ingredient measurements
            for (var j = 1; j < 16; j++) {
                measr = eval("drinkData.strMeasure" + j);
                console.log(measr);
                if (measr != "" && measr != " " && measr !== null) {
                    drinkMeasrs.push(measr);
                }
            }
            console.log(drinkMeasrs);

            //pull the info we want to display from the returned data
            drinkInstr = drinkData.strInstructions;
            drinkName = drinkData.strDrink;
            drinkThumb = drinkData.strDrinkThumb;

            console.log(drinkInstr);
            console.log(drinkName);
            console.log(drinkThumb);

            // DOM stuff - creating elements to place our content

            getMeasuresIngreds();

            var drinkDiv = $("<div>").addClass('drink-div');
            var drinkImg = $("<img>");
            drinkImg.addClass('drink-pic responsive-img').attr("src", drinkThumb);
            bevName = $("<h4>").text(drinkName);
            ingredsP = $("<p>").text("Ingredients: " + measuresIngredients.join(", "));
            directionsP = $("<p>").text("Directions: " + drinkInstr);

            drinkDiv.append(bevName);
            drinkDiv.append(drinkImg);
            // These lines push everything to the DOM so it's visible to the end user. 
            // $(".ingredients-div").append(ingredsP);
            getIngredientPics();
            $(".directions-div").append(directionsP);
            $(".cocktails").append(drinkDiv);

            // var drinkDiv = $("<div>").addClass('drink-div');
            // var drinkImg = $("<img>");
            // drinkImg.addClass('drink-pic responsive-img').attr("src", drinkThumb);
            // bevName = $("<h4>").text(drinkName);
            // ingredsP = $("<p>").text("Ingredients: " + measuresIngredients.join(", "));
            // directionsP = $("<p>").text("Directions: " + drinkInstr);

            // drinkDiv.append(bevName);
            // drinkDiv.append(drinkImg);
            // // These lines pushe everything to the DOM so it's visible to the end user. 
            // $(".ingredients-div").append(ingredsP);
            // $(".directions-div").append(directionsP);
            // $(".cocktails").append(drinkDiv);
        })

        // reset input field to blank
        $("#searchInput").val("");

        $(".tunes").show();
    }); // end on.("click" event - lots of stuff happened in there... this should probably be refactored. I see some opportunities to write separate functions and call them inside this event. Would be a lot more agile... ~JH

    // grabbing search term and searching api
    $("#searchMusicBtn").on("click", function () {

        playlistChoices = [];

        YouTubeQuery = "&q=" + ($("#searchMusic").val().trim());
        YouTubeQueryURL = YouTubeURL + YouTubeQuery;
        console.log(YouTubeQueryURL);
        $(".resp-container").css("padding-top", "0%");

        if ($("#searchMusic").val() === null || $("#searchMusic").val() === "" || $("#searchMusic").val() === " ") {

            $(".modal").modal();
            $("#YouTubeNoInput").modal('open');
            $("#modalDrinkFail").hide();
            $("#drinkInputFail").hide();
            $("#searchMusic").val("");

        } else {
            // ajax call
            $.ajax({
                url: YouTubeQueryURL,
                method: "GET"
            }).then(function (playlistDataReturn) {

                console.log(playlistDataReturn);

                $("#player").hide();
                $(".playlists").show();
                $(".playlists").empty();
                $("#back-button").hide();
                $("#hide-show").hide();
                $("#searchMusic").val("");

                var playlistData = playlistDataReturn.items;
                console.log(playlistData);

                if (playlistData.length === 0) {

                    $(".modal").modal();
                    $("#YouTubeFail").modal('open');

                    $("#modalDrinkFail").hide();
                    $("#drinkInputFail").hide();
                    $("#searchMusic").val("");
                    $("#YouTubeNoInput").hide();

                } else {

                    // generate 5 playlists with an image and text link
                    for (m = 0; m < 4; m++) {
                        playlistChoices.push(playlistData[m].snippet.title);
                        var embedLink = "https://www.youtube.com/embed/playlist?list=" + playlistData[m].id.playlistId + "&playsinline=1";

                        var playlistDiv = $("<div>").addClass('playlist-div');

                        //assembling playlist entries in memory
                        var playlistImg = $("<img>");
                        playlistImg.addClass('playlist-pic').attr("src", playlistData[m].snippet.thumbnails.medium.url);
                        var link = $("<a>");
                        link.addClass("playlist-links");
                        link.html("<h3>" + playlistChoices[m] + "</h3>");

                        // writing to DOM
                        link.prepend(playlistImg);
                        playlistDiv.append(link);
                        playlistDiv.attr("data-id", embedLink);

                        $(".playlists").append(playlistDiv);
                    };
                };
                // function that embeds selected video
                $(".playlist-div").on("click", function () {

                    $(".resp-container").css("padding-top", "56.25%")
                    $(".playlists").hide();
                    $("#player").show();
                    $("#player").empty();
                    $("#player").attr("src", $(this).attr("data-id"));
                    $("#back-button").show();
                    $("#hide-show").show();

                });

                // button to return from embed to search results
                $("#back-button").on("click", function () {
                    $(".resp-container").css("padding-top", "0%")
                    $(".playlists").show();
                    $("#back-button").hide();
                    $("#hide-show").hide();
                    $("#player").hide();
                });

                // button that toggles YouTube embed visibility
                $("#hide-show").unbind().click(function () {
                    $("#player").toggle("fast");
                });
            });
        }
    });

    // FUNCTIONS to be called by Main Process section
    // ================================================================

    // function to prepend measurements to ingredients
    function getMeasuresIngreds() {

        //reset this array to empty so we don't keep adding to it
        measuresIngredients = [];

        for (var k = 0; k < drinkMeasrs.length; k++) {
            var measure = drinkMeasrs[k];
            var ingredient = drinkIngreds[k];
            console.log(measure + ingredient);

            if (measure !== undefined && ingredient !== undefined) {
                measuresIngredients.push(measure + ingredient);
            }
        };
    }

    // function to get random drink and display it
    function getRandomDrink() {
        $.ajax({
            url: "https://www.thecocktaildb.com/api/json/v1/1/random.php",
            method: "GET"
            // this executes once the promise comes back
        }).then(function (cocktailDataReturn) {
            // //reset these arrays to empty so we don't keep adding into them
            drinkIngreds = [];
            drinkMeasrs = [];
            console.log("drinkIngreds: " + drinkIngreds);
            console.log("drinkMeasrs: " + drinkMeasrs);

            //empty the .cocktails div so we have only one drink showing at a time
            $(".cocktails").empty();
            //empty the .ingredients-div and directions-div so we have only one thing showing at a time
            $(".ingredients-div").empty();
            $(".directions-div").empty();

            // show the .cocktails div now that we have something to put in it
            $(".cocktails").show();

            // set returned data to drinkData - easier to type/read
            var drinkData = cocktailDataReturn.drinks[0];
            console.log(drinkData);

            // each drink has 15 ingredient fields - whether used or not. This loop only pushes the actual ingredients into the drinkIngreds array
            for (var i = 1; i < 16; i++) {
                ingred = eval("drinkData.strIngredient" + i);
                console.log("ingred: " + ingred);
                if (ingred !== "" && ingred !== " " && ingred !== null) {
                    drinkIngreds.push(ingred);
                }
            }
            console.log(drinkIngreds);

            // same thing as above but for the ingredient measurements
            for (var j = 1; j < 16; j++) {
                measr = eval("drinkData.strMeasure" + j);
                console.log(measr);
                if (measr != "" && measr != " " && measr !== null) {
                    drinkMeasrs.push(measr);
                }
            }
            console.log(drinkMeasrs);

            //pull the info we want to display from the returned data
            drinkInstr = drinkData.strInstructions;
            drinkName = drinkData.strDrink;
            drinkThumb = drinkData.strDrinkThumb;

            console.log(drinkInstr);
            console.log(drinkName);
            console.log(drinkThumb);

            // DOM stuff - creating elements to place our content

            getMeasuresIngreds();

            var drinkDiv = $("<div>").addClass('drink-div');
            var drinkImg = $("<img>");
            drinkImg.addClass('drink-pic responsive-img').attr("src", drinkThumb);
            bevName = $("<h4>").text(drinkName);
            ingredsP = $("<p>").text("Ingredients: " + measuresIngredients.join(", "));
            directionsP = $("<p>").text("Directions: " + drinkInstr);

            drinkDiv.append(bevName);
            drinkDiv.append(drinkImg);
            // These lines push everything to the DOM so it's visible to the end user. 
            // $(".ingredients-div").append(ingredsP);
            getIngredientPics();
            $(".directions-div").append(directionsP);
            $(".cocktails").append(drinkDiv);

            //The below commented out section is the original that the above replaced. If things get fucked, uncomment below and delete above to unfuck things.
            // ==========================================================================
            // var drinkDiv = $("<div>").addClass('drink-div');
            // var drinkImg = $("<img>");
            // drinkImg.addClass('drink-pic responsive-img').attr("src", drinkThumb);
            // bevName = $("<h3>").text(drinkName);
            // ingredsP = $("<p>").text("Ingredients: " + measuresIngredients.join(", "));
            // directionsP = $("<p>").text("Directions: " + drinkInstr);

            // drinkDiv.append(bevName);
            // drinkDiv.append(drinkImg);
            // // These lines push everything to the DOM so it's visible to the end user. 
            // $(".ingredients-div").append(ingredsP);
            // $(".directions-div").append(directionsP);
            // $(".cocktails").append(drinkDiv);
        })

        // reset input field to blank
        $("#searchInput").val("");

        $(".tunes").show();
    };

    //function to get ingredient images
    function getIngredientPics() {
        // ingredientPicURL = "https://www.thecocktaildb.com/images/ingredients/" + ingredientTerm + "-Medium.png";
        // ingredientTerm = "";
        for (var k = 0; k < drinkIngreds.length; k++) {
            // var measure = drinkMeasrs[k];
            ingredient = drinkIngreds[k];
            measure = drinkMeasrs[k];

            if (measure !== undefined && ingredient !== undefined) {
                ingredsDivContainer = $("<div>").addClass("center-align ingredient-thumb col s6 m4 l3");
                // ingredsDivContainer = $("<figure>").addClass("center-align ingredient-thumb col s6 m4");
                ingredientTerm = ingredient;
                ingredientPicURL = "https://www.thecocktaildb.com/images/ingredients/" + ingredientTerm + "-Medium.png";

                console.log("ingredientTerm: " + ingredientTerm);
                console.log("ingredientPicURL: " + ingredientPicURL);

                ingredientImg = $("<img>").attr("src", ingredientPicURL).addClass("responsive-img ingredient-image");
                ingredsFigcaption = $("<figcaption>").text(measure + " " + ingredient);
                // ingredsFigcaption = $("<figcaption>").text(measuresIngredients.join(", "));

                ingredsDivContainer.append(ingredientImg);
                ingredsDivContainer.append(ingredsFigcaption);
                $(".ingredients-div").append(ingredsDivContainer);
                // measuresIngredients.push(measure + ingredient);
            };
        }
    }

}) // le fin