$(document).ready(function(){

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

    //hide the .cocktails div until there is something to display & the tunes section until a drink is picked
    $(".cocktails").hide();
    $(".tunes").hide();

    // Main Process
    // ================================================================

    // The cocktailDB API call - user input
    $("#searchBtn").on("click", function() {
        
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
        }).then(function(cocktailDataReturn) {
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
            $(".cocktails").prepend(drinkDiv);
        })

        // reset input field to blank
        $("#searchInput").val("");

        $(".tunes").show();



        
    }); // end on.("click" event - lots of stuff happened in there...



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