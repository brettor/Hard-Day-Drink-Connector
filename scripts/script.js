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
	var userSize;
	var userCost;
	$(`form`).on(`submit`, function(evt){
		evt.preventDefault();
		userWeather = $(`#weather`).find(`:selected`).data(`drinktype`);
		userStrength = $(`#strength`).find(`:selected`).val();
		userSize = $(`#size`).find(`:selected`).val();
		userCost = $(`#cost`).find(`:selected`).val();
		var filteredDrinks = data
		.filter(function(item){
			return userWeather === item.primary_category;
		})
		.filter(function(item){
			// if statements
			if (userWeather === `Ready-to-Drink/Coolers`){
				if (userStrength === `good`){
				var strengthMin = 0;
				var strengthMax = 400;
				}
				else if (userStrength === `ok`){
				var strengthMin = 401;
				var strengthMax = 500;
				}
				else if (userStrength === `bad`){
				var strengthMin = 501;
				var strengthMax = 699;
				}
				else {
				var strengthMin = 701;
				var strengthMax = 2000;
				}
				return item.alcohol_content >= strengthMin && item.alcohol_content <= strengthMax;
			}
			else if (userWeather === `Beer`){
				if (userStrength === `good`){
				var strengthMin = 0;
				var strengthMax = 450;
				}
				else if (userStrength === `ok`){
				var strengthMin = 451;
				var strengthMax = 549;
				}
				else if (userStrength === `bad`){
				var strengthMin = 550;
				var strengthMax = 700;
				}
				else {
				var strengthMin = 701;
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
				var strengthMax = 2500;
				}
				else if (userStrength === `ok`){
				var strengthMin = 2501;
				var strengthMax = 3499;
				}
				else if (userStrength === `bad`){
				var strengthMin = 3500;
				var strengthMax = 4499;
				}
				else {
				var strengthMin = 4500;
				var strengthMax = 10000;
				}
				return item.alcohol_content >= strengthMin && item.alcohol_content <= strengthMax;
			}
		})
		.filter(function(item){
			if (userWeather === `Ready-to-Drink/Coolers` || `Beer`){
				if (userSize === `late`){
				var sizeMin = 0;
				var sizeMax = 400;
				}
				else if (userSize === `ontime`){
				var sizeMin = 401;
				var sizeMax = 499;
				}
				else if (userSize === `early`){
				var sizeMin = 500;
				var sizeMax = 699;
				}
				else {
				var sizeMin = 700;
				var sizeMax = 1000;
				}
				return item.package_unit_volume_in_milliliters >= sizeMin && item.package_unit_volume_in_milliliters <= sizeMax;
			}
			else {
				if (userSize === `late`){
				var sizeMin = 0;
				var sizeMax = 375;
				}
				else if (userSize === `ontime`){
				var sizeMin = 376;
				var sizeMax = 750;
				}
				else if (userSize === `early`){
				var sizeMin = 751;
				var sizeMax = 1140;
				}
				else {
				var sizeMin = 1141;
				var sizeMax = 100000;
				}
				return item.package_unit_volume_in_milliliters >= sizeMin && item.package_unit_volume_in_milliliters <= sizeMax;
			}
		})
		.filter(function(item){
			if (userCost === `destitute`){
			var costMin = 0;
			var costMax = 1349;
			}
			else if (userCost === `poor`){
			var costMin = 1350;
			var costMax = 1749;
			}
			else if (userCost === `gettingby`){
			var costMin = 1750;
			var costMax = 2499;
			}
			else {
			var costMin = 2500;
			var costMax = 10000000;
			}
			return item.price_per_liter_of_alcohol_in_cents >= costMin && item.price_per_liter_of_alcohol_in_cents <= costMax;
		});
		// return one product
		if(filteredDrinks.length === 0){
			drunkApp.selection = data[Math.floor(Math.random()*data.length)];
		}
		else{
			drunkApp.selection = filteredDrinks[Math.floor(Math.random()*filteredDrinks.length)];
		}
		drunkApp.display(drunkApp.selection);
	});
}

// a function that displays the information about the selected product
drunkApp.display = function(selectedProduct){
	$(`form`).addClass(`hidden`);
	drunkApp.getUserLocation();
	var displayText = $(`<h2>`).text(`Your suggested drink for this hard day is:`)
	var selectedImage = $(`<img>`).attr(`src`, selectedProduct.image_url);
	var selectedName = $(`<h2>`).text(selectedProduct.name);
	var selectedSize = $(`<h3>`).text(selectedProduct.package);
	var displayLocation = $(`<h2>`).text(`Nearby stores with this drink in stock are:`)
	var googleMap = $(`<div>`).attr(`id`, `map`);
	var resultOne = $(`<div>`).addClass(`productOne`).append(displayText, selectedImage, selectedName, selectedSize);
	var resultTwo = $(`<div>`).addClass(`productTwo`).append(displayText, googleMap);
	var tryButton = $(`<button>`).addClass(`generate`);
	$(`section`).append(resultOne, resultTwo, tryButton);
}

// a function that grabs the user's location
drunkApp.getUserLocation = function(){
	navigator.geolocation.getCurrentPosition(function(position){
		drunkApp.userLocation = (position.coords);
		drunkApp.getStores(position);
	});
}

// a function that finds lcbos nearby with drunkApp.selection
drunkApp.getStores = function(position){
	var userLat = position.coords.latitude;
	var userLon = position.coords.longitude;
	var productId = drunkApp.selection.id;
	$.ajax({
		url: `https://lcboapi.com/stores?lat=${userLat}&lon=${userLon}&product_id=${productId}`,
		headers: {'Authorization':`Token ${drunkApp.key}`},
		method: `GET`,
	})
	.then((res) => {
		drunkApp.nearbyStores = res.result.slice(0, 3);
		initMap();
	});
}

function initMap() {
	var userLoc = {};
	userLoc.lat = drunkApp.userLocation.latitude;
	userLoc.lng = drunkApp.userLocation.longitude;
	var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 12,
	center: userLoc
	});
	var marker;
	for(var i = 0; i < drunkApp.nearbyStores.length; i++){
		var coordinates = {
			lat: drunkApp.nearbyStores[i].latitude,
			lng: drunkApp.nearbyStores[i].longitude,
		};
		marker = new google.maps.Marker({
			position: coordinates,
			map: map
		});
	}
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