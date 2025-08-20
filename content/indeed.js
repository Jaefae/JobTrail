console.log("Indeed content script loaded");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJob(msg) {
    console.log("Hello from getJob in content/indeed.js!")
    if (msg !== "getJob") {
        return
    }


}


let listenerLinked = false;
while(!listenerLinked) {
    try {
        browser.runtime.onMessage.addListener(getJob);
        listenerLinked = true;
    } catch (error) {
        console.log(error, "sleeping for 5 seconds")
        sleep(5000)
    }
}
console.log("Hello from the other side")