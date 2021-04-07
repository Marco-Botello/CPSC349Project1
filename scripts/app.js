(function (window) {
    'use strict';
    
    const db = firebase.firestore();
    const auth = firebase.auth();
    db.settings({ timestampsInSnapshots: true });

    var userId;

    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            userId = auth.currentUser.uid;

            db.collection("users").doc(userId).collection("tasks").orderBy("dueDate").onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type == 'added') {
                        renderTask(change.doc);
                    }
                    else if(change.type =='modified') {
                        //let li = document.querySelectorAll("[data-id=\"" + change.doc.id + "\"]");
                        //li[0].parentNode.removeChild(li[0]);
                        renderTask(change.doc);
                    }
                    else if(change.type == 'removed'){
                        let li = document.querySelectorAll("[data-id=\"" + change.doc.id + "\"]");
                        li[0].parentNode.removeChild(li[0]);
                    }
                });
            });
        } else {
            window.location = "login.html";
        }
    });

    const taskList = document.querySelector("#task-list");
    const completeList = document.querySelector("#task-list-finished");
    const form = document.querySelector("#add-task-form");
    const liElement = document.querySelector(".list-group-item-action");

    const logout = document.querySelector("#btn-logout");

    logout.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            console.log('user signed out');
            console.log(firebase.auth().currentUser.uid);
        });
    });

    //Renders a single task from a firestore document
    function renderTask(doc) {
        let li = document.createElement('li');
        let task = document.createElement('span');
        let date = document.createElement('span');
        let calendar = document.createElement('img');
        let checkmark = document.createElement('img');
        let trash = document.createElement('img');

        li.setAttribute("data-id", doc.id);
        li.setAttribute("class", "list-group-item list-group-item-action");
        task.textContent = doc.data().taskName;
        date.textContent = doc.data().dueDate;
        task.setAttribute("class", "text-capitalize float-none pr-3");
        trash.setAttribute("src", "img/icons/trash.svg");
        calendar.setAttribute("src", "img/icons/calendar.svg");
        trash.setAttribute("class", "float-right");
        date.setAttribute("class", "float-right mr-5");
        calendar.setAttribute("class", "float-right pr-2");
        checkmark.setAttribute("class", "float-left pr-3");

        //If the task is uncomplete, add it to the uncomplete list. Otherwise add it to the complete list.
        if(doc.data().isComplete==false) {
            checkmark.setAttribute("src", "img/icons/circle.svg");
            li.appendChild(checkmark);
            li.appendChild(task);
            li.appendChild(trash);
            li.appendChild(date);
            li.appendChild(calendar);
            taskList.appendChild(li);
        } else {
            checkmark.setAttribute("src", "img/icons/check-circle-fill.svg");
            task.setAttribute("style", "text-decoration: line-through;");
            li.appendChild(checkmark);
            li.appendChild(task);
            li.appendChild(trash);
            li.appendChild(date);
            li.appendChild(calendar);
            completeList.appendChild(li);
        }

        //Checkmark click handler - moves unfinished task to finished or vice versa.
        checkmark.addEventListener("click", (e) => {
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute("data-id");
            db.collection("users").doc(userId).collection("tasks").doc(id).get().then((doc) => {
                let taskName = doc.data().taskName;
                let dueDate = doc.data().dueDate;
                let toggleBool = !doc.data().isComplete;
                db.collection("users").doc(userId).collection("tasks").doc(id).set({
                    taskName: taskName,
                    dueDate: dueDate,
                    isComplete: toggleBool,
                });
            });
            e.target.parentElement.remove();
        });

        //Delete task click handler - remove task if executed.
        trash.addEventListener("click", (e) => {
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute("data-id");
            db.collection("users").doc(userId).collection("tasks").doc(id).delete();
        });
        //Checkmark hover effect- circle becomes a checkmark on mouse hover
        checkmark.addEventListener("mouseenter", (e) => {
            e.stopPropagation();
            if(e.target.parentElement.parentElement.getAttribute("id") === "task-list") {
                e.target.setAttribute("src", "img/icons/check-circle.svg");
            }
        });
        //Checkmark hover effect - checkmark goes back to a circle after mouse leaving
        checkmark.addEventListener("mouseleave", (e) => {
            e.stopPropagation();
            if(e.target.parentElement.parentElement.getAttribute("id") === "task-list") {
                e.target.setAttribute("src", "img/icons/circle.svg");
            }
        });

        //Trash can hover effect- trashcan color inversion on mouse hover
        trash.addEventListener("mouseenter", (e) => {
            e.stopPropagation();
            e.target.setAttribute("src", "img/icons/trash-fill.svg");
        });
        //Trash can hover effect - trashcan color returns to default after mouse leaving
        trash.addEventListener("mouseleave", (e) => {
            e.stopPropagation();
            e.target.setAttribute("src", "img/icons/trash.svg");
        });
    }

    //write data to firestore
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        db.collection("users").doc(userId).collection("tasks").add({
        taskName: form.taskName.value,
        dueDate: form.dateDue.value,
        isComplete: false,
        });
        form.taskName.value = "";
        form.dateDue.value = "";
    });

    // Edit task modal handler
    const modalSave = document.querySelector("#modalSave");
    taskList.addEventListener('click', (e) => {
        let id = e['srcElement'].getAttribute('data-id');
        db.collection("users").doc(userId).collection('tasks').doc(id).get().then((snapshot) => {
            let editForm = document.querySelector('#edit-task-form');
            editForm['edit-task-name'].value = snapshot.data().taskName;
            editForm.setAttribute("data-id", id);
            editForm['edit-task-date'].value = snapshot.data().dueDate;
            var myModal = new bootstrap.Modal(document.getElementById('model-edit'), 'focus');
            myModal.show();
        });
    });

    // Edit task modal save button
    modalSave.addEventListener('click', (e) => {
        e.preventDefault();
        let editForm = document.querySelector('#edit-task-form');
        let id = editForm.getAttribute("data-id");
        db.collection("users").doc(userId).collection('tasks').doc(id).update({
            taskName: editForm['edit-task-name'].value,
            dueDate: editForm['edit-task-date'].value
        }).then(() => {
            let li = document.querySelector(`[data-id="${id}"]`);
            li.remove();
            let alert = document.querySelector('#alert-success');
            alert.setAttribute("style", "display:block");
            var myAlert = new bootstrap.Alert(document.getElementById('alert-success'));
            setTimeout(()=>{
                alert.setAttribute("style", "visibility:hidden");
            }, 3000);
        });
    });
})(window);

