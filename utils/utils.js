let jobs = JSON.parse(localStorage.getItem('jobs'));

if (!jobs) {
    jobs = {};
}

function handleInputChange(e) {
    const field = this.className;
    const rowIdx = this.closest('tr').id;

    if (!jobs[rowIdx]) {
        jobs[rowIdx] = {};
    };

    jobs[rowIdx][field] = this.value;
    console.log(`Updated job at index ${rowIdx} field ${field} to ${this.value}`);
    localStorage.setItem('jobs', JSON.stringify(jobs));
};

export function createJobRow(tableBodyEl,job) {
    const row = document.createElement('tr');

    const keys = ['title', 'company', 'salary', 'date', 'status'];
    const jobData = [job?.title, job?.company, job?.salary, job?.date, job?.status];

    for (let i = 0; i < jobData.length; i++) {
        const cell = document.createElement('td');
        let input;
        if (i === (jobData.length-1)) {
            input = document.createElement('select');
            console.log("Creating a select element for status");
            const options = ['Applied', 'Interview', 'Offer', 'Rejected'];
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
        
        input.placeholder = keys[i].charAt(0).toUpperCase() + keys[i].slice(1);

        input.className = keys[i];
        
        input.addEventListener('change', handleInputChange);
        
        cell.appendChild(input);
        row.appendChild(cell);
    };

    row.id = tableBodyEl.children.length;  
    tableBodyEl.appendChild(row);
};
