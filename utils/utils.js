let jobs = JSON.parse(localStorage.getItem('jobs'));

if (!jobs) {
    jobs = [];
}


function handleInputChange(e) {
    const field = this.className;
    const rowEl = this.closest('tr');
    let jobIdx = jobs.length;

    if (rowEl.className === 'empty') {
        jobs[jobIdx] = {};
        rowEl.id = jobIdx;
        rowEl.className = ''
    } else {jobIdx = Number(rowEl.id)};

    jobs[jobIdx][field] = this.value;
    localStorage.setItem('jobs', JSON.stringify(jobs));
};

function handleDeleteClick(e) {
    const rowEl = this.closest('tr');
    const tableBodyEl = document.getElementById('job-list-body');
    console.log(rowEl.className);
    if (rowEl.className !== 'empty') {
        jobs.splice(Number(rowEl.id), 1);
        shiftIds(rowEl.id);
    }
    if (tableBodyEl.children.length > 1) {
        rowEl.remove();
    } else {
        rowEl.querySelectorAll('input').forEach(input => input.value = null);
        rowEl.querySelector('select').value = 'Saved';
    }

    localStorage.setItem('jobs', JSON.stringify(jobs));
}

function shiftIds(pivot) {
    const tableBodyEl = document.getElementById('job-list-body');
    let greaterRows = [];
    tableBodyEl.querySelectorAll('tr').forEach(row => {
        if (row.className !== 'empty' && row.id > pivot) {
            greaterRows.push(row);
        }
    });
    greaterRows.forEach(row => {
        row.id = Number(row.id) - 1;
    });
}
    
function getJob(){
    let jobInfo = {
        title: '',
        company: '',
        salary: '',
        date: '',
        status: 'Saved'
    };
    // let currentTab = browser.tabs.getCurrent();
    // const response = browser.tabs.sendMessage(currentTab.id, {action: "getJobInfo"});
    // if (response) {
    // console.log(response)
    // } else {
    //     console.log('No response from content script');
    // }
}


export function createJobRow(tableBodyEl,job,jobId) {
    const row = document.createElement('tr');
    const keys = ['title', 'company', 'salary', 'date', 'status'];

    if (!job) {
        getJob();
    }

    const jobData = [job?.title, job?.company, job?.salary, job?.date, job?.status];
    if (jobId !== undefined) {
        row.id = jobId;
    } else { row.className = 'empty' };

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
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', handleDeleteClick);  
    row.appendChild(deleteBtn);

    tableBodyEl.appendChild(row);
};
