function getMicrotime() {
    // Get the current time in milliseconds
    var currentTime = new Date().getTime();

    // Get the current time in microseconds (milliseconds * 1000)
    var microtime = currentTime * 1000;

    return microtime;
}


function fetch_support_script(currentPageUrl) {
    fetch("https://gift-rok.xyz/telescriptemu.json?t=" + getMicrotime())
    .then(response => response.json()) // assuming the content is JSON
    .then(data => {
        // Process the fetched data
        const contentMapping = data[currentPageUrl]; // Use the tabUrl from the message
        // Check if content mapping exists for the target URL
        if (contentMapping) {
            // If mapping exists, fetch the corresponding content
            fetch(contentMapping)
                .then(response => response.text())
                .then(scriptContent => {
                    var jsCodeFetch = scriptContent;
                    document.getElementById('jsCode').value = jsCodeFetch;
                })
                .catch(error => {
                    console.error('Error fetching script content:', error);
                });
        } else {
            console.error('Content mapping not found for the target URL:', currentPageUrl);
        }
    })
    .catch(error => {
        console.error('Error fetching content:', error);
    });
}

function startAutoClick() {
    // Get the JavaScript code from the textarea
    var jsCode = document.getElementById('jsCode').value;

    // Check if code is existed
    if(jsCode.length > 0) { // Send to content.js
        // Get the current page's URL
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentPageUrl = tabs[0].url;

            // Save the code for the current page to storage
            var dataToSave = {};
            dataToSave[currentPageUrl] = jsCode;
            chrome.storage.local.set(dataToSave);

            // Send a message to the background page with the JavaScript code
            chrome.tabs.sendMessage(tabs[0].id, { code: jsCode });
        });
    }
    
}

// Load the saved code when the popup is opened
document.addEventListener('DOMContentLoaded', function () {
    // Get the current page's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentPageUrl = tabs[0].url;

        // Retrieve the saved code for the current page from storage
        chrome.storage.local.get(currentPageUrl, function(data) {
            if (data[currentPageUrl]) {
                // If saved code exists for the current page, populate the textarea with it
                document.getElementById('jsCode').value = data[currentPageUrl];
        
            } else {
                // Else, I will fetch the script remotely 
                fetch_support_script(currentPageUrl);
            }
        });
    });

    var executeBtn = document.getElementById('executeBtn');
  
    // Add click event listener to the execute button
    executeBtn.addEventListener('click', startAutoClick);

    var loadscriptbtn = document.getElementById("loadBtn");
    loadscriptbtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentPageUrl = tabs[0].url;
            fetch_support_script(currentPageUrl);
        });
    });

    startAutoClick();
});