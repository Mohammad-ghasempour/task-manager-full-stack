const list = document.querySelector(".list-group");
const emptyTaskMessage = document.querySelector("h2");
const addButton = document.getElementById('addButton');
const input = document.getElementById('myInput');
const checkbox = document.getElementById('my-checkbox');



list.addEventListener("click", async (event) => {
   const target = event.target;
   const id = target.parentElement.dataset.taskid;

   if (target.classList.contains("toggle-btn")) {
      try {
         const response = await axios.post("/toggle-task", { id: id });
         if (response.data === true) {
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
            alert(response.data);
         }
      } catch (err) {
         console.log(err.response); //with err.response you can get more human readable error!
      }
   } else if (target.classList.contains("edit-btn")) {
      const currentTitle =
         target.parentElement.querySelector("label").textContent;
      const answer = prompt("Please enter new task's title", currentTitle);
      if (answer && answer != currentTitle && answer.length >= 3) {
         try {
            const response = await axios.post("/edit-task", {
               id,
               title: answer,
            });
            if (response.data === true) {
               target.parentElement.querySelector("label").innerHTML = answer;
            } else {
               alert(response.data);
            }
         } catch (err) {
            alert(err.response.data);
         }
      } else if (answer) {
         if (answer.length < 3) {
            alert("Title should be more than 3 characters.");
         } else if (answer === currentTitle) {
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
            const response = await axios.post("/delete-task", { id });
            if (response.data === true) {
               target.parentElement.remove();
            } else {
               alert(response.data);
            }
         } catch (err) {
            alert(err.response.data);
         }
      }
   }
});

document.addEventListener("DOMContentLoaded", async () => {
   try {
      const { data } = await axios.get("/get-all-tasks");
      if (data instanceof Array) {
         if (data.length) {
            list.classList.remove("d-hide");
            let listItem = "";
            for (let task of data) {
               listItem += `
            <li data-taskId='${task.id}'>
    <span>
       <label>${task.title}</label>
       <span class= ${task.completed ? "bg-success" : "bg-secondary"} > ${
                  task.completed ? "Completed" : "In progress"
               } </span>
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
      }
   } catch (err) {
      console.log(err.message);
   }
});

///////////////

 addButton.addEventListener('click', addTask);
 input.addEventListener('keydown',(event)=>{
    if (event.key === 'Enter'){
      event.preventDefault()
      addTask();
   }
 })

 
async function  addTask(){

     const title = input.value;
     const completed = checkbox.checked;
     if (title.length <3){
      alert('Please enter at least 3 character as your task title.')
      return;
     }
     
     try {
      const {data} = await axios.post("/addData", {title, completed});
      console.log(data)
      if (data>0) {
         emptyTaskMessage.classList.add('d-hide');

         const newNode = document.createElement('li');
         newNode.setAttribute("data-taskId",data)
         newNode.innerHTML = `<span>
         <label>${title}</label>
         <span class= ${completed ? "bg-success" : "bg-secondary"} > ${
                    completed ? "Completed" : "In progress"
                 } </span>
      </span>
      <button class="btn-secondary toggle-btn">Toggle</button>
      <button class="btn-primary edit-btn">Edit</button>
      <button class="btn-danger delete-btn">Delete</button>`

      
       
      
      
//       const newItem = `
//          <li data-taskId='${data}'>
//  <span>
//     <label>${title}</label>
//     <span class= ${completed ? "bg-success" : "bg-secondary"} > ${
//                completed ? "Completed" : "In progress"
//             } </span>
//  </span>
//  <button class="btn-secondary toggle-btn">Toggle</button>
//  <button class="btn-primary edit-btn">Edit</button>
//  <button class="btn-danger delete-btn">Delete</button>
// </li>
// `


list.appendChild(newNode);
input.value=''

      } else {
         alert(data);
      }
   } catch (err) {
      alert(err.message);
   }

}


 