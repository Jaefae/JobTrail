import { createJobRow, getJob, exportCSV } from './utils/utils.js'

const addJobEl = document.getElementById('add-job');
const tableBodyEl = document.getElementById('job-list-body');
const exportEl = document.getElementById('export');


let jobs = JSON.parse(localStorage.getItem('jobs'));


if (jobs && jobs.length > 0) {
    for (let i = 0; i < jobs.length; i++) {
        createJobRow(tableBodyEl, jobs[i], i, true);
    };
} else {
    createJobRow(tableBodyEl);
}



addJobEl.addEventListener('click', async () => {
    console.log('Add job button clicked');
    const job = await getJob();
    createJobRow(tableBodyEl, job);
});

exportEl.addEventListener('click', async () => {
    exportCSV()
});



