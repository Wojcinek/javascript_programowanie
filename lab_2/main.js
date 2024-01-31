let currentSlide = 0
const slides = document.querySelectorAll('.slide')
const slider = document.querySelector('.slider')
const totalSlides = slides.length
const intervalTime = 3000
let slideInterval
const dots = document.querySelectorAll('.dot')
const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')
const btnPause = document.querySelector('.btn-pause')
const btnStart = document.querySelector('.btn-start')

function showSlide(index) {
	if (slider) {
		if (index < 0) {
			currentSlide = totalSlides - 1
		} else if (index >= totalSlides) {
			currentSlide = 0
		} else {
			currentSlide = index
		}

		const newTransformValue = -currentSlide * 100 + '%'

		slider.style.transform = 'translateX(' + newTransformValue + ')'
		toggleActiveDot(currentSlide)
	}
}

function startInterval() {
	slideInterval = setInterval(nextSlide, intervalTime)
}

function resetInterval() {
	clearInterval(slideInterval)
	startInterval()
}

function pauseInterval() {
	clearInterval(slideInterval)
}

function nextSlide() {
	showSlide(currentSlide + 1)
}

function toggleActiveDot(currentSlide) {
	dots.forEach(function (dot, index) {
		var isActive = index === currentSlide
		dot.classList.toggle('activeDot', isActive)
	})
}

function navigateToClickedSlide() {
	dots.forEach(function (dot, index) {
		dot.addEventListener('click', function () {
			showSlide(index)
		})
	})
	slider.style.transform = 'translateX(0%)'
}

function navigateToThePrev() {
	btnPrev.addEventListener('click', function () {
		showSlide(currentSlide - 1)
	})
	slider.style.transform = 'translateX(0%)'
}

function navigateToTheNext() {
	btnNext.addEventListener('click', function () {
		showSlide(currentSlide + 1)
	})
	slider.style.transform = 'translateX(0%)'
}

btnPause.addEventListener('click', function () {
	pauseInterval()
})

btnStart.addEventListener('click', function () {
	startInterval()
})

startInterval()
navigateToClickedSlide()
navigateToThePrev()
navigateToTheNext()
