# Pantry

A recipe finder built with plain HTML, CSS, and JavaScript. Search for recipes, filter by ingredient, country, or category, open a full recipe with a checkable ingredient list, and save favorites for later.

Built as a learning project to practice working with APIs and the DOM without a framework.

## Features

- **Search by name** using the search box
- **Search modes** for ingredient, country, and category
- **Recipe detail view** with ingredients you can check off as you cook and numbered steps
- **Saved recipes** stored in the browser with `localStorage`, so they survive a page reload
- **Friendly messages** when a search finds nothing or the recipe service can't be reached
- **Responsive layout** with automatic dark mode

## Built with

- HTML, CSS, and vanilla JavaScript (no frameworks or build step)
- [TheMealDB API](https://www.themealdb.com/api.php) for recipe data
- Postman for testing API endpoints before writing code


## Project structure

```
index.html   Page structure, including the detail view and empty states
styles.css   All styling, including dark mode and mobile layout
script.js    Fetching data, building cards, handling clicks, saving recipes
```
