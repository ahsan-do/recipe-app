const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';


export const MealAPI = {
    searchMealsByName: async (query) => {
        try {
            const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
            const data = await response.json()
            return data.meals || []
        }catch (err) {
            console.error("Error searching meals by name",err)
            return []
        }
    },
    getMealById: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
            const data = await response.json()
            return data.meals ? data.meals[0] : null;
        }catch (err){
            console.error("Error getting meal by id",err)
            return null;
        }
    },
    getRandomMeal: async () => {
        try {
            const response = await fetch(`${BASE_URL}/random.php`)
            const data = await response.json()
            return data.meals ? data.meals[0] : null;
        }catch (err){
            console.error("Error getting random meal",err)
            return null;
        }
    },
    getRandomMeals: async (count=6) => {
        try{
            const promises = Array(count)
                .fill(0)
                .map(() => MealAPI.getRandomMeal())
            const meals = await Promise.all(promises)
            return meals.filter((meal) => meal !== null)
        }catch(err){
            console.error("Error getting random meals",err)
            return [];
        }
    },
    getCategories: async () => {
        try {
            const response = await fetch(`${BASE_URL}/categories.php`)
            const data = await response.json()
            return data.categories || []
        }catch (err) {
            console.error("Error getting categories",err)
            return []
        }
    },
    filterByIngredient: async (ingredient) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
            const data = await response.json();
            return data.meals || [];
        }catch (err) {
            console.error("Error filtering by ingredient",err);
            return [];
        }
    },
    filterByCategory: async (category) => {
        try {
            const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
            const data = await response.json();
            return data.meals || [];
        }catch (err) {
            console.error("Error filtering by category",err);
            return [];
        }
    },
    transformMealData: (meal) => {
        if(!meal) return null;

        const ingredients = [];
        for(let i = 1; i <= 20; i++){
            const ingredient = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]
            if(ingredient && ingredient.trim()){
                const measureText = measure && measure.trim() ? `(${measure})` : '';
                ingredients.push(`${measureText}${ingredient.trim()}`)
            }
        }

        const instructions = meal.strInstructions
        ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
            : [];

        return{
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions
            ? meal.strInstructions.substring(0, 120) + '...'
                : "Delicious meal from TheMealDB",
            image: meal.strMealThumb,
            cookTime: "30 minutes",
            servings: 4,
            category: meal.strCategory || "Main Course",
            area: meal.strArea,
            ingredients,
            instructions,
            originalDate: meal,
        }
    }
}