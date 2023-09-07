const addBox = document.querySelector(".add-box"),
popUpBox = document.querySelector(".popup-box"),
popUpTitle = popUpBox.querySelector("header p")
titleTag = popUpBox.querySelector("input"),
descTag = popUpBox.querySelector("textarea"),
closeIcon = popUpBox.querySelector("header i"),
addBtn = popUpBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

//Getting local storage notes if exist and parsing them to js object
//else paasing an empty array to thye notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]")
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    titleTag.focus();
    popUpBox.classList.add("show");
})

function showNotes(){
    document.querySelectorAll(".note").forEach(note => note.remove());//Remove all previous notes before adding new
    notes.forEach((note, index) => {
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onClick={showMenu(this)} class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onClick= "editNote(${index},'${note.title}','${note.description}')" class="uil uil-pen">Edit</li>
                                    <li onClick="deleteNote(${index})" class="uil uil-trash">Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();


closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerHTML = "Add Note";
    popUpTitle.innerHTML = "Add a new Note";
    popUpBox.classList.remove("show");
})

function showMenu(elem){
    // console.log(elem.parentElement)
    elem.parentElement.classList.add("show")
    // removing show class from the settings menu on document click
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show")
        }
    })
}

//Delete note

function deleteNote(noteId){
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1); //removing selected note from array/tasks,
    localStorage.setItem("notes", JSON.stringify(notes)); //saving bnotes ton local storage
    showNotes();
}

//edit note
function editNote(noteId, title, desc){
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerHTML = "Update Note";
    popUpTitle.innerHTML = "Update a Note";
    console.log(noteId, title, desc)
}

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let noteTitle = titleTag.value,
    noteDesc = descTag.value;

    if(noteTitle || noteDesc){
        let dateObj = new Date(),
        month = months[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle, description:noteDesc,
            date: `${month} ${day}, ${year}`
        }

        // Once note is updated, we have to set the 'isUpdate' value to false bcz when user
        // try to add a new note, the previous updated note will be replaced by the new one.
        if(!isUpdate){
            notes.push(noteInfo)//Adding new note to notess
        }else{
            isUpdate = false;
            notes[updateId] = noteInfo; // Updating specified note 
        }
        
        localStorage.setItem("notes", JSON.stringify(notes))//saving bnotes ton local storage
        closeIcon.click();
        showNotes();
    }
    
})