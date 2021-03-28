const taskList = document.querySelector("#task-list");
const form = document.querySelector("#add-task-form");

function toDateTime(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t;
}


function renderTask(doc) {
    console.log(doc.data());
    let li = document.createElement('li');
    let task = document.createElement('div');
    let date = document.createElement('div');
    let checkmark = document.createElement('div');

    li.setAttribute("data-id", doc.id);
    task.textContent = doc.data().taskName;
    date.textContent = doc.data().dueDate;
    checkmark.textContent = "x";

    li.appendChild(task);
    li.appendChild(date);
    li.appendChild(checkmark);

    taskList.appendChild(li);

    //to do delete data
}



//real time data fetching
db.collection('tasks').orderBy('dueDate').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added') {
            renderTask(change.doc);
        } else if(change.type == 'removed'){
            let li = taskList.querySelector('[data-id=' + change.doc.id + ']');
            taskList.removeChild(li);
        }
    })
})

//to do: write data
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

