const addInput = document.querySelector('#add input')
const addBtn = document.querySelector('#add button')
const error = document.querySelector('#Error')
const cityweatherContainer = document.querySelector('#CityWeatherContainer')
const apiKey = 'aece0fab3a965ff5d5819b0efb5ca500'
const citiesStorage = 'cities'

renderCitiesFromStorage()

addBtn.addEventListener('click', handleAddCity)
addInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault()
		handleAddCity()
	}
})

async function handleAddCity() {
	error.textContent = ''
	const city = addInput.value
	let cityCoordinates
	try {
		cityCoordinates = await fetchCityCoordinates(city)
		addCityToStorage(cityCoordinates)
		renderCitiesFromStorage()
	} catch (e) {
		error.textContent = 'City not found'
	}
}

async function fetchCityCoordinates(city) {
	const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`
	const response = await fetch(url)
	const data = await response.json()
	if (data.length === 0) {
		throw new Error('City not found')
	}
	return { city: data[0].name, lat: data[0].lat, lon: data[0].lon }
}

async function renderCitiesFromStorage() {
	cityweatherContainer.innerHTML = ''
	const cities = JSON.parse(localStorage.getItem(citiesStorage)) || []
	for (const city of cities) {
		try {
			const cityWeather = await fetchWeatherData(city.lat, city.lon)
			const cityElement = createCityElement(city, cityWeather)
			cityweatherContainer.appendChild(cityElement)
		} catch (error) {
			console.error(error)
		}
	}
}

function createCityElement(city, weatherData) {
	const cityDiv = document.createElement('div')
	cityDiv.classList.add('city')

	const cityName = document.createElement('h2')
	cityName.textContent = city.city
	cityDiv.appendChild(cityName)

	const iconDiv = document.createElement('div')
	const icon = document.createElement('img')
	icon.src = weatherData.icon
	iconDiv.appendChild(icon)
	cityDiv.appendChild(iconDiv)

	const description = document.createElement('p')
	description.textContent = weatherData.description
	cityDiv.appendChild(description)

	const temperature = document.createElement('p')
	temperature.textContent = `${weatherData.temp.toFixed(1)}°C`
	cityDiv.appendChild(temperature)

	const humidity = document.createElement('p')
	humidity.textContent = `Humidity: ${weatherData.humidity}%`
	cityDiv.appendChild(humidity)

	const removeBtn = document.createElement('button')
	removeBtn.textContent = 'Remove'
	removeBtn.addEventListener('click', () => {
		removeCityFromStorage(city.city)
		renderCitiesFromStorage()
	})
	cityDiv.appendChild(removeBtn)

	return cityDiv
}

function addCityToStorage(city) {
	const cities = JSON.parse(localStorage.getItem(citiesStorage)) || []
	if (cities.some((c) => c.city === city.city)) {
		error.textContent = 'City already added'
		return
	}
	if (cities.length >= 10) {
		error.textContent = 'You can add only 10 cities'
		return
	}
	cities.push(city)
	localStorage.setItem(citiesStorage, JSON.stringify(cities))
}

function removeCityFromStorage(city) {
	const cities = JSON.parse(localStorage.getItem(citiesStorage)) || []
	const index = cities.findIndex((c) => c.city === city)
	cities.splice(index, 1)
	localStorage.setItem(citiesStorage, JSON.stringify(cities))
}

async function fetchWeatherData(lat, lon) {
	const url = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`
	const response = await fetch(url)
	const data = await response.json()
	return {
		temp: data.main.temp,
		description: data.weather[0].description,
		icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
		humidity: data.main.humidity,
	}
}
