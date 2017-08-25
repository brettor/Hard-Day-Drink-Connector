var drunkApp = {};

drunkApp.key = `MDo0NWI4N2RkMC04NzZiLTExZTctOWNlZC1jN2M5MTg1ZDM3YjQ6WWtzc2dlWTZGU2JCRDFlNmFncjA2a1pVd3pOemFSUVhjeTdk`;

// a function that gets page number from API
drunkApp.getDrinks = function(){
	// ajax request
	$.ajax({
		url: `https://lcboapi.com/products`,
		headers: {'Authorization':`Token ${drunkApp.key}`},
		method: `GET`,
		data: {
			per_page: 100,
		}
	}).then((res) => {
		var numOfPages = res.pager.total_pages;
		drunkApp.getAllDrinks(numOfPages);
	});
}

// a function that gets the products for each page
drunkApp.getDrinksPerPage = function(pageNumber){
	// ajax request
	return $.ajax({
		url: `https://lcboapi.com/products`,
		headers: {'Authorization':`Token ${drunkApp.key}`},
		method: `GET`,
		data: {
			per_page: 100,
			page: pageNumber 
		}
	});
}

// a function that stores all the ajax data in a single array
drunkApp.getAllDrinks = function(drinkData){
	let allDrinks = [];
	for(let i = 1; i <= drinkData; i++){
		allDrinks.push(drunkApp.getDrinksPerPage(i));
	}
	$.when(...allDrinks)
	.then((...drinks) => {
		drinks = drinks.map((drink) => {
			return drink[0].result;
		});
		const totalDrinks = drinks.reduce((total, amount) => {
		return total.concat(amount);
		}, []);
		drunkApp.events(totalDrinks)
	});
}

// BONUS - "Loading Data..." message until array has fully loaded

// a function that handles events
drunkApp.events = function(data){
	console.log(data);
	var userWeather;
	var userStrength;
	var userEnergy;
	var userCost;
	$(`form`).on(`submit`, function(evt){
		evt.preventDefault();
		userWeather = $(`#weather`).find(`:selected`).data(`drinktype`);
		userStrength = $(`#strength`).find(`:selected`).val();
		userEnergy = $(`#energy`).find(`:selected`).val();
		userCost = $(`#cost`).find(`:selected`).val();
		var filteredDrinks = data.filter(function(item){
			return userWeather === item.primary_category;
		})
		.filter(function(item){
			// if statements
			if (userWeather === `Ready-to-Drink/Coolers` || `Beer`){
				if (userStrength === `good`){
				var strengthMin = 0;
				var strengthMax = 449;
				}
				else if (userStrength === `ok`){
				var strengthMin = 450;
				var strengthMax = 549;
				}
				else if (userStrength === `bad`){
				var strengthMin = 550;
				var strengthMax = 699;
				}
				else {
				var strengthMin = 700;
				var strengthMax = 10000;
				}
				return item.alcohol_content >= strengthMin && item.alcohol_content <= strengthMax;
			}
			else if (userWeather === `Wine`){
				if (userStrength === `good`){
				var strengthMin = 0;
				var strengthMax = 999;
				}
				else if (userStrength === `ok`){
				var strengthMin = 1000;
				var strengthMax = 1199;
				}
				else if (userStrength === `bad`){
				var strengthMin = 1200;
				var strengthMax = 1499;
				}
				else {
				var strengthMin = 1500;
				var strengthMax = 10000;
				}
				return item.alcohol_content >= strengthMin && item.alcohol_content <= strengthMax;
			}
			else {
				if (userStrength === `good`){
				var strengthMin = 0;
				var strengthMax = 2499;
				}
				else if (userStrength === `ok`){
				var strengthMin = 2500;
				var strengthMax = 3999;
				}
				else if (userStrength === `bad`){
				var strengthMin = 4000;
				var strengthMax = 4999;
				}
				else {
				var strengthMin = 5000;
				var strengthMax = 10000;
				}
				return item.alcohol_content >= strengthMin && item.alcohol_content <= strengthMax;
			}
		})
		.filter(function(item){
			if (userEnergy === `late`){
				var energyMin = 0;
				var energyMax = 375;
				}
				else if (userEnergy === `ontime`){
				var energyMin = 376;
				var energyMax = 750;
				}
				else if (userEnergy === `early`){
				var energyMin = 751;
				var energyMax = 1140;
				}
				else {
				var energyMin = 1141;
				var energyMax = 100000;
				}
			return item.package_unit_volume_in_milliliters >= energyMin && item.package_unit_volume_in_milliliters <= energyMax;
		})
		.filter(function(item){
			if (userCost === `destitute`){
				var costMin = 0;
				var costMax = 999;
				}
				else if (userEnergy === `poor`){
				var costMin = 1000;
				var costMax = 1499;
				}
				else if (userEnergy === `gettingby`){
				var costMin = 1500;
				var costMax = 2499;
				}
				else {
				var costMin = 2500;
				var costMax = 25000000;
				}
			return item.price_per_liter_in_cents >= costMin && item.price_per_liter_in_cents <= costMax;
		});
		console.log(filteredDrinks);
	});
}

// BONUS - a function that generates an image on the page based on responses
// light day drinks with friends, feelin' tipsy, it's gonna be one of those nights etc.

// a function that initializes our code
drunkApp.init = function(){
	drunkApp.getDrinks();
}

// document ready
$(function(){
	drunkApp.init();
});