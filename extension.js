addJobEl = document.getElementById('add-job');
tableBodyEl = document.getElementById('job-list-body');

function createJobRow(job) {
    const row = document.createElement('tr');
    const jobData = [job?.title, job?.company, job?.salary];
    for(i = 0; i < jobData.length; i++) {
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
    const status = document.createElement('td');
    date.type = 'date';
    status.textContent = "Status";
    row.appendChild(date);
    row.appendChild(status);
    row.id = tableBodyEl.children.length;  
    tableBodyEl.appendChild(row);
}   
addJobEl.addEventListener('click', () => {
    console.log('Add job button clicked');
    createJobRow();
})

