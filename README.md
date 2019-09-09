
HOUSE PARTY

Welcome to House Party, the app that plans a party perfect for you! From booze to tunes, we provide a user-friendly way to search for your favorite music and the perfect recipes to make your favorite drinks. Good drinks and good music, what else could you ask for?

Instructions:

1. Click the logo on the landing page to be transported to the main site.

2. You will see an input box with the placeholder "Pick your poison!". In this box, type whatever drink       you would to look up. Once you have typed in your drink name, press enter or click the "search"            button with the martini glass icon. You can also click the "random" button with the question mark          icon to return a random drink.

3. The site will now search for a drink recipe based on your search term. The name and an image of the        drink returned will be displayed below the search box. The ingredients and amounts of said                 ingredients will be displayed to the right of the drink name/image and the directions for preparing        your drink will appear below everything.

4. Type in another drink name to search for a new drink if you'd like. Each new search replaces the           previous search's information on screen.

5. Once you have searched for a drink, another search field with the placeholder "Music for your mood!"       will appear next to the drink search field. Enter a musical genre or band's name into this box and then    click the search button with a music note icon located beneath the search field.

6. Below the drink information, five search results will appear for playlists matching your musical search    term. Click any of the results to bring that playlist up on screen via the YouTube player. You can also    enter a new search and pull up 5 new results.

7. Now you can play and control this playlist via the YouTube player's controls. There are two buttons        that appear directly above the youtube player. The first, labeled "back to result", will return you to     the 5 playlists that were returned on your last search. The second button, labeled "hide/show", will       collapse the YouTube player out of view, tidying up your screen. 

8. Start a playlist and then hit the "hide/show" button and it will play in the background and change         songs automatically. Now that you've set the mood, reference our handy drink recipes and enjoy your         House Party!

Under the Hood:

To make it all work, our site utilizes AJAX calls to both YouTube and TheCocktailDB's APIs. TheCocktail DB returns a JSON object that is then used as a reference to manipulate our various points of drink data. The YouTube API returns a JSON object with 5 YouTube playlists matching the search term captured by the user. By altering our TheCocktailDB Query URL, we have included the option to generate a random drink search. This is done by utilizing random.php in the url. We have also programmed various modals which will appear as error messages in the event of failed searches. If either search is executed with nothing written in their corresponding text field, then an error message will display on screen. If you do type a search term and it returns zero results, then a differents error message will display. A hide/show button was included to switch between the YouTube player appearing and disappearing on screen. This was done by wiring a click event to execute .toggle() on said element. On the style side we began with a wireframe model using Adobe XD. Then we implemented the Materialize CSS library and grid system, along with flexbox elements, to provide a dynamic and responsive UI.  

House Party Coding Team:

Jarkko Haarla, Bradley Cordle, Jeff Greco, Jeffrey Huddleston