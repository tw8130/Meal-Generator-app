const get_meal_btn = document.getElementById('get_meal');
const meal_container = document.getElementById('meal');

// add an event listner
get_meal_btn.addEventListener('click',()=> {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php') //[fetch] is used to do the request which is a [GET request] from  the API url to get a promise
    .then(res => res.json()) 
    .then(res => {
        createMeal(res.meals[0]);//item for the [meals] array that is returned by the API is passed at index [0] into our [createMeal] function
    })
    .catch(e => {
        console.warn(e)
    });
});

//the [createMeal] function purpose is to get the JSON response,parse it,and transform it into an HTML component
const createMeal = meal => {
	const ingredients = [];

	// Get all ingredients from the object. Up to 20
	for (let i = 1; i <= 20; i++) { 
		if (meal[`strIngredient${i}`]) { //check if the [meal] has that corresponding [ingredient-measure] pair
			ingredients.push( 
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			// Stop if there are no more ingredients
			break;
		}
    }
    
    //we are parsing the remaining properties[category and area] to be displayed into the [newInnerHTML]  string to hold the entire HTML markup
	const newInnerHTML = `
		<div class="row">
			<div class="columns five">
				<img src="${meal.strMealThumb}" alt="Meal Image">
				${
					meal.strCategory
						? `<p><strong>Category:</strong> ${meal.strCategory}</p>`
						: ''
				}
				${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ''}
				${
					meal.strTags
						? `<p><strong>Tags:</strong> ${meal.strTags //tags come in a string so we have to [split] it by a comma and [join] it back by a comma and space for neatness
								.split(',')
								.join(', ')}</p>`
						: ''
				}
				<h5>Ingredients:</h5>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')} //to show the ingredients we map over the array by creating a list[li] for each ingredient/measure pair.Then use [join] to change the array back to form a string
				</ul>
			</div>
			<div class="columns seven">
				<h4>${meal.strMeal}</h4>
				<ul>
				 <li>${meal.strInstructions}</liv> </ul>
			</div>
		</div>
		${
			meal.strYoutube //string that is returning the URL of the video.To embed the video in the page we use [slice(-11)] to get the last 11 characters of the string to extract the video ID only.
				? `
		<div class="row">
			<h5>Video Recipe</h5>
			<div class="videoWrapper">
				<iframe width="420" height="315"
				src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
				</iframe>
			</div>
		</div>`
				: ''
		}
	`;

	meal_container.innerHTML = newInnerHTML; // setting this newInnerHTML to be the meal-container's innerHTML to populate that div with all this information
};

