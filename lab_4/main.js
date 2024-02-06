const createNoteContainer = document.getElementById('create-note-container')
const closeFormBtn = document.getElementById('close-form-btn')
const notesList = document.getElementById('notes-list')
const createNote = document.getElementById('create-note')
const savedNotes = JSON.parse(localStorage.getItem('notes')) || []

displayNotes(savedNotes)

createNote.addEventListener('submit', function (event) {
	event.preventDefault()

	const title = document.getElementById('title').value
	const content = document.getElementById('content').value
	const selectedColor = document.getElementById('color').value

	const newNote = { id: Date.now(), title, content, color: selectedColor }

	savedNotes.push(newNote)

	localStorage.setItem('notes', JSON.stringify(savedNotes))
	displayNotes(savedNotes)

	document.getElementById('title').value = ''
	document.getElementById('content').value = ''
})

function deleteNoteById(noteId) {
	const indexToDelete = savedNotes.findIndex((note) => note.id === noteId)

	if (indexToDelete !== -1) {
		savedNotes.splice(indexToDelete, 1)

		localStorage.setItem('notes', JSON.stringify(savedNotes))
		displayNotes(savedNotes)
	}
}

function editNoteById(noteId) {
	const noteToEdit = savedNotes.find((note) => note.id === noteId)

	if (noteToEdit) {
		showEditForm(noteToEdit)
	}
}

function showEditForm(note) {
	const editFormContainer = document.getElementById('edit-note-container')

	document.getElementById('edit-title').value = note.title
	document.getElementById('edit-content').value = note.content

	editFormContainer.style.display = 'flex'

	document.getElementById('edit-note').addEventListener('submit', function (event) {
		event.preventDefault()

		const updatedTitle = document.getElementById('edit-title').value
		const updatedContent = document.getElementById('edit-content').value

		const index = savedNotes.findIndex((n) => n.id === note.id)
		if (index !== -1) {
			savedNotes[index].title = updatedTitle
			savedNotes[index].content = updatedContent

			localStorage.setItem('notes', JSON.stringify(savedNotes))

			displayNotes(savedNotes)
			editFormContainer.style.display = 'none'
		}
	})
}

function displayNotes(notes) {
	notesList.innerHTML = ''

	notes.forEach(function (note) {
		const listItem = document.createElement('li')
		const divItem = document.createElement('div')
		const h2Item = document.createElement('h2')
		const pItem = document.createElement('p')
		const delBtn = document.createElement('button')
		const editBtn = document.createElement('button')
		const favBtn = document.createElement('button')
		const dateNow = document.createElement('p')

		listItem.className = 'note-in-list'

		h2Item.textContent = note?.title
		pItem.textContent = note?.content
		delBtn.textContent = 'Delete note'
		editBtn.textContent = 'Edit note'
		favBtn.textContent = 'Favourite'
		dateNow.textContent = dateForm(note.id)

		console.log(note.title)

		listItem.style.backgroundColor = note.color

		delBtn.addEventListener('click', function () {
			deleteNoteById(note.id)
		})

		editBtn.addEventListener('click', function () {
			editNoteById(note.id)
		})

		favBtn.addEventListener('click', function () {
			savedNotes.unshift(savedNotes.splice(savedNotes.indexOf(note), 1)[0])

			localStorage.setItem('notes', JSON.stringify(savedNotes))
			displayNotes(savedNotes)
		})

		listItem.appendChild(divItem)
		divItem.appendChild(h2Item)
		divItem.appendChild(pItem)
		divItem.appendChild(delBtn)
		divItem.appendChild(editBtn)
		divItem.appendChild(favBtn)
		divItem.appendChild(dateNow)
		notesList.appendChild(listItem)
	})
}

function dateForm(time) {
	const date = new Date(time)
	return date.toLocaleString()
}
