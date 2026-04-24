// 1. Elemente auswählen
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');

// 2. Funktion zum Hinzufügen einer Aufgabe
addBtn.addEventListener('click', () => {
    const taskText = input.value;
    
    if (taskText === "") return;

    const li = document.createElement('li');
    // Hier ist dein Code - der ist perfekt:
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span class="task-text">${taskText}</span>
        <button class="delete-btn">X</button>
    `;

    taskList.appendChild(li);
    input.value = "";

    // WICHTIG: Hier rufen wir die Funktion auf, sobald eine Aufgabe dazu kam!
    updateProgress();
});

// 3. Funktion zur Berechnung des Fortschritts
function updateProgress() {
    const totalTasks = document.querySelectorAll('li').length;
    const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;

    //Prozent berechnen
    const percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    //Breite des Balkens anpassen
    progressBar.style.width = percentage + "%";
}

// Event-Delegation: Überwacht Klicks auf Checkboxen (damit Fortschritt live aktualisiert wird)
taskList.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        updateProgress();
    }
});

// Event-Delegation: Überwacht Klicks auf Lösch-Buttons
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
    e.target.parentElement.remove();
    updateProgress(); // Neu berechnen, da eine Aufgabe weg ist
    }
});
