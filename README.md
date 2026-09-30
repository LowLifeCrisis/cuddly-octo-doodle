Pantry

A recipe finder built with plain HTML, CSS, and JavaScript. Search for recipes, filter by ingredient, country, or category, open a full recipe with a checkable ingredient list, and save favorites for later.

Built as a learning project to practice working with APIs and the DOM without a framework.

Features
Search by name using the search box
Search modes for ingredient, country, and category
Recipe detail view with ingredients you can check off as you cook and numbered steps
Saved recipes stored in the browser with localStorage, so they survive a page reload
Friendly messages when a search finds nothing or the recipe service can't be reached
Responsive layout with automatic dark mode
Built with
HTML, CSS, and vanilla JavaScript (no frameworks or build step)
TheMealDB API for recipe data
Postman for testing API endpoints before writing code
Running it locally
Clone the repo.
Open index.html in your browser.

That's it. There's nothing to install.

TheMealDB's test key (1) is used for development. Publishing an app that uses the API publicly requires supporting TheMealDB on Patreon.

Project structure
index.html   Page structure, including the detail view and empty states
styles.css   All styling, including dark mode and mobile layout
script.js    Fetching data, building cards, handling clicks, saving recipes
How it works

The app follows one loop for every feature:

user does something → fetch data → turn data into HTML → put it on the page

fetchData(search, searchMode) builds the right API URL for the selected search mode and returns the list of meals.
populateRecipies() clears the grid and builds a card for each recipe using createElement and textContent.
A single click listener on the recipe container uses closest('[data-id]') to find which card was clicked (event delegation).
fullRecipie(id) looks up the full recipe with lookup.php and fills in the detail view.
Saved recipe IDs live in localStorage. Opening the Saved view fetches them all at once with Promise.all.
