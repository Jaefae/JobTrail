import { createJobRow }  from './utils/utils.js'

const addJobEl = document.getElementById('add-job');
const tableBodyEl = document.getElementById('job-list-body');

addJobEl.addEventListener('click', () => {
    console.log('Add job button clicked');
    createJobRow(tableBodyEl);
})

