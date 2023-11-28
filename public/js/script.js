const list = document.querySelector(".list-group");
const emptyTaskMessage = document.querySelector("h2");
const addButton = document.getElementById("addButton");
const input = document.getElementById("myInput");
const checkbox = document.getElementById("my-checkbox");

list.addEventListener("click", async (event) => {
   const target = event.target;
   const id = target.parentElement.dataset.taskid;

   if (target.classList.contains("toggle-btn")) {
      try {
         const title = target.parentElement.querySelector("label").textContent;
         const completed =
            target.parentElement.querySelector("span").lastElementChild
               .innerHTML === "Completed"
               ? false
               : true;
         const { data } = await axios.put("/tasks/" + id, {
            title,
            completed,
         });
         if (data.success) {
            target.parentElement.querySelector(
               "span"
            ).lastElementChild.innerHTML =
               target.parentElement.querySelector("span").lastElementChild
                  .innerHTML === "Completed"
                  ? "In progress"
                  : "Completed";

            target.parentElement.querySelector(
               "span"
            ).lastElementChild.className =
               target.parentElement.querySelector("span").lastElementChild
                  .innerHTML === "Completed"
                  ? "bg-success"
                  : "bg-secondary";
         } else {
            alert(data.message);
         }
      } catch (err) {
         console.log(err.response.data.message); //with err.response you can get more human readable error!
      }
   } else if (target.classList.contains("edit-btn")) {
      const currentTitle =
         target.parentElement.querySelector("label").textContent;
      const completed =
         target.parentElement.querySelector("span").lastElementChild
            .innerHTML === "Completed"
            ? true
            : false;
      const newTitle = prompt("Please enter new task's title", currentTitle);
      if (newTitle && newTitle != currentTitle && newTitle.length >= 3) {
         try {
            const {data} = await axios.put("/tasks/" + id, {
               title: newTitle,
               completed,
            });
            if (data.success) {
               target.parentElement.querySelector("label").innerHTML = newTitle;
            } else {
               alert(data.response.data.message);
            }
         } catch (err) {
            alert(err.response.data.message);
         }
      } else if (newTitle) {
         if (newTitle.length < 3) {
            alert("Title should be more than 3 characters.");
         } else if (newTitle === currentTitle) {
            alert("Title is the same as before.");
         } else {
            alert("something went wrong! ");
         }
      }
   } else if (target.classList.contains("delete-btn")) {
      const currentTitle =
         target.parentElement.querySelector("label").textContent;
      const areYouSureQuestion = `Are you sure to delete ${currentTitle} from the list?`;
      if (confirm(areYouSureQuestion)) {
         try {
            const {data} = await axios.delete("/tasks/" + id);
            if (data.success) {
               target.parentElement.remove();
            } else {
               alert(data.message);
            }
         } catch (err) {
            alert(err.response.data.message);
         }
         if (list.innerHTML.trim() == "") {
            emptyTaskMessage.classList.remove("d-hide");
         }
      }
   }
});

document.addEventListener("DOMContentLoaded", async () => {
   try {
      const { data } = await axios.get("/tasks");
      if (data.success) {
         if (data.body.length) {
            list.classList.remove("d-hide");
            let listItem = "";
            for (let task of data.body) {
               listItem += `
                     <li data-taskId='${task.id}'>
            <span>
               <label>${task.title}</label>
               <span class= ${task.completed ? "bg-success" : "bg-secondary"}>${
                  task.completed ? "Completed" : "In progress"
               }</span>
            </span>
            <button class="btn-secondary toggle-btn">Toggle</button>
            <button class="btn-primary edit-btn">Edit</button>
            <button class="btn-danger delete-btn">Delete</button>
            </li>
               `;
               list.innerHTML = listItem;
            }
         } else {
            emptyTaskMessage.classList.remove("d-hide");
         }
      } else {
         alert(data.message);
      }
   } catch (err) {
      console.log(err.response.data.message);
   }
});

addButton.addEventListener("click", addTask);
input.addEventListener("keydown", (event) => {
   if (event.key === "Enter") {
      event.preventDefault();
      addTask();
   }
});

async function addTask() {
   const title = input.value;
   const completed = checkbox.checked;
   if (title.length < 3) {
      alert("Please enter at least 3 character as your task title.");
      return;
   }

   try {
      const { data } = await axios.post("/tasks", { title, completed });
      if (data.success) {
         emptyTaskMessage.classList.add("d-hide");
         list.classList.remove("d-hide");

         const newItem = `
                        <li data-taskId='${data.body.id}'>
               <span>
                  <label>${title}</label>
                  <span class= ${completed ? "bg-success" : "bg-secondary"} > ${
            completed ? "Completed" : "In progress"
         } </span>
               </span>
               <button class="btn-secondary toggle-btn">Toggle</button>
               <button class="btn-primary edit-btn">Edit</button>
               <button class="btn-danger delete-btn">Delete</button>
               </li>
               `;
         list.innerHTML += newItem;
         input.value = "";
      } else {
         alert(data.message);
      }
   } catch (err) {
      alert(err.response.data.message);
   }
}
