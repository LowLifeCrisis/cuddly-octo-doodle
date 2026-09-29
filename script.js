// Array for all of our recipies 
let recipies = [];

//Grab Form elements 
const results = document.querySelector("#recipe-container");
const recipeDetails = document.querySelector("#recipe-detail");
const filters = document.querySelector("#filters");


//Initilize App here 
async function app() {
    document.querySelector("#search-button").addEventListener("click", async () => {
        const search = document.querySelector("#search-input");
        const recipeSearch = search.value;
        recipies = await fetchData(recipeSearch);
        // Update the search for something to get started text 
        const resultStatus = document.querySelector("#results-status");
        resultStatus.textContent = `Result for ${recipeSearch}`;
        //Populate the recipies on the page
        populateRecipies();
        
        

    })

    
    

    results.addEventListener("click", (event) => {
        const clickedRecipie = event.target.closest('[data-id]');
        const id = clickedRecipie.dataset.id;
        
        if (id == null) {
            return
        }

        fullRecipie(id);
        
    })

     document.querySelector("#back-button").addEventListener("click", () => {
        recipeDetails.hidden = true;
        document.querySelector("#results").hidden = false;
    })

    filters.addEventListener("click", (event) => {

        const activeFilter = event.target.closest(``)
    })
    

    
}
/////////////////////////////////////////////////

//Get Data Function
async function fetchData(search) {
    try {
        const base = "https://www.themealdb.com/api/json/v1/1/search.php?s="
        
        const response = await fetch(`${base}${encodeURIComponent(search)}`)

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
    //clear cards
    results.innerHTML = "";

    //Loop through the results 
    for (let recipe of recipies) {

    //create article
    const article = document.createElement("article");
    article.classList.add("recipe-card");

    //create button
    const button = document.createElement("button");
    button.classList.add("recipe-card__link");
    button.dataset.id = recipe.idMeal;
    article.appendChild(button);

    //create image
    const image = document.createElement("img")
    image.classList.add("recipe-card__image");
    image.src = recipe.strMealThumb;
    image.alt = recipe.strMeal;
    button.appendChild(image);

    //create div
    const div = document.createElement("div");
    div.classList.add("recipe-card__body");

    const h2 = document.createElement("h2");
    h2.classList.add("recipe-card__title")
    h2.textContent = recipe.strMeal;
    div.appendChild(h2);

    const p = document.createElement("p");
    p.classList.add("recipe-card__meta");
    p.textContent = recipe.strCountry +", " + recipe.strCategory ;

    div.appendChild(p);

    button.appendChild(div);

    // Place the whole thing into recipe container
    results.appendChild(article);

    }



}

//Dsiplay the full recipie 
//This is the next step, gotta fill out the card
function fullRecipie(id) {
   const foundRecipe = recipies.find((recipe) => {
         return recipe.idMeal === id;
         
    });
    // Now we create the actual recipie on the page
    const detailImage = document.querySelector("#detail-image");
    detailImage.src = foundRecipe.strMealThumb;
    detailImage.alt = foundRecipe.strMeal;

    const detailMeta = document.querySelector("#detail-meta");
    detailMeta.textContent = foundRecipe.strCountry + ", " + foundRecipe.strCategory;

    const detailTitle = document.querySelector("#detail-title");
    detailTitle.textContent = foundRecipe.strMeal;

    

     // Ingredients
    const ingredientList = document.querySelector("#detail-ingredients");
    ingredientList.innerHTML = ""; // clear the last recipe's items

    for (let i = 1; i <= 20; i++) {
        const ingredient = foundRecipe[`strIngredient${i}`];
        const measure = foundRecipe[`strMeasure${i}`];

        if (!ingredient) {
            continue;
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const span = document.createElement("span");
        span.classList.add("qty");
        span.textContent = measure;

        const label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(span);
        label.append(" " + ingredient);

        const li = document.createElement("li");
        li.appendChild(label);
        ingredientList.appendChild(li);
    }

    // Steps
    const stepList = document.querySelector("#detail-steps");
    stepList.innerHTML = "";

    const steps = foundRecipe.strInstructions.split("\r\n");

    for (const step of steps) {
        if (!step.trim()) {
            continue;
        }

        const li = document.createElement("li");
        li.textContent = step;
        stepList.appendChild(li);
    }

    // Swap views
    document.querySelector("#results").hidden = true;
    recipeDetails.hidden = false;

}

app();