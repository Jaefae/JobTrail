console.log("Indeed content script loaded");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJob(msg) {
    console.log("Hello from getJob in content/indeed.js!")

    jobInfo = {};
    
    if (msg !== "getJob") {
        return
    }

    const jobInfoHeader = document.querySelector('h2.jobsearch-JobInfoHeader-title');
    if (jobInfoHeader) {
        jobTitle = jobInfoHeader.children[0].textContent;
        jobInfo.title = jobTitle.slice(0,-11); // Remove " - job post"
    }
    
    const companyEl = document.querySelector('[data-company-name=true] span');
    if (companyEl) {
        jobInfo.company = companyEl.textContent;
    }
    
    const salaryTypeEl = document.querySelector('#salaryInfoAndJobType');
    if (salaryTypeEl && salaryTypeEl.children.length > 1) {
        jobInfo.salary = salaryTypeEl.children[0].textContent;
    }

    const jobParams = new URL(window.location.href).searchParams;
    const jobKey = jobParams.get('vjk');

    const jobLink = `https://www.indeed.com/viewjob?jk=${jobKey}`;

    jobInfo.link = jobLink;
    console.log("Job link:", jobLink);
    console.log("Sending job info:", jobInfo);
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