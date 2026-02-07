let currentDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// Initialize
window.onload = () => {
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    changeDay(currentDay);
};

function changeDay(day) {
    currentDay = day;
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === day.toUpperCase());
    });
    loadTasks();
}

function loadTasks() {
    list.innerHTML = '';
    const data = JSON.parse(localStorage.getItem('novatra_weekly_v1')) || {};
    const tasks = data[currentDay] || [];
    tasks.forEach(task => renderTask(task));
    updateUI();
}

function addTask() {
    if (!input.value.trim()) return;
    const newTask = { id: Date.now(), text: input.value, completed: false };
    
    const data = JSON.parse(localStorage.getItem('novatra_weekly_v1')) || {};
    if (!data[currentDay]) data[currentDay] = [];
    data[currentDay].push(newTask);
    
    localStorage.setItem('novatra_weekly_v1', JSON.stringify(data));
    renderTask(newTask);
    input.value = '';
    updateUI();
}

function renderTask(task) {
    const li = document.createElement('li');
    li.id = task.id;
    li.className = `task-item flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm ${task.completed ? 'checked' : ''}`;
    li.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="checkbox-custom" onclick="toggleTask(${task.id})">
                <i class="fa-solid fa-check text-white text-[10px] ${task.completed ? '' : 'hidden'}"></i>
            </div>
            <span class="font-semibold text-teal-950">${task.text}</span>
        </div>
        <button onclick="deleteTask(${task.id})" class="text-slate-300 hover:text-red-500 transition-colors"><i class="fa-solid fa-trash-can"></i></button>
    `;
    list.appendChild(li);
}

function toggleTask(id) {
    const data = JSON.parse(localStorage.getItem('novatra_weekly_v1'));
    data[currentDay] = data[currentDay].map(t => t.id === id ? {...t, completed: !t.completed} : t);
    localStorage.setItem('novatra_weekly_v1', JSON.stringify(data));
    loadTasks();
}

function deleteTask(id) {
    const data = JSON.parse(localStorage.getItem('novatra_weekly_v1'));
    data[currentDay] = data[currentDay].filter(t => t.id !== id);
    localStorage.setItem('novatra_weekly_v1', JSON.stringify(data));
    loadTasks();
}

function updateUI() {
    const data = JSON.parse(localStorage.getItem('novatra_weekly_v1')) || {};
    const tasks = data[currentDay] || [];
    const completed = tasks.filter(t => t.completed).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';
    document.getElementById('task-count').innerText = `${tasks.length - completed} tasks remaining`;
}

function clearDay() {
    if(confirm('Clear all tasks for ' + currentDay + '?')) {
        const data = JSON.parse(localStorage.getItem('novatra_weekly_v1'));
        data[currentDay] = [];
        localStorage.setItem('novatra_weekly_v1', JSON.stringify(data));
        loadTasks();
    }
}