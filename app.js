<span class="note-text">${note.text}</span>
                <button class="note-delete" onclick="deleteOneNote(${index})">Удалить</button>
            `;
            listDiv.appendChild(noteDiv);
        });
        
        notesList.appendChild(listDiv);
    }
    
    document.getElementById('noteInput').value = '';
    document.getElementById('modal').style.display = 'flex';
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    selectedDate = null;
}

// Добавить новую запись
function saveNote() {
    if (!selectedDate) return;
    
    const text = document.getElementById('noteInput').value.trim();
    if (!text) {
        closeModal();
        return;
    }
    
    const dateKey = formatDateKey(selectedDate);
    
    if (!notes[dateKey]) {
        notes[dateKey] = [];
    }
    
    notes[dateKey].push({
        text: text,
        time: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})
    });
    
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
    renderCalendar();
    openModal(selectedDate); // Переоткрыть чтобы показать новую запись
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
        
        localStorage.setItem('calendarNotes', JSON.stringify(notes));
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

// Закрыть по клику вне окна
document.getElementById('modal').onclick = (e) => {
    if (e.target.id === 'modal') closeModal();
};

// Закрыть по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
