// Хранилище привычек (в памяти, для простоты)
// Для реального приложения используй localStorage
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderHabits();
    
    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW зарегистрирован'))
            .catch(err => console.log('SW ошибка:', err));
    }
});

// Добавить привычку
function addHabit() {
    const input = document.getElementById('habitInput');
    const name = input.value.trim();
    
    if (!name) return;
    
    const habit = {
        id: Date.now(),
        name: name,
        completedDays: [] // массив дат в формате "2024-01-15"
    };
    
    habits.push(habit);
    saveHabits();
    input.value = '';
    renderHabits();
}

// Удалить привычку
function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    saveHabits();
    renderHabits();
}

// Переключить выполнение дня
function toggleDay(habitId, dateStr) {
    const habit = habits.find(h => h.id === habitId);
    const index = habit.completedDays.indexOf(dateStr);
    
    if (index > -1) {
        habit.completedDays.splice(index, 1); // убрать отметку
    } else {
        habit.completedDays.push(dateStr); // добавить отметку
    }
    
    saveHabits();
    renderHabits();
}

// Сохранить в localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Отрисовать всё
function renderHabits() {
    const container = document.getElementById('habitsList');
    container.innerHTML = '';
    
    habits.forEach(habit => {
        const card = createHabitCard(habit);
        container.appendChild(card);
    });
}

// Создать карточку привычки
function createHabitCard(habit) {
    const div = document.createElement('div');
    div.className = 'habit-card';
    
    // Заголовок
    const header = document.createElement('div');
    header.className = 'habit-header';
    header.innerHTML = 
        <span class="habit-name">${habit.name}</span>
        <button class="delete-btn" onclick="deleteHabit(${habit.id})">Удалить</button>
    ;
    
    // Календарь (последние 14 дней)
    const calendar = document.createElement('div');
    calendar.className = 'calendar';
    
    for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayNum = date.getDate();
        const isToday = i === 0;
        const isCompleted = habit.completedDays.includes(dateStr);
        
        const dayEl = document.createElement('div');
        dayEl.className = day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''};
        dayEl.textContent = dayNum;
        dayEl.onclick = () => toggleDay(habit.id, dateStr);
        
        calendar.appendChild(dayEl);
    }
    
    div.appendChild(header);
    div.appendChild(calendar);
    return div;
}

// Enter для добавления
document.getElementById('habitInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});
