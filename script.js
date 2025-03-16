document.addEventListener("DOMContentLoaded", function () {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
});

function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = function(event) {
        document.getElementById('todo-input').value = event.results[0][0].transcript;
    };
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const date = document.getElementById('todo-date').value;
    const time = document.getElementById('todo-time').value;
    const category = document.getElementById('todo-category').value;
    const text = input.value.trim();

    if (!text || !date || !time) {
        alert("Please fill in all fields, including date and time.");
        return;
    }

    const taskDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (taskDateTime < now) {
        alert("Please select a future date and time for the reminder.");
        return;
    }

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'bg-secondary', 'text-white');
    li.innerHTML = `
        <input type="checkbox" class="form-check-input me-2" onclick="updateProgress()">
        <span>
            <strong>${category}</strong>: <span class="task-text">${text}</span> - <small>${date} ${time}</small>
        </span>
        <div>
            <button class='btn btn-warning btn-sm' onclick='editTask(this)'>Edit</button>
            <button class='btn btn-danger btn-sm' onclick='deleteTask(this)'>Delete</button>
        </div>`;

    document.getElementById('todo-list').appendChild(li);
    input.value = '';
    document.getElementById('todo-date').value = '';
    document.getElementById('todo-time').value = '';
    updateProgress();
    setReminder(text, taskDateTime);
}

function updateProgress() {
    const checkboxes = document.querySelectorAll("#todo-list input[type='checkbox']");
    const checked = document.querySelectorAll("#todo-list input[type='checkbox']:checked").length;
    const total = checkboxes.length;
    const progress = total ? Math.round((checked / total) * 100) : 0;
    
    const progressCircle = document.getElementById("progress-circle");
    progressCircle.textContent = `${progress}%`;
    progressCircle.style.background = `conic-gradient(#28a745 ${progress * 3.6}deg, #ccc 0deg)`;
}

new Sortable(document.getElementById('todo-list'), {
    animation: 150,
    ghostClass: 'bg-warning'
});

function setReminder(task, taskDateTime) {
    const now = new Date();
    const timeDiff = taskDateTime - now;
    console.log(`Setting reminder for "${task}" in ${timeDiff / 1000} seconds`);
    
    if (timeDiff > 0) {
        setTimeout(() => {
            showNotification(task);
        }, timeDiff);
    }
}

function showNotification(task) {
    if (Notification.permission === "granted") {
        new Notification("To-Do Reminder", {
            body: `Reminder: ${task}`,
            icon: "https://cdn-icons-png.flaticon.com/512/2919/2919906.png"
        });
    } else {
        console.log("Notification permission denied.");
    }
}