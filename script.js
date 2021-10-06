const selectedNotes = [];

window.onload = function () {
    if (!isStorageEmpty()) {
        loadSavedNotes();
        clearNoteSession();
    }
}

document.getElementById('note-form').oninput = () => {
    window.sessionStorage.setItem('creating', 'true')
}

const submitBtn = document.getElementById('submitBtn');

submitBtn.onclick = () => {
    const noteId = getNoteId();
    if (noteId === null) {
        alert('Browser does not supports localStorage. Unable to create a new note.')
        return
    }

    createNoteSession(noteId);

    if (isNoteEmpty()) {
        alert('Can not save an empty note!');
        return
    }

    saveNoteToStorage();
    displayNote();

    clearNoteSession();
    clearForm();
}

function displayNote() {
    const id = window.sessionStorage.getItem('id');

    let noteView = createNoteView(id);
    attachDataToView(noteView);
    attachNoteClickListener(noteView);
    document.getElementById('notes-list').appendChild(noteView);
}

function clearNoteSession() {
    window.sessionStorage.clear();
}

function saveNoteToStorage() {
    const id = window.sessionStorage.getItem('id');
    const text = window.sessionStorage.getItem('text');
    const title = window.sessionStorage.getItem('title');

    console.log(title + ':' + text);

    window.localStorage.setItem(id, title + ':' + text);
}

function loadSavedNotes() {
    Object.keys(window.localStorage).forEach(function (key) {
        if (key !== 'row-key') {
            const note = window.localStorage.getItem(key);
            const noteFields = note.split(':');
    
            saveNoteToSession(key, noteFields[0], noteFields[1]);
            displayNote();
        }
    });
}

function isStorageEmpty() {
    if (!browserHasStorage()) {
        alert('Browser does not have storage. Notes can not be created!');
        return
    }

    return window.localStorage.length === 0;
}

function attachNoteClickListener(noteItem) {
    noteItem.onclick = () => {
        const item = document.getElementById(noteItem.id);

        const isSelected = item.getAttribute('rel');
        if (isSelected === '1') {
            removeSelectedItem(item.id);

            item.style.border = 'none';
            item.setAttribute('rel', '0');
            return
        }

        addSelectedItem(item.id)

        item.setAttribute('rel', '1');
        item.style.border = '2.5px solid #212121';
    }
}

function removeSelectedItem(id) {
    const index = selectedNotes.indexOf(id);
    if (index !== -1) {
        selectedNotes.splice(index, 1);
    }
}

function addSelectedItem(id) {
    selectedNotes.push(id);
}

function clearForm() {
    window.sessionStorage.setItem('creating', 'false');

    document.getElementById('note-form').reset();
}

function isNoteEmpty() {
    let text = window.sessionStorage.getItem('text');
    let title = window.sessionStorage.getItem('title');

    return text.length === 0 && title.length === 0;
}

function browserHasStorage() {
    return !(typeof (Storage) === 'undefined');
}

function getNoteId() {
    if (!browserHasStorage()) {
        return null;
    }

    let key = window.localStorage.getItem('row-key');

    if (!key) {
        window.localStorage.setItem('row-key', '0')
    }

    key = window.localStorage.getItem('row-key');
    window.localStorage.setItem('row-key', ++key);

    return key++;
}

function createNoteSession(noteId) {
    let formTitle = document.querySelector('#note-title').value.trim();
    let formText = document.querySelector('#note-text').value.trim();

    saveNoteToSession(noteId, formTitle, formText);
}

function saveNoteToSession(id, title, text) {
    window.sessionStorage.setItem('id', id);
    window.sessionStorage.setItem('text', text);
    window.sessionStorage.setItem('title', title);
}

function createNoteView(id) {
    const textView = document.createElement('p');
    const titleView = document.createElement('p');
    const noteContainer = document.createElement('div');

    textView.classList.add('text');
    titleView.classList.add('title');
    noteContainer.classList.add('note');

    textView.style.wordBreak = 'break-word';
    titleView.style.wordBreak = 'break-word';
    titleView.style.fontWeight = 'bold';

    noteContainer.id = id;
    noteContainer.setAttribute('rel', '0');

    noteContainer.appendChild(titleView);
    noteContainer.appendChild(textView);

    noteContainer.style.backgroundColor = '#e6e6e6';
    noteContainer.style.width = '90%';
    noteContainer.style.height = 'fit-content';
    noteContainer.style.minHeight = '5%';
    noteContainer.style.borderRadius = '0.6rem';
    noteContainer.style.padding = '0.5rem';
    noteContainer.style.boxShadow = '0 5px 10px rgb(0 0 0 / 0.2)'

    return noteContainer;
}

function attachDataToView(noteView) {
    const text = window.sessionStorage.getItem('text');
    const title = window.sessionStorage.getItem('title');

    const items = noteView.childNodes;
    items[0].innerHTML = title;
    items[1].innerHTML = text;

    return noteView;
}