import { createJobRow }  from './utils/utils.js'

const addJobEl = document.getElementById('add-job');
const tableBodyEl = document.getElementById('job-list-body');

let jobs = JSON.parse(localStorage.getItem('jobs'));

if (jobs && jobs.length > 0) {
    for(let i = 0; i < jobs.length; i++) {
        createJobRow(tableBodyEl,jobs[i], i);
    };
} else {
    createJobRow(tableBodyEl);
}

addJobEl.addEventListener('click', () => {
    console.log('Add job button clicked');
    createJobRow(tableBodyEl);
});

