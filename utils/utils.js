let jobs = JSON.parse(localStorage.getItem('jobs'));

if (!jobs) {
    jobs = [];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

function saveRow(rowEl, id) {
    console.log(`Saving row :${rowEl}`);
    if(!rowEl) return;
    const inputs = rowEl.querySelectorAll('input, select, button.link');
    let job = {};
    inputs.forEach(input => {
        job[input.className] = input.value;
    });

    const linkEl = rowEl.querySelector('a');
    job.link = linkEl?.href;
    jobs[id] = job;
    localStorage.setItem('jobs', JSON.stringify(jobs));
}
    
export async function getJob() {
    let currentTab;
    await browser.tabs.query({ currentWindow: true, active: true })
        .then((tabs) => {
            currentTab = tabs[0];
        });
    if (currentTab.url.includes("indeed") || currentTab.url.includes("linkedin") || currentTab.url.includes("glassdoor")) {
        return new Promise((resolve) => {
            const listener = (message) => {
                if (message.response) {
                    browser.runtime.onMessage.removeListener(listener);
                    console.log("Received job info:", message.response);
                    resolve(message.response);
                }
            };
            let connected = false;
            while (!connected) {
                try {
                    browser.runtime.onMessage.addListener(listener);
                    connected = true;
                }
                catch (error) {
                    sleep(5000);
                    console.error("Error adding message listener:", error);
                }
            }
            try {
                browser.tabs.sendMessage(currentTab.id, "getJob");
            } catch (error) {
                console.error("Error sending message to content script:", error);
                resolve({});
            }
        });
    } else {
        return {};
    }
}

export function createJobRow(tableBodyEl, job, jobId) {
    const row = document.createElement('tr');
    const keys = ['title', 'company', 'salary', 'date', 'status', 'link'];
    const jobData = [job?.title, job?.company, job?.salary, job?.date, job?.status];

    if (jobId !== undefined) {
        row.id = jobId;
    } else {
        row.className = 'empty';
    }

    // Create input fields for each key except 'link'
    for (let i = 0; i < keys.length; i++) {
        const cell = document.createElement('td');
        let input;
        if (keys[i] === 'status') {
            input = document.createElement('select');
            const options = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                if (job?.status === option) {
                    opt.selected = true;
                }
                input.appendChild(opt);
            });
            input.className = keys[i];
            input.addEventListener('input', handleInputChange);
            cell.appendChild(input);
        } else if (keys[i] === 'link') {
            // Display link as an icon or anchor if present
                const link = document.createElement('a');
                link.href = job?.link;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.title = 'Open job link';

                if(!job?.link) {
                    link.style.pointerEvents = 'none';
                    cell.style.backgroundColor = '#fdb4b6ff';
                }

                // SVG icon (simple chain link)
                link.innerHTML = `<img src="static/link.svg" alt="Job Link" width="16" height="16">`;
                cell.className = 'link'
                cell.appendChild(link);
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = job?.[keys[i]] || '';
            input.placeholder = keys[i].charAt(0).toUpperCase() + keys[i].slice(1);
            input.className = keys[i];
            input.addEventListener('input', handleInputChange);
            cell.appendChild(input);
        }
        row.appendChild(cell);
    }

    // Only save if job has at least one non-empty value
    if (job && Object.values(job).some(val => val)) {
        row.id = tableBodyEl.children.length;
        row.className = '';
        saveRow(row, row.id);
    }

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', handleDeleteClick);
    row.appendChild(deleteBtn);

    tableBodyEl.appendChild(row);
}
