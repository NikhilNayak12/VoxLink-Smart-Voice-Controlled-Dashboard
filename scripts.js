document.addEventListener('DOMContentLoaded', () => {
    startClock();
    setupVoiceCommands();
});

function startClock() {
    const timeElement = document.getElementById('time');
    setInterval(() => {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }, 1000);
}

function fetchWeather(location) {
    const weatherElement = document.getElementById('weather-info');
    const apiKey = '6c4c153000404864bff133408253001';
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            weatherElement.textContent = `Temperature: ${data.current.temp_c}°C, ${data.current.condition.text}`;
        })
        .catch(error => {
            weatherElement.textContent = 'Error fetching weather data';
        });
}

function fetchNews() {
    const newsElement = document.getElementById('news-feed');
    const apiKey = '7eb359640024477e930f3ef5fa845545';
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            newsElement.innerHTML = '';
            data.articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');
                newsItem.innerHTML = `<h3>${article.title}</h3><p>${article.description}</p>`;
                newsElement.appendChild(newsItem);
            });
        })
        .catch(error => {
            newsElement.textContent = 'Error fetching news data';
        });
}

function setupVoiceCommands() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use Google Chrome.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        handleVoiceCommand(transcript);
    };

    recognition.start();
}

function handleVoiceCommand(command) {
    if (command.includes('open ')) {
        const website = command.replace('open ', '').trim();
        openApp(website);
    } else if (command.includes('new task')) {
        const task = command.replace('new task', '').trim();
        addTask(task);
    } else if (command.includes('delete task')) {
        const task = command.replace('delete task', '').trim();
        deleteTask(task);
    }else if (command.includes('show weather in')) {
        const location = command.replace('show weather in', '').trim();
        fetchWeather(location);
    } else if (command.includes('show news')) {
        fetchNews();
    }
}

function openApp(website) {
    const url = `https://${website.replace(/\s+/g, '')}.com`;
    window.open(url, '_blank');
}

document.getElementById('add-task').addEventListener('click', () => {
    const taskInput = document.getElementById('new-task');
    addTask(taskInput.value);
    taskInput.value = '';
});

function addTask(task) {
    const todoList = document.getElementById('todo-list');
    const taskItem = document.createElement('li');
    taskItem.textContent = task;
    todoList.appendChild(taskItem);
}

function deleteTask(task) {
    const todoList = document.getElementById('todo-list');
    const tasks = todoList.getElementsByTagName('li');
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].textContent.trim().toLowerCase() === task.toLowerCase()) {
            todoList.removeChild(tasks[i]);
            break;
        }
    }
}