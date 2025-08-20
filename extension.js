import { createJobRow }  from './utils/utils.js'

const addJobEl = document.getElementById('add-job');
const tableBodyEl = document.getElementById('job-list-body');

let jobs = JSON.parse(localStorage.getItem('jobs'));

if (jobs) {
    for(let key in jobs) {
        createJobRow(tableBodyEl,jobs[key]);
    };
};

addJobEl.addEventListener('click', () => {
    console.log('Add job button clicked');
    createJobRow(tableBodyEl);
});

