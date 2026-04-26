const API_URL = "/api/tasks";

const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", fetchTasks);

// GET ALL TASKS
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    renderTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}


// RENDER TASKS
function renderTasks(tasks) {
    taskList.innerHTML = "";
  
    if (tasks.length === 0) {
      emptyMessage.style.display = "block";
      return;
    } else {
      emptyMessage.style.display = "none";
    }
  
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
  
      // LEFT SIDE (checkbox + title)
      const leftDiv = document.createElement("div");
      leftDiv.className = "d-flex align-items-center gap-2";
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "form-check-input";
      checkbox.checked = task.completed;
      checkbox.onclick = () => toggleTask(task.id);
  
      const titleSpan = document.createElement("span");
      titleSpan.textContent = task.title;
  
      if (task.completed) {
        titleSpan.classList.add("completed-task");
      }
  
      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(titleSpan);
  
      // RIGHT SIDE (delete button)
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteTask(task.id);
  
      li.appendChild(leftDiv);
      li.appendChild(deleteBtn);
  
      taskList.appendChild(li);
    });
  }

// ADD TASK
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  if (!title) return;

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    taskTitleInput.value = "";
    fetchTasks();
  } catch (error) {
    console.error("Error adding task:", error);
  }
});


// DELETE TASK
async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}


// TOGGLE TASK
async function toggleTask(id) {
  try {
    await fetch(`${API_URL}/${id}/toggle`, {
      method: "PUT",
    });

    fetchTasks();
  } catch (error) {
    console.error("Error toggling task:", error);
  }
}