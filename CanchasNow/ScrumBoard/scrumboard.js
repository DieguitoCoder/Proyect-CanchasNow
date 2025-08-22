    let data = null;
    const board = document.getElementById('board');

    async function loadData() {
      const response = await fetch("scrumboard.json");
      data = await response.json();
      initBoard();
    }

    function renderBoard() {
      board.innerHTML = '';
      data.columns.forEach(col => {
        const columnEl = document.createElement('div');
        columnEl.className = 'column';
        columnEl.innerHTML = `<h2>${col.title}</h2>`;

        col.cards.forEach(card => {
          const cardEl = document.createElement('div');
          cardEl.className = `card ${card.color}`;
          cardEl.innerHTML = `
            <div class="card-content">
              <strong>${card.text}</strong>
              <span>👤 ${card.assignedTo}</span>
            </div>
            <div class="card-actions">
              <button class="edit-btn">✏️</button>
              <button class="delete-btn">🗑️</button>
            </div>
          `;

          // Editar
          cardEl.querySelector('.edit-btn').onclick = () => {
            const newText = prompt('Nuevo texto:', card.text);
            const newAssigned = prompt('Nuevo responsable:', card.assignedTo);
            if (newText) card.text = newText;
            if (newAssigned) card.assignedTo = newAssigned;
            renderBoard();
          };

          // Eliminar
          cardEl.querySelector('.delete-btn').onclick = () => {
            col.cards = col.cards.filter(c => c.id !== card.id);
            renderBoard();
          };

          columnEl.appendChild(cardEl);
        });

        board.appendChild(columnEl);
      });
    }

    function initBoard() {
      const taskForm = document.getElementById('taskForm');
      const taskColumnSelect = document.getElementById('taskColumn');

      // Llenar el select de columnas
      taskColumnSelect.innerHTML = "";
      data.columns.forEach(col => {
        const opt = document.createElement('option');
        opt.value = col.id;
        opt.textContent = col.title;
        taskColumnSelect.appendChild(opt);
      });

      // Crear nueva tarea
      taskForm.onsubmit = e => {
        e.preventDefault();
        const text = document.getElementById('taskText').value;
        const assigned = document.getElementById('taskAssigned').value;
        const color = document.getElementById('taskColor').value;
        const columnId = document.getElementById('taskColumn').value;

        const newCard = {
          id: 't' + Date.now(),
          text,
          assignedTo: assigned,
          color
        };

        const column = data.columns.find(c => c.id === columnId);
        column.cards.push(newCard);

        taskForm.reset();
        renderBoard();
      };

      renderBoard();
    }

    loadData();