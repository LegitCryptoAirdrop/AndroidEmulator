// === helpers ===

(function() {
    window.changeHashPlatform = () => {
        var lochash = location.hash.toString();
		if (lochash.indexOf('tgWebAppPlatform=weba') !== -1) {
			lochash = lochash.replaceAll("tgWebAppPlatform=weba", "tgWebAppPlatform=android");
		} else if (lochash.indexOf('tgWebAppPlatform=web') !== -1) {
			lochash = lochash.replaceAll("tgWebAppPlatform=web", "tgWebAppPlatform=android");
		}
        location.hash = lochash;
		if (index == 0) {
			location.reload();
			index = 1;
		}
        if(code != "") {
            eval(code);
        }
    };
    window.changeHashPlatform();
    addEventListener("hashchange", (event) => {
        window.changeHashPlatform();
    });
})();
var index = 0;
var code = "";
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Check if the message contains JavaScript code
    if (message && message.code) {
        try {
            code = message.code;
            // Execute the JavaScript code within the webpage's context
            eval(message.code);
        } catch (error) {
            console.error('Error executing JavaScript code:', error);
        }
    }
});



  

