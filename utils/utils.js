export function createJobRow(tableBodyEl,job) {
    const row = document.createElement('tr');
    const jobData = [job?.title, job?.company, job?.salary];

    for (let i = 0; i < jobData.length; i++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
        if (i < 3) {
            input.type = 'text';
            input.value = jobData[i] || '';
        } else if (i === 3) {
            input.type = 'date';
        }
        cell.appendChild(input);
        row.appendChild(cell);
    }

    const date = document.createElement('input');
    const now = new Date();
    date.type = 'text';
    date.value = now.getMonth() + "/" + now.getDate();
    date.className = "date";

    const status = document.createElement('td');
    status.textContent = "Applied";
    status.className = "status";

    row.appendChild(date);
    row.appendChild(status);

    row.id = tableBodyEl.children.length;  
    tableBodyEl.appendChild(row);
}
