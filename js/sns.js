// Social Media Configuration
// NOTE: For production, set the YouTube API key via a server-side environment or
// platform secret and inject it into the page. For local testing you can replace
// the 'YOUR_YOUTUBE_API_KEY' string below with your real key (not recommended
// in a public repo).
const CONFIG = {
    youtube: {
        apiKey: 'YOUR_YOUTUBE_API_KEY', // replace with real key or keep empty to use iframe fallback
        channelIds: {
            ryuya: '@Ryuya_330',
            iori: '@ioriakito.official.o4',
            shion: '@shion.official.o4'
        },
        maxResults: 6
    },
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
// Allow overriding via a local config script (create js/config.local.js that sets window.SITE_CONFIG)
if (window.SITE_CONFIG && window.SITE_CONFIG.youtubeApiKey) {
    CONFIG.youtube.apiKey = window.SITE_CONFIG.youtubeApiKey;
}

// Initialize all social feeds
function initializeSocialFeeds() {
    loadYouTubeFeed();
    loadTikTokFeed();
    loadTwitterFeed();
}

// Load YouTube Feed
async function loadYouTubeFeed() {
    const ioriYoutubeFeed = document.getElementById('iori-youtube-feed');
    const shionYoutubeFeed = document.getElementById('shion-youtube-feed');
    const ryuyaYoutubeFeed = document.getElementById('ryuya-youtube-feed');
    if (!ioriYoutubeFeed && !shionYoutubeFeed && !ryuyaYoutubeFeed) return;

    const resolveChannelId = async (handleOrId) => {
        // If already looks like a channel ID (starts with UC), return as-is
        if (!handleOrId) return null;
        if (handleOrId.startsWith('UC')) return handleOrId;
        // If starts with @ or looks like a username, try to search for the channel ID via the Data API
        const query = handleOrId.startsWith('@') ? handleOrId.slice(1) : handleOrId;
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&key=${CONFIG.youtube.apiKey}&maxResults=1`);
            if (!res.ok) return null;
            const d = await res.json();
            if (d.items && d.items[0] && d.items[0].id && d.items[0].id.channelId) {
                return d.items[0].id.channelId;
            }
        } catch (e) {
            console.warn('Could not resolve channel id for', handleOrId, e);
        }
        return null;
    };

    const loadChannelVideos = async (channelId, element) => {
        // Support two modes:
        // 1) If a real YouTube API key is provided, use the Data API to get latest videos.
        // 2) If no API key (or placeholder), fall back to an iframe embed of the channel's uploads.
        try {
            element.innerHTML = '';

            // Fallback: use iframe embed if API key not provided
            if (!CONFIG.youtube.apiKey || CONFIG.youtube.apiKey === 'YOUR_YOUTUBE_API_KEY') {
                const handle = channelId.startsWith('@') ? channelId.slice(1) : channelId;
                const wrapper = document.createElement('div');
                wrapper.className = 'rounded-xl overflow-hidden bg-black/20 backdrop-blur shadow-lg border border-gray-800/50';
                wrapper.innerHTML = `
                    <iframe width="100%" height="360" src="https://www.youtube.com/embed/?listType=user_uploads&list=${encodeURIComponent(handle)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
                element.appendChild(wrapper);
                return;
            }

            // Otherwise use YouTube Data API
            // If the provided identifier looks like a handle (starts with '@'), try to resolve to channelId
            let resolvedChannelId = channelId;
            if (channelId && channelId.startsWith('@')) {
                const candidate = await resolveChannelId(channelId);
                if (candidate) resolvedChannelId = candidate;
            }

            if (!resolvedChannelId || resolvedChannelId.startsWith('@')) {
                // Could not resolve to a channelId; fall back to channel page link
                const handle = channelId.startsWith('@') ? channelId.slice(1) : channelId;
                const wrapper = document.createElement('div');
                wrapper.className = 'rounded-xl overflow-hidden bg-black/20 backdrop-blur shadow-lg border border-gray-800/50 p-8 text-center';
                wrapper.innerHTML = `
                    <p class="mb-4 text-gray-300">チャンネルの埋め込みを表示できません。チャンネルページへ移動します。</p>
                    <a href="https://www.youtube.com/@${encodeURIComponent(handle)}" target="_blank" rel="noopener noreferrer" class="inline-block bg-[#FF0000] text-white py-2 px-6 rounded-full">YouTube チャンネルを開く</a>
                `;
                element.appendChild(wrapper);
                return;
            }

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.youtube.apiKey}&channelId=${resolvedChannelId}&part=snippet,id&order=date&maxResults=${CONFIG.youtube.maxResults}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.items || data.items.length === 0) {
                element.innerHTML = '<p class="text-center text-gray-400">動画がありません</p>';
                return;
            }

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

            data.items.forEach((item, index) => {
                if (item.id.videoId) {
                    const card = document.createElement('div');
                    card.className = 'fade-in-up bg-black/20 backdrop-blur rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] shadow-lg border border-gray-800/50';
                    card.style.transitionDelay = `${index * 100}ms`;

                    card.innerHTML = `
                        <div class="relative pb-[56.25%]">
                            <iframe
                                src="https://www.youtube.com/embed/${item.id.videoId}"
                                title="${item.snippet.title}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                class="absolute top-0 left-0 w-full h-full"
                            ></iframe>
                        </div>
                        <div class="p-4">
                            <h4 class="text-lg font-bold mb-2 line-clamp-2 hover:line-clamp-none transition-all duration-300">${item.snippet.title}</h4>
                            <p class="text-sm text-gray-400">公開日: ${new Date(item.snippet.publishedAt).toLocaleDateString('ja-JP')}</p>
                            <p class="text-sm text-gray-300 mt-2 line-clamp-2 hover:line-clamp-none transition-all duration-300">${item.snippet.description}</p>
                        </div>
                    `;

                    grid.appendChild(card);
                }
            });

            element.appendChild(grid);

        } catch (error) {
            console.error('Error loading YouTube feed:', error);
            element.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-red-400 mb-2">YouTube フィードの読み込みに失敗しました</p>
                    <button onclick="retryLoadYouTubeFeed('${channelId}')" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                        再読み込み
                    </button>
                </div>
            `;
        }
    };

    // Load feeds for both channels
    if (ioriYoutubeFeed) {
        await loadChannelVideos(CONFIG.youtube.channelIds.iori, ioriYoutubeFeed);
    }
    if (shionYoutubeFeed) {
        await loadChannelVideos(CONFIG.youtube.channelIds.shion, shionYoutubeFeed);
    }
    if (ryuyaYoutubeFeed) {
        await loadChannelVideos(CONFIG.youtube.channelIds.ryuya, ryuyaYoutubeFeed);
    }
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

        // Force TikTok embed script to re-run
        if (window.tiktokReady) {
            window.tiktokReady();
        }
    };

    // Load embeds for both accounts
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

    // Force Twitter widget script to re-run
    if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
    }
}

// Initialize social media scripts
function initializeSocialScripts() {
    // Initialize TikTok embed script
    const tiktokScript = document.createElement('script');
    tiktokScript.src = 'https://www.tiktok.com/embed.js';
    document.body.appendChild(tiktokScript);

    // Initialize Twitter embed script
    const twitterScript = document.createElement('script');
    twitterScript.src = 'https://platform.twitter.com/widgets.js';
    twitterScript.async = true;
    document.body.appendChild(twitterScript);
}

// Initialize when the page loads
function init() {
    initializeSocialScripts();
    initializeSocialFeeds();
    
    // Refresh feeds periodically
    setInterval(() => {
        initializeSocialFeeds();
    }, 5 * 60 * 1000); // Every 5 minutes
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for external use if needed
window.retryLoadYouTubeFeed = function(channelId) {
    loadYouTubeFeed();
};
