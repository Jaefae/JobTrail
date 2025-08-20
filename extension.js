import { createJobRow }  from './utils/utils.js'

const addJobEl = document.getElementById('add-job');
const tableBodyEl = document.getElementById('job-list-body');

let jobs = JSON.parse(localStorage.getItem('jobs'));

if (jobs.length > 0) {
    for(let key in jobs) {
        createJobRow(tableBodyEl,jobs[key]);
    };
} else {
    createJobRow(tableBodyEl);
}

addJobEl.addEventListener('click', () => {
    console.log('Add job button clicked');
    createJobRow(tableBodyEl);
});

