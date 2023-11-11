const list = document.querySelector(".list-group");
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
