// Array for all of our recipies 
let recipies = [];

//Grab Form elements 
const results = document.querySelector("#recipe-container");


//Initilize App here 
async function app() {
    recipies = await fetchData();
    console.log(recipies);
    populateRecipies();
}


//Get Data Function
async function fetchData() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken")

        if (!response.ok){
            throw new Error(`Response status: ${response.status}`)
        }

        const result = await response.json();
        
        
        return result.meals;
        
        
    } catch(error) {
        console.error(error.message);
    }
}

//Create Cards
function populateRecipies() {
    //create article
    const article = document.createElement("article");
    article.classList.add("recipe-card");

    //create button
    const button = document.createElement("button");
    button.classList.add("recipe-card__link");
    button.dataset.id = recipies[0].idMeal;
    article.appendChild(button);

    //create image
    const image = document.createElement("img")
    image.classList.add("recipe-card__image");
    image.src = recipies[0].strMealThumb;
    image.alt = recipies[0].strMeal;
    button.appendChild(image);

    //create div
    const div = document.createElement("div");
    div.classList.add("recipe-card__body");

    const h2 = document.createElement("h2");
    h2.classList.add("recipe-card__title")
    h2.textContent = recipies[0].strMeal;
    div.appendChild(h2);

    const p = document.createElement("p");
    p.classList.add("recipe-card__meta");
    p.textContent = recipies[0].strCountry +", " + recipies[0].strCategory ;

    div.appendChild(p);

    button.appendChild(div);

    // Place the whole thing into recipe container
    results.appendChild(article);

}

//

app();