// Array for all of our recipies 
let recipies = [];

//Grab Form elements 
const results = document.querySelector("#recipe-container");
const recipeDetails = document.querySelector("#recipe-detail");
const filters = document.querySelector("#filters");

//Variables 
let searchMode = "name";
let currentRecipie;


//Initilize App here 
async function app() {
    document.querySelector("#search-button").addEventListener("click", async () => {
        const search = document.querySelector("#search-input");
        const recipeSearch = search.value;

        try {
            recipies = await fetchData(recipeSearch, search);

            // Update the search for something to get started text 
            const resultStatus = document.querySelector("#results-status");
            resultStatus.textContent = `Result for ${recipeSearch}`;

            //check if we got no results back and display it
            if (recipies === null) {
                results.innerHTML = ""
                document.querySelector("#empty-state").hidden = false;
                document.querySelector("#empty-state h2").textContent = "No recipes match that search";
                document.querySelector("#empty-state p").textContent  = "Try a single ingredient, like 'beef' or 'lemon'"
                return
            }
            //Hide the warning when another search happens
            document.querySelector("#empty-state").hidden = true;
            //Populate the recipies on the page
            populateRecipies();

        } catch(error) {
            results.innerHTML = ""
            document.querySelector("#empty-state").hidden = false;
            document.querySelector("#empty-state h2").textContent = "Something went wrong";
            document.querySelector("#empty-state p").textContent  = "We are unable to reach the API";
            console.error(error);
        } 
        //////////////////////////////////////////////////////////////////////////////
        document.querySelector("#favorite-button").addEventListener("click", () => {
            // 1. Read the saved list (or start with an empty one)
            const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];

            //  Add this recipe if it isn't already saved
            if (!saved.includes(currentRecipie)) {
                saved.push(currentRecipie);
                }

            // Write the whole list back
            localStorage.setItem("savedRecipes", JSON.stringify(saved));
            });
})

    results.addEventListener("click", (event) => {
        //Make sure usre did not click between the cards
        const clickedRecipie = event.target.closest('[data-id]');
        if (!clickedRecipie) {
            return
        }

        //Make sure ID is not null
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
    const activeFilter = event.target.closest("[data-category]");

    if (!activeFilter) {
        return;
    }

    searchMode = activeFilter.dataset.category;

    const currentActive = filters.querySelector(".is-active");
    if (currentActive) {
        currentActive.classList.remove("is-active");
    }
    activeFilter.classList.add("is-active");
});

document.querySelector("#saved-link").addEventListener("click", async (event) => {
    console.log("saved clicked")
    event.preventDefault();

    // Show the results view, even if a recipe was open
    recipeDetails.hidden = true;
    document.querySelector("#results").hidden = false;

    const resultStatus = document.querySelector("#results-status");
    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    // Nothing saved yet
    if (saved.length === 0) {
        results.innerHTML = "";
        resultStatus.textContent = "Nothing saved yet. Open a recipe and hit Save.";
        return;
    }

    // Fetch every saved recipe at once
    const found = await Promise.all(saved.map((id) => fetchRecipeById(id)));

    // Drop any that failed to load
    recipies = found.filter((recipe) => recipe);

    document.querySelector("#empty-state").hidden = true;
    resultStatus.textContent = "Your saved recipes";
    populateRecipies();
});
    

    
}
/////////////////////////////////////////////////

//Get Data Function
async function fetchData(search, searchMode) {
        let base = '';

        switch(searchMode) {
            case 'all':
                 base = "https://www.themealdb.com/api/json/v1/1/search.php?s="
                break;
            case 'Ingredient':
                base = "https://www.themealdb.com/api/json/v1/1/filter.php?i="  
                break;
            case 'Country':
                base = "https://www.themealdb.com/api/json/v1/1/filter.php?a="
                break;
            case 'Category':
                base = "https://www.themealdb.com/api/json/v1/1/filter.php?c="
                break;
            default:
                base = "https://www.themealdb.com/api/json/v1/1/search.php?s="
        }
        
        
        const response = await fetch(`${base}${encodeURIComponent(search)}`)

        if (!response.ok){
            throw new Error(`Response status: ${response.status}`)
        }

        const result = await response.json();
        
        
        return result.meals;
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

async function fullRecipie(id) {
    //save the ID in case they want to use it
    currentRecipie = id;
    
   const foundRecipe = await fetchRecipeById(id);

   if (!foundRecipe) {
    return;
   }

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

async function fetchRecipeById(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result.meals[0];
    } catch (error) {
        console.error(error.message);
    }
}

app();