// Social Media Configuration
const CONFIG = {
    tiktok: {
        usernames: {
            iori: 'ioriakito.official.o4',
            shion: 'shion.official.o4'
        }
    },
    twitter: {
        username: 'Ryuya_330'
    }
};

// Initialize all social feeds
function initializeSocialFeeds() {
    loadTikTokFeed();
    loadTwitterFeed();
}

// Load TikTok Feed
function loadTikTokFeed() {
    const ioriTikTokFeed = document.getElementById('iori-tiktok-feed');
    const shionTikTokFeed = document.getElementById('shion-tiktok-feed');

    const loadTikTokEmbed = (element, username) => {
        if (!element) return;

        element.innerHTML = `
            <div class="bg-black/20 backdrop-blur rounded-xl overflow-hidden shadow-lg border border-gray-800/50">
                <blockquote 
                    class="tiktok-embed" 
                    cite="https://www.tiktok.com/@${username}" 
                    data-unique-id="${username}"
                    data-embed-type="creator"
                    style="max-width: 780px; min-width: 288px;">
                    <section></section>
                </blockquote>
            </div>
        `;

        if (window.tiktokReady) {
            window.tiktokReady();
        }
    };

    if (ioriTikTokFeed) {
        loadTikTokEmbed(ioriTikTokFeed, CONFIG.tiktok.usernames.iori);
    }
    if (shionTikTokFeed) {
        loadTikTokEmbed(shionTikTokFeed, CONFIG.tiktok.usernames.shion);
    }
}

// Load Twitter Feed
function loadTwitterFeed() {
    const twitterFeed = document.getElementById('twitter-feed');
    if (!twitterFeed) return;

    twitterFeed.innerHTML = `
        <div class="bg-black/20 backdrop-blur rounded-xl overflow-hidden shadow-lg border border-gray-800/50 p-4">
            <a 
                class="twitter-timeline" 
                data-height="800"
                data-theme="dark"
                data-chrome="noheader nofooter noborders transparent"
                href="https://twitter.com/${CONFIG.twitter.username}">
                Tweets by ${CONFIG.twitter.username}
            </a>
        </div>
    `;

    if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
    }
}

// Initialize social media scripts
function initializeSocialScripts() {
    const tiktokScript = document.createElement('script');
    tiktokScript.src = 'https://www.tiktok.com/embed.js';
    document.body.appendChild(tiktokScript);

    const twitterScript = document.createElement('script');
    twitterScript.src = 'https://platform.twitter.com/widgets.js';
    twitterScript.async = true;
    document.body.appendChild(twitterScript);
}

// Initialize when the page loads
function init() {
    initializeSocialScripts();
    initializeSocialFeeds();
    
    setInterval(() => {
        initializeSocialFeeds();
    }, 5 * 60 * 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
