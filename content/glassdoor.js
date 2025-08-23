console.log("Glassdoor content script loaded");

function getJob(){
    let job = {};
    const jobTitleLinkEl = document.querySelector(".JobDetails_employerAndJobTitle__nSJrW")
    console.log(jobTitleLinkEl)
    if (jobTitleLinkEl) {
        const jobTitle = jobTitleLinkEl.querySelector("h1").innerText
        const jobLink = jobTitleLinkEl.querySelector("a").href
        job.title = jobTitle
        job.link = jobLink
    }
    const payRangeEl = document.querySelector(".SalaryEstimate_salaryRange__brHFy")
    if (payRangeEl) {
        let salary = payRangeEl.textContent.slice(0,-20); //Remove "Added by employer"
        job.salary = salary;
    }
    const companyEl = document.querySelector(".EmployerProfile_employerNameHeading__bXBYr h4")
    if (companyEl) {
        let company = companyEl.innerText
        job.company = companyEl.innerText
    }
    console.log(job)
    browser.runtime.sendMessage({response: job})
}

let listenerLinked = false;
while(!listenerLinked) {
    try {
        browser.runtime.onMessage.addListener(getJob);
        listenerLinked = true;
        console.log("Glassdoor addJob() listener added");
    } catch (error) {
        console.log(error, "sleeping for 5 seconds")
        sleep(5000)
    }
}