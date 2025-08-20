let jobs = JSON.parse(localStorage.getItem('jobs'));

if (!jobs) {
    jobs = [];
}


function handleInputChange(e) {
    const field = this.className;
    const rowIdx = this.closest('tr').id;
    if (!jobs[rowIdx]) {
        jobs[rowIdx] = {};
    };

    jobs[rowIdx][field] = this.value;
    localStorage.setItem('jobs', JSON.stringify(jobs));
};

function handleDeleteClick(e) {
    const rowIdx = this.closest('tr').id;
    console.log('Delete button clicked for row:', rowIdx);
    jobs.pop(rowIdx);
    const tableBodyEl = document.getElementById('job-list-body');
    const rowEl = document.getElementById(rowIdx);
    
    if (tableBodyEl.children.length > 1) {
        rowEl.remove();
    } else {
        rowEl.querySelectorAll('input').forEach(input => input.value = null);
        rowEl.querySelector('select').value = 'Saved';
    }

    localStorage.setItem('jobs', JSON.stringify(jobs));
}

export function createJobRow(tableBodyEl,job) {
    const row = document.createElement('tr');
    const keys = ['title', 'company', 'salary', 'date', 'status'];
    const jobData = [job?.title, job?.company, job?.salary, job?.date, job?.status];

    row.id = tableBodyEl.children.length;

    // Create input fields for each key
    for (let i = 0; i < jobData.length; i++) {
        const cell = document.createElement('td');
        let input;
        if (i === (jobData.length-1)) {
            input = document.createElement('select');
            const options = ['Saved','Applied', 'Interview', 'Offer', 'Rejected'];
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                if (jobData[i] === option) {
                    opt.selected = true;
                }
                input.appendChild(opt);
            });
        } else { 
            input = document.createElement('input'); 
            input.type = 'text';
            input.value = jobData[i] || '';
        }

        // Set attributes and event listeners
        input.placeholder = keys[i].charAt(0).toUpperCase() + keys[i].slice(1);
        input.className = keys[i];
        input.addEventListener('input', handleInputChange);
        
        cell.appendChild(input);
        row.appendChild(cell);
    };
    


    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn-' + row.id;
    deleteBtn.addEventListener('click', handleDeleteClick);  
    row.appendChild(deleteBtn);

    tableBodyEl.appendChild(row);
};
