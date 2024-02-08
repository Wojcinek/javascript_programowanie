const canvas = document.getElementById('canvas')
const attractionForce = 0.001
const repulsionForce = 0.005
const ctx = canvas.getContext('2d')
const startButton = document.getElementById('startButton')
const resetButton = document.getElementById('resetButton')
const X = 20
const Y = 50
let balls = []

const times = []

function Ball(x, y, dx, dy, radius, color) {
	this.x = x
	this.y = y
	this.dx = dx
	this.dy = dy
	this.radius = radius
	this.color = color

	this.draw = function () {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = this.color
		ctx.fill()
		ctx.closePath()
	}

	this.update = function () {
		if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
			this.dx = -this.dx
		}
		if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
			this.dy = -this.dy
		}
		this.x += this.dx
		this.y += this.dy
		this.draw()
	}
}

function startSimulation() {
	balls = []
	for (let i = 0; i < X; i++) {
		let radius = 10
		let x = Math.random() * (canvas.width - radius * 2) + radius
		let y = Math.random() * (canvas.height - radius * 2) + radius
		let dx = (Math.random() - 0.5) * 2
		let dy = (Math.random() - 0.5) * 2
		let color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
		balls.push(new Ball(x, y, dx, dy, radius, color))
	}
	animate()
	canvas.addEventListener('click', onClick)
	canvas.addEventListener('mousemove', onMouseMove)
}

function resetSimulation() {
	cancelAnimationFrame(animationId)
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	canvas.removeEventListener('click', onClick)
	canvas.removeEventListener('mousemove', onMouseMove)
}

function distance(ball1, ball2) {
	return Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2)
}

function drawLine(ball1, ball2) {
	ctx.beginPath()
	ctx.moveTo(ball1.x, ball1.y)
	ctx.lineTo(ball2.x, ball2.y)
	ctx.strokeStyle = 'black'
	ctx.stroke()
	ctx.closePath()
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < balls.length; i++) {
		balls[i].update()
		for (let j = i + 1; j < balls.length; j++) {
			if (distance(balls[i], balls[j]) < Y) {
				drawLine(balls[i], balls[j])
			}
		}
	}
	animationId = requestAnimationFrame(animate)
	countFps()
}

function onClick(event) {
	const rect = canvas.getBoundingClientRect()
	const mouseX = event.clientX - rect.left
	const mouseY = event.clientY - rect.top
	for (let i = 0; i < balls.length; i++) {
		const dist = distance({ x: mouseX, y: mouseY }, balls[i])
		if (dist <= balls[i].radius) {
			balls.splice(i, 1)
			let radius = 10
			let x1 = Math.random() * (canvas.width - radius * 2) + radius
			let y1 = Math.random() * (canvas.height - radius * 2) + radius
			let dx1 = (Math.random() - 0.5) * 2
			let dy1 = (Math.random() - 0.5) * 2
			let color1 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
			balls.push(new Ball(x1, y1, dx1, dy1, radius, color1))
			let x2 = Math.random() * (canvas.width - radius * 2) + radius
			let y2 = Math.random() * (canvas.height - radius * 2) + radius
			let dx2 = (Math.random() - 0.5) * 2
			let dy2 = (Math.random() - 0.5) * 2
			let color2 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
			balls.push(new Ball(x2, y2, dx2, dy2, radius, color2))
			break
		}
	}
}

function onMouseMove(event) {
	const rect = canvas.getBoundingClientRect()
	const mouseX = event.clientX - rect.left
	const mouseY = event.clientY - rect.top
	for (let i = 0; i < balls.length; i++) {
		const dist = distance({ x: mouseX, y: mouseY }, balls[i])
		const angle = Math.atan2(mouseY - balls[i].y, mouseX - balls[i].x)
		if (dist <= balls[i].radius * 3) {
			balls[i].dx += Math.cos(angle) * (attractionForce * (balls[i].radius * 3 - dist))
			balls[i].dy += Math.sin(angle) * (attractionForce * (balls[i].radius * 3 - dist))
		} else if (dist <= balls[i].radius * 5) {
			balls[i].dx -= Math.cos(angle) * (repulsionForce * (balls[i].radius * 5 - dist))
			balls[i].dy -= Math.sin(angle) * (repulsionForce * (balls[i].radius * 5 - dist))
		}
	}
}

startButton.addEventListener('click', startSimulation)
resetButton.addEventListener('click', resetSimulation)

function countFps() {
	var now = performance.now()
	while (times.length > 0 && times[0] <= now - 1000) {
		times.shift()
	}
	times.push(now)
	var fps = times.length
	console.log(fps)
}
