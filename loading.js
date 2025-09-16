document.addEventListener('DOMContentLoaded', () => {
    const initialDisplay = document.getElementById('initial-ryuya-display');
    const mainContent = document.getElementById('main-content');
    const ryuyaText = 'Ryuya';
    const h1Element = initialDisplay.querySelector('h1');

    // Split 'Ryuya' into individual spans for animation
    h1Element.innerHTML = ryuyaText.split('').map(char => `<span>${char}</span>`).join('');
    const charSpans = h1Element.querySelectorAll('span');

    let currentIndex = 0;
    const displayInterval = setInterval(() => {
        if (currentIndex < charSpans.length) {
            const randomIndex = Math.floor(Math.random() * charSpans.length);
            // Ensure each character is displayed only once
            let charToDisplay = -1;
            let attempts = 0;
            while (charToDisplay === -1 || charSpans[charToDisplay].classList.contains('visible')) {
                charToDisplay = Math.floor(Math.random() * charSpans.length);
                attempts++;
                if (attempts > charSpans.length * 2) { // Prevent infinite loop in case of bug
                    break;
                }
            }

            if (charToDisplay !== -1) {
                charSpans[charToDisplay].classList.add('visible');
                currentIndex++;
            }
        } else {
            clearInterval(displayInterval);
            // All characters displayed, wait a moment then fade out
            setTimeout(() => {
                initialDisplay.classList.add('hidden');
                // Use a short timeout to ensure the 'hidden' class (opacity 0) is applied before display: none
                setTimeout(() => {
                    initialDisplay.style.display = 'none';
                    mainContent.classList.add('main-content-visible'); // Make it visible using the class
                    // Force reflow before setting opacity to ensure transition works
                    void mainContent.offsetWidth;

                    // Initialize site features after main content is visible
                    if (window.initializeSiteFeatures) {
                        window.initializeSiteFeatures();
                    }
                }, 500); // Half a second after initialDisplay starts fading
            }, 1500); // Increased wait time after full display
        }
    }, 250); // Increased random display interval for each character

});