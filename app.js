// Формат даты для ключа
function formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
}

// Открыть модальное окно
function openModal(date) {
    selectedDate = date;
    const dateKey = formatDateKey(date);
    const dayNotes = notes[dateKey] || [];
    
    const selectedDateEl = document.getElementById('selectedDate');
    if (selectedDateEl) {
        selectedDateEl.textContent = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }
    
    // Показать существующие записи
    const notesList = document.getElementById('existingNotes');
    if (notesList) {
        notesList.innerHTML = '';
        
        if (dayNotes.length > 0) {
            const listDiv = document.createElement('div');
            listDiv.className = 'notes-list';
            
            dayNotes.forEach(function(note, index) {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'note-item';
                noteDiv.innerHTML = 
                    '<span class="note-text">' + note.text + '</span>' +
                    '<button class="note-delete" onclick="deleteOneNote(' + index + ')">Удалить</button>';
                listDiv.appendChild(noteDiv);
            });
            
            notesList.appendChild(listDiv);
        }
    }
    
    const noteInput = document.getElementById('noteInput');
    if (noteInput) {
        noteInput.value = '';
    }
    
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Закрыть модальное окно
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
    selectedDate = null;
}

// Добавить новую запись
function saveNote() {
    if (!selectedDate) return;
    
    const noteInput = document.getElementById('noteInput');
    if (!noteInput) return;
    
    const text = noteInput.value.trim();
    if (!text) {
        closeModal();
        return;
    }
    
    const dateKey = formatDateKey(selectedDate);
    
    if (!notes[dateKey]) {
        notes[dateKey] = [];
    }
    
    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    
    notes[dateKey].push({
        text: text,
        time: timeStr
    });
    
    try {
        localStorage.setItem('calendarNotes', JSON.stringify(notes));
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
    
    renderCalendar();
    openModal(selectedDate);
}

// Удалить одну запись
function deleteOneNote(index) {
    if (!selectedDate) return;
    
    const dateKey = formatDateKey(selectedDate);
    
    if (notes[dateKey]) {
        notes[dateKey].splice(index, 1);
        
        if (notes[dateKey].length === 0) {
            delete notes[dateKey];
        }
        
        try {
            localStorage.setItem('calendarNotes', JSON.stringify(notes));
        } catch (e) {
            console.error('Ошибка сохранения:', e);
        }
        
        renderCalendar();
        openModal(selectedDate);
    }
}

// Переключение месяцев
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}
