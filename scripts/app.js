const taskList = document.querySelector("#task-list");
const completeList = document.querySelector("#task-list-finished");
const form = document.querySelector("#add-task-form");

//Renders a single task from a firestore document
function renderTask(doc) {
    let li = document.createElement('li');
    let task = document.createElement('span');
    let date = document.createElement('span');
    let checkmark = document.createElement('img');
    let trash = document.createElement('img');

    li.setAttribute("data-id", doc.id);
    li.setAttribute("class", "list-group-item list-group-item-action");
    task.textContent = doc.data().taskName;
    date.textContent = doc.data().dueDate;
    task.setAttribute("class", "float-none pr-3");
    trash.setAttribute("src", "img/icons/trash.svg");
    trash.setAttribute("class", "float-right");
    checkmark.setAttribute("class", "float-left pr-3");

    //If the task is uncomplete, add it to the uncomplete list. Otherwise add it to the complete list.
    if(doc.data().isComplete==false) {
        checkmark.setAttribute("src", "img/icons/circle.svg");

        li.appendChild(checkmark);
        li.appendChild(task);
        li.appendChild(date);
        li.appendChild(trash);
        taskList.appendChild(li);
    } else {
        checkmark.setAttribute("src", "img/icons/check-circle-fill.svg");
        li.appendChild(checkmark);
        li.appendChild(task);
        li.appendChild(date);
        li.appendChild(trash);
        completeList.appendChild(li);
    }

    //Checkmark click handler - moves unfinished task to finished or vice versa.
    checkmark.addEventListener("click", (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id");
        db.collection("tasks").doc(id).get().then((doc) => {
            let taskName = doc.data().taskName;
            let dueDate = doc.data().dueDate;
            let toggleBool = !doc.data().isComplete;
            db.collection("tasks").doc(id).set({
                taskName: taskName,
                dueDate: dueDate,
                isComplete: toggleBool,
            })
        })
        e.target.parentElement.remove();
    })

    //Delete task click handler - remove task if executed.
    trash.addEventListener("click", (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute("data-id");
        db.collection("tasks").doc(id).delete();
      });

    //Checkmark hover effect- circle becomes a checkmark on mouse hover
    checkmark.addEventListener("mouseenter", (e) => {
        e.stopPropagation();
        if(e.target.parentElement.parentElement.getAttribute("id") === "task-list") {
            e.target.setAttribute("src", "img/icons/check-circle.svg");
        }
    })
    //Checkmark hover effect - checkmark goes back to a circle after mouse leaving
    checkmark.addEventListener("mouseleave", (e) => {
        e.stopPropagation();
        if(e.target.parentElement.parentElement.getAttribute("id") === "task-list") {
            e.target.setAttribute("src", "img/icons/circle.svg");
        }
    })


    //Checkmark hover effect- circle becomes a checkmark on mouse hover
    trash.addEventListener("mouseenter", (e) => {
        e.stopPropagation();
        e.target.setAttribute("src", "img/icons/trash-fill.svg");
    })
    //Checkmark hover effect - checkmark goes back to a circle after mouse leaving
    trash.addEventListener("mouseleave", (e) => {
        e.stopPropagation();
        e.target.setAttribute("src", "img/icons/trash.svg");
    })
}

//real time data fetching
db.collection('tasks').orderBy('dueDate').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added') {
            renderTask(change.doc);
        }
        else if(change.type =='modified') {
            renderTask(change.doc);
        }
        else if(change.type == 'removed'){
            console.log('Remove detected: ');
            console.log('[data-id=' + change.doc.id + ']');
            let li = document.querySelectorAll('[data-id=' + change.doc.id + ']');
            console.log(li[0]);
            li[0].parentNode.removeChild(li[0]);
        }
    })
})

//write data to firestore
form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('hello');
    db.collection("tasks").add({
      taskName: form.taskName.value,
      dueDate: form.dateDue.value,
      isComplete: false,
    });
    form.taskName.value = "";
    form.dateDue.value = "";
  });

