document.addEventListener('keypress', onKeyPress)

const KeyToSound = {
	a: document.querySelector('#s1'),
	s: document.querySelector('#s2'),
	d: document.querySelector('#s3'),
	f: document.querySelector('#s4'),
	g: document.querySelector('#s5'),
	h: document.querySelector('#s6'),
	j: document.querySelector('#s7'),
	k: document.querySelector('#s8'),
	l: document.querySelector('#s9'),
}

const channel1 = document.querySelector('#recAudio1')
const channel2 = document.querySelector('#recAudio2')
const channel3 = document.querySelector('#recAudio3')
const channel4 = document.querySelector('#recAudio4')

let isRec1 = false
let isRec2 = false
let isRec3 = false
let isRec4 = false
let recSounds1 = []
let recSounds2 = []
let recSounds3 = []
let recSounds4 = []
let isPlaying = false
let intervalId

document.getElementById('startRec').addEventListener('click', startRec1)
document.getElementById('stopRec').addEventListener('click', stopRec1)
document.getElementById('playRec').addEventListener('click', playRec1)

document.getElementById('startRec2').addEventListener('click', startRec2)
document.getElementById('stopRec2').addEventListener('click', stopRec2)
document.getElementById('playRec2').addEventListener('click', playRec2)

document.getElementById('startRec3').addEventListener('click', startRec3)
document.getElementById('stopRec3').addEventListener('click', stopRec3)
document.getElementById('playRec3').addEventListener('click', playRec3)

document.getElementById('startRec4').addEventListener('click', startRec4)
document.getElementById('stopRec4').addEventListener('click', stopRec4)
document.getElementById('playRec4').addEventListener('click', playRec4)

const bpmInput = document.querySelector('#bpm')
const metronomeBtn = document.querySelector('#metronome')

function onKeyPress(event) {
	const sound = KeyToSound[event.key]
	playSound(sound)

	if (isRec1) {
		recSounds1.push({ key: event.key, time: Date.now() })
	}

	if (isRec2) {
		recSounds2.push({ key: event.key, time: Date.now() })
	}

	if (isRec3) {
		recSounds3.push({ key: event.key, time: Date.now() })
	}

	if (isRec4) {
		recSounds4.push({ key: event.key, time: Date.now() })
	}
}

function playSound(sound) {
	if (sound) {
		sound.currentTime = 0
		sound.play()
	}
}

function startRec1() {
	isRec1 = true
	recSounds1 = []
}

function stopRec1() {
	isRec1 = false
}

function playRec1() {
	channel1.src = ''
	playRec(channel1, recSounds1)
}

function startRec2() {
	isRec2 = true
	recSounds2 = []
}

function stopRec2() {
	isRec2 = false
}

function playRec2() {
	channel2.src = ''
	playRec(channel2, recSounds2)
}

function startRec3() {
	isRec3 = true
	recSounds3 = []
}

function stopRec3() {
	isRec2 = false
}

function playRec3() {
	channel3.src = ''
	playRec(channel3, recSounds3)
}

function startRec4() {
	isRec4 = true
	recSounds4 = []
}

function stopRec4() {
	isRec4 = false
}

function playRec4() {
	channel4.src = ''
	playRec(channel4, recSounds4)
}

function playRec(channel, recSounds) {
	recSounds.forEach((rec, index) => {
		setTimeout(
			() => {
				playSound(KeyToSound[rec.key])
			},
			index === 0 ? 0 : rec.time - recSounds[0].time
		)
	})

	setTimeout(() => {
		const blobData = recSounds.map(() => KeyToSound[recSounds[0].key].blob)
		const blob = new Blob(blobData, { type: 'audio/wav' })
		channel.src = URL.createObjectURL(blob)
	}, recSounds[recSounds.length - 1].time - recSounds[0].time)
}

document.getElementById('playAll').addEventListener('click', playAll)
function playAll() {
	playRec(channel1, recSounds1)
	playRec(channel2, recSounds2)
	playRec(channel3, recSounds3)
	playRec(channel4, recSounds4)
}

document.getElementById('startStopButton').addEventListener('click', function () {
	if (isPlaying) {
		stopMetronome()
	} else {
		startMetronome()
	}
})

function startMetronome() {
	const bpmInput = document.getElementById('bpmInput')
	const bpm = parseInt(bpmInput.value, 10)

	if (isNaN(bpm) || bpm <= 0) {
		alert('Please enter a valid BPM value.')
		return
	}

	const interval = 60000 / bpm

	intervalId = setInterval(() => {
		playSound(KeyToSound['g'])
		console.log('Tick')
	}, interval)

	isPlaying = true
	document.getElementById('startStopButton').textContent = 'Stop'
	bpmInput.disabled = true
}

function stopMetronome() {
	clearInterval(intervalId)
	isPlaying = false
	document.getElementById('startStopButton').textContent = 'Start'
	document.getElementById('bpmInput').disabled = false
}
