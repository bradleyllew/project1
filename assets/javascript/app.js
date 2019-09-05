$(document).ready(function () {

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

    /////////////////////////////////////////////////////////////////////////
    var YouTubeKey = "&key=AIzaSyACSXoiBj6astRGCQf_03G39FP5pO_YmhY";
    var YouTubeURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist" + YouTubeKey;
    var YouTubeQuery = "";
    var YouTubeQueryURL = "";
    var playlistChoices = [];
    var playlistLinks = [];
    //////////////////////////////////////////////////////////////////////////


    //hide the .cocktails div until there is something to display & the tunes section until a drink is picked
    $(".cocktails").hide();
    $(".tunes").hide();
    $("#player").hide();
    $("#back-button").hide();

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


    // The cocktailDB API call - user input
    $("#searchBtn").on("click", function () {


        //reset these arrays to empty so we don't keep adding into them
        drinkIngreds = [];
        drinkMeasrs = [];

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
            drinkImg.addClass('drink-pic').attr("src", drinkThumb);
            bevName = $("<h3>").text(drinkName);
            ingredsP = $("<p>").text("Ingredients: " + measuresIngredients.join(", "));
            directionsP = $("<p>").text("Directions: " + drinkInstr);

            drinkDiv.append(bevName);
            drinkDiv.append(drinkImg);
            drinkDiv.append(ingredsP);
            drinkDiv.append(directionsP);

            // This line actually pushes everything to the DOM so it's visible to the end user. 
            $(".cocktails").append(drinkDiv);
        })

        // reset input field to blank
        $("#searchInput").val("");

        $(".tunes").show();
    }); // end on.("click" event - lots of stuff happened in there...

    ///////////////////////////////////////////////////////////////////
    // grabbing search term and searching api
    $("#searchMusicBtn").on("click", function () {

        playlistChoices = [];

        YouTubeQuery = "&q=" + encodeURIComponent($("#searchMusic").val().trim());
        YouTubeQueryURL = YouTubeURL + YouTubeQuery;
        console.log(YouTubeQueryURL);

        // ajax call
        $.ajax({
            url: YouTubeQueryURL,
            method: "GET"
        }).then(function (playlistDataReturn) {

            $("#player").hide();
            $(".playlists").show();
            $(".playlists").empty();
            $("#back-button").hide();
            $("#searchMusic").val("");

            var playlistData = playlistDataReturn.items;
            console.log(playlistData);

            // generate 5 playlists with an image and text link
            for (m = 0; m < 5; m++) {
                playlistChoices.push(playlistData[m].snippet.title);
                playlistLinks.push("https://www.youtube.com/playlist?list=" + playlistData[m].id.playlistId);
                var embedLink = "https://www.youtube.com/embed/playlist?list=" + playlistData[m].id.playlistId;

                var playlistDiv = $("<div>").addClass('playlists-div');

                var playlistImg = $("<img>");
                playlistImg.addClass('playlist-pic').attr("src", playlistData[m].snippet.thumbnails.medium.url);

                var link = $("<a>");
                link.addClass("playlist-links");
                link.html("<h3>" + playlistChoices[m] + "</h3>");
                //link.attr("href", playlistLinks[m]);
                //link.attr("target", "_blank")

                var lineBreak = $("<br>");

                // writing to DOM
                link.prepend(playlistImg);
                link.append(lineBreak);
                playlistDiv.append(link);
                playlistDiv.attr("data-id", embedLink);

                $(".playlists").append(playlistDiv);
            };

            // function that embeds selected video
            $(".playlists-div").on("click", function () {

                $(".playlists").hide();
                $("#player").show();
                $("#player").empty();
                $("#player").attr("src", $(this).attr("data-id"));
                $("#back-button").show();

            });

            // button to return from embed to search results
            $("#back-button").on("click", function () {
                $(".playlists").show();
                $("#back-button").hide();
                $("#player").hide();
            });

        });

    });
    ////////////////////////////////////////////////////////////////////

    //Random Drink - button


    // FUNCTIONS to be called by Main Process section
    // ================================================================

    // function to prepend measurements to ingredients
    function getMeasuresIngreds() {
        for (var k = 0; k < drinkMeasrs.length; k++) {
            var measure = drinkMeasrs[k];
            var ingredient = drinkIngreds[k];
            console.log(measure + ingredient);
            measuresIngredients.push(measure + ingredient);
        };
    }






































}) // le fin