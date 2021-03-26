const meals = document.getElementById("meals")
const favContainer = document.getElementById('fav-meal')
const searchTerm = document.getElementById('search-term')
const searchBtn  = document.getElementById('search')


getRandomMeal()
fetchmealsById()

async function getRandomMeal() {
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    const mealResponse = await resp.json()
    randomMeals = mealResponse.meals[0]
    console.log(randomMeals);
    addMeal(randomMeals, true)
}


async function getMealsById(id) {
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i= ` + id)

    const mealResponse = await resp.json()
    meal = mealResponse.meals[0]
    return meal
}

async function getMealsBySearch(term) {
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s= ` + term)

    const mealResponse = await resp.json();
    meal = mealResponse.meals;
    return meal;
}






function addMeal(mealData, random = false) {
    const meal = document.createElement('div')
    meal.classList.add('meal')

    meal.innerHTML = ` 
    <div class="meal-header">
        ${
            random ? ` <span class="random">Random Recipe</span>`: ""
        }
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="favBtn "><i class="fas fa-heart"></i></button>
    </div>`

    const btn = meal.querySelector('.meal-body .favBtn')
    btn.addEventListener('click', function (e) {
        if (btn.classList.contains('active')) {
            removeMealToLs(mealData.idMeal);
            btn.classList.remove('active')
        } else {
            addMealToLs(mealData.idMeal);
            btn.classList.add('active');
        }


        fetchmealsById()
    })

    meals.appendChild(meal)

}


function addMealToLs(mealId) {
    const mealIds = getMealToLs()

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealToLs(mealId) {
    const mealIds = getMealToLs()

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))
}

function getMealToLs() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))
    console.log(mealIds);
    return mealIds === null ? [] : mealIds;

}



async function fetchmealsById() {
    favContainer.innerHTML = ""
    let mealIds = getMealToLs()


    for (i = 0; i < mealIds.length; i++) {
        let mealId = mealIds[i];
        meal = await getMealsById(mealId)

        addFavmeal(meal)
    }
}


function addFavmeal(mealData) {
    const favMeal = document.createElement('li')


    favMeal.innerHTML = ` 
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
        <button class="clear ><i class="fas fa-window-close"></i></button>
        `;
    const btn = favMeal.querySelector('.clear')

    btn.addEventListener('click',function(){
        removeMealToLs(mealData.idMeal)

        fetchmealsById()
    })

    favContainer.appendChild(favMeal)

}

searchBtn.addEventListener('click', async () => {
    meals.innerHTML=''
    
    const search = searchTerm.value
    const meal= await getMealsBySearch(search); 
    if(meal){
        
        meal.forEach((meal)=>{
            addMeal(meal)
        })
    }
   
})