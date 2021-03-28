const taskList = document.querySelector("#task-list");
const completeList = document.querySelector("#task-list-finished");
const form = document.querySelector("#add-task-form");

//Renders a single task from a firestore document
function renderTask(doc) {
    let li = document.createElement('li');
    let task = document.createElement('div');
    let date = document.createElement('div');
    let checkmark = document.createElement('div');

    li.setAttribute("data-id", doc.id);
    task.textContent = doc.data().taskName;
    date.textContent = doc.data().dueDate;
    checkmark.textContent = "X";

    li.appendChild(task);
    li.appendChild(date);
    li.appendChild(checkmark);


    if(doc.data().isComplete==false) {
        taskList.appendChild(li);
    } else {
        console.log(doc.data());
        console.log(li);
        completeList.appendChild(li);
    }

    //'X' click handler
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
            let li = taskList.querySelector('[data-id=' + change.doc.id + ']');
            taskList.removeChild(li);
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

