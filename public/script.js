const STORAGE_KEY = "interntask-pro-tasks";

const defaultTasks = [
  { id: 1, title: "Complete project documentation", description: "Prepare the final project documentation and screenshots.", priority: "high", status: "progress", category: "Documentation", created: Date.now() - 500000 },
  { id: 2, title: "Test responsive layout", description: "Check dashboard on desktop, tablet and mobile screens.", priority: "medium", status: "todo", category: "Testing", created: Date.now() - 400000 },
  { id: 3, title: "Review JavaScript modules", description: "Clean up functions and remove unused code.", priority: "medium", status: "completed", category: "Development", created: Date.now() - 300000 },
  { id: 4, title: "Prepare internship presentation", description: "Create a short presentation covering project objectives and features.", priority: "low", status: "todo", category: "Research", created: Date.now() - 200000 }
];

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultTasks;
let editingId = null;

const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHTML(str = "") {
  return str.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}

function statusLabel(status) {
  return status === "todo" ? "To Do" : status === "progress" ? "In Progress" : "Completed";
}

function taskHTML(task) {
  return `
    <div class="task-item">
      <button class="check ${task.status === "completed" ? "done" : ""}" onclick="toggleTask(${task.id})">${task.status === "completed" ? "✓" : ""}</button>
      <div class="task-main">
        <strong>${escapeHTML(task.title)}</strong>
        <p>${escapeHTML(task.description || "No description")} · ${statusLabel(task.status)}</p>
      </div>
      <span class="category">${escapeHTML(task.category)}</span>
      <span class="badge ${task.priority}">${task.priority}</span>
      <div class="task-actions">
        <button class="small-btn" title="Edit" onclick="editTask(${task.id})">✎</button>
        <button class="small-btn" title="Delete" onclick="deleteTask(${task.id})">×</button>
      </div>
    </div>`;
}

function render() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const progress = tasks.filter(t => t.status === "progress").length;
  const high = tasks.filter(t => t.priority === "high").length;
  const percent = total ? Math.round(completed / total * 100) : 0;

  $("totalStat").textContent = total;
  $("progressStat").textContent = progress;
  $("completedStat").textContent = completed;
  $("highStat").textContent = high;
  $("progressPercent").textContent = percent + "%";
  $("progressRing").style.background = `conic-gradient(var(--primary) ${percent * 3.6}deg, #e9eaf2 ${percent * 3.6}deg)`;

  $("progressMessage").textContent = total
    ? `${completed} of ${total} tasks completed. ${percent === 100 ? "Excellent work — everything is complete!" : "Keep going and turn your remaining tasks into progress."}`
    : "Start adding tasks to track your progress.";

  const sorted = [...tasks].sort((a,b) => b.created - a.created);
  $("recentTasks").innerHTML = sorted.length ? sorted.slice(0, 5).map(taskHTML).join("") : emptyHTML();
  renderFiltered();
  renderAnalytics();
}

function emptyHTML() {
  return `<div class="empty">No tasks found. Create a new task to get started.</div>`;
}

function renderFiltered() {
  const search = $("searchInput").value.toLowerCase().trim();
  const status = $("statusFilter").value;
  const priority = $("priorityFilter").value;

  const filtered = tasks.filter(t => {
    const matchesSearch = `${t.title} ${t.description} ${t.category}`.toLowerCase().includes(search);
    const matchesStatus = status === "all" || t.status === status;
    const matchesPriority = priority === "all" || t.priority === priority;
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a,b) => b.created - a.created);

  $("allTasks").innerHTML = filtered.length ? filtered.map(taskHTML).join("") : emptyHTML();
}

function renderAnalytics() {
  const total = tasks.length || 1;
  const completed = tasks.filter(t => t.status === "completed").length;
  const progress = tasks.filter(t => t.status === "progress").length;
  const todo = tasks.filter(t => t.status === "todo").length;

  [["completedBar", completed], ["progressBar", progress], ["todoBar", todo]].forEach(([id, value]) => {
    $(id).style.width = `${value / total * 100}%`;
  });
  $("completedCount").textContent = completed;
  $("progressCount").textContent = progress;
  $("todoCount").textContent = todo;
  $("analyticsHigh").textContent = tasks.filter(t => t.priority === "high").length;
  $("analyticsMedium").textContent = tasks.filter(t => t.priority === "medium").length;
  $("analyticsLow").textContent = tasks.filter(t => t.priority === "low").length;
}

function openModal(task = null) {
  editingId = task?.id || null;
  $("modalTitle").textContent = task ? "Edit Task" : "Create New Task";
  $("submitTask").textContent = task ? "Save Changes" : "Create Task";
  $("taskId").value = task?.id || "";
  $("taskTitle").value = task?.title || "";
  $("taskDescription").value = task?.description || "";
  $("taskPriority").value = task?.priority || "medium";
  $("taskStatus").value = task?.status || "todo";
  $("taskCategory").value = task?.category || "Development";
  $("taskModal").classList.remove("hidden");
  $("taskTitle").focus();
}

function closeModal() {
  $("taskModal").classList.add("hidden");
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

window.toggleTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.status = task.status === "completed" ? "todo" : "completed";
  save(); render();
  showToast(task.status === "completed" ? "Task completed ✓" : "Task moved to To Do");
};

window.deleteTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  if (!confirm(`Delete "${task.title}"?`)) return;
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
  showToast("Task deleted");
};

window.editTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (task) openModal(task);
};

$("openAddBtn").onclick = () => openModal();
$("closeModal").onclick = closeModal;
$("taskModal").addEventListener("click", e => { if (e.target === $("taskModal")) closeModal(); });

$("taskForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    title: $("taskTitle").value.trim(),
    description: $("taskDescription").value.trim(),
    priority: $("taskPriority").value,
    status: $("taskStatus").value,
    category: $("taskCategory").value
  };

  if (editingId) {
    const index = tasks.findIndex(t => t.id === editingId);
    tasks[index] = { ...tasks[index], ...data };
    showToast("Task updated successfully");
  } else {
    tasks.unshift({ ...data, id: Date.now(), created: Date.now() });
    showToast("New task created");
  }

  save(); render(); closeModal();
});

["searchInput","statusFilter","priorityFilter"].forEach(id => {
  $(id).addEventListener("input", renderFiltered);
  $(id).addEventListener("change", renderFiltered);
});

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const section = btn.dataset.section;
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active-section"));
    $(`${section}Section`).classList.add("active-section");
    $("pageTitle").textContent = section === "dashboard" ? "Dashboard" : section === "tasks" ? "My Tasks" : "Analytics";
  });
});

$("viewAllBtn").onclick = () => document.querySelector('[data-section="tasks"]').click();

$("themeBtn").onclick = () => {
  document.body.classList.toggle("dark");
  $("themeBtn").textContent = document.body.classList.contains("dark") ? "☀" : "☾";
  localStorage.setItem("interntask-theme", document.body.classList.contains("dark") ? "dark" : "light");
};

if (localStorage.getItem("interntask-theme") === "dark") {
  document.body.classList.add("dark");
  $("themeBtn").textContent = "☀";
}

function updateClock() {
  const now = new Date();
  $("todayLabel").textContent = now.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"short" });
  $("clock").textContent = now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
}
updateClock();
setInterval(updateClock, 1000);
render();