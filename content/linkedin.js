console.log("LinkedIn content script loaded");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJob(msg) {
    console.log("Hello from getJob in content/indeed.js!")
    jobInfo = {};

    const jobTitleLinkEl = document.querySelector('.job-details-jobs-unified-top-card__job-title a');
    if (jobTitleLinkEl) {
        jobInfo.title = jobTitleLinkEl.textContent.trim();
        jobInfo.link = jobTitleLinkEl.href;
    }
    const companyEl = document.querySelector('.job-details-jobs-unified-top-card__company-name a');
    console.log(companyEl)
    if (companyEl) {
        jobInfo.company = companyEl.textContent.trim();
    }

    const jobDetailEls = document.querySelectorAll('div.job-details-fit-level-preferences button span strong');
    const salaryEl = jobDetailEls[0];

    if (salaryEl) {
        jobInfo.salary = salaryEl.textContent.trim();
    }

    console.log(jobInfo)

    browser.runtime.sendMessage({response: jobInfo});
}


let listenerLinked = false;
while(!listenerLinked) {
    try {
        browser.runtime.onMessage.addListener(getJob);
        listenerLinked = true;
        console.log("Indeed addJob() listener added");
    } catch (error) {
        console.log(error, "sleeping for 5 seconds")
        sleep(5000)
    }
}