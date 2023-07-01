(() => {
    chrome.runtime.onMessage.addListener((request, sender, response) => {
        if (request.method == "getContext") {
            // TODO: Revise the method for extracting context from the webpage below
            // For now, assume it is a simple function that scrapes all visible text
            const context = extractContextFromWebpage();

            // Send the context back to the background script
            response({data: context, method: "getContext"});
        }
    });

    const extractContextFromWebpage = () => {
        let textContent = "";
    
        // Extract visible text from p tags
        let paragraphs = document.querySelectorAll('p');
        for (let p of paragraphs) {
            textContent += " " + p.textContent;
        }
    
        // Extract visible text from h1, h2, h3 tags
        let headings = document.querySelectorAll('h1, h2, h3');
        for (let h of headings) {
            textContent += " " + h.textContent;
        }
    
        return textContent;
    };
    
})();