// loadTalesFeed() will be called from app.js after animationObserver is initialized.

function loadTalesFeed() {
    console.log('novel.js: loadTalesFeed called');
    const talesFeedContainer = document.getElementById('tales-feed-container');
    talesFeedContainer.innerHTML = '<p class="text-center">最新の物語を読み込んでいます...</p>';
    const rssUrl = 'https://tales.note.com/ryuya_330/rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
        .then(data => {
            console.log('novel.js: Data fetched', data);
            if (data.status === 'ok') {
                talesFeedContainer.innerHTML = '';
                data.items.forEach((item, index) => {
                    const snippet = item.description.replace(/<[^>]*>/g, "").substring(0, 100) + '...';
                    const pubDate = new Date(item.pubDate).toLocaleDateString('ja-JP');
                    const thumbnailHtml = item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.title}" class="w-full md:w-48 h-auto rounded-md object-cover">` : '';
                    const cardHtml = `
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="tales-card block rounded-lg p-6">
                            <div class="flex flex-col md:flex-row md:items-center gap-6">
                                ${thumbnailHtml}
                                <div>
                                    <h4 class="text-xl font-bold mb-2 hover:text-accent-color transition-colors">${item.title}</h4>
                                    <p class="text-sm text-gray-400 mb-3">${pubDate}</p>
                                    <p class="text-gray-300">${snippet}</p>
                                </div>
                            </div>
                        </a>`;
                    talesFeedContainer.insertAdjacentHTML('beforeend', cardHtml);
                    const newCard = talesFeedContainer.lastElementChild;
                    if (newCard) {
                        newCard.classList.add('fade-in-up');
                        newCard.style.transitionDelay = `${index * 100}ms`;
                        if (window.animationObserver) {
                            console.log('novel.js: Observing new card', newCard);
                            window.animationObserver.observe(newCard);
                        } else {
                            console.warn('novel.js: window.animationObserver is still not defined after delay. Adding visible class directly.');
                            newCard.classList.add('visible'); // Fallback if observer still not ready
                        }
                    }
                });
            } else {
                throw new Error('RSS feed could not be loaded.');
            }
        })
        .catch(error => {
            console.error('Error fetching tales feed:', error);
            talesFeedContainer.innerHTML = '<p class="text-center text-red-400">物語の読み込みに失敗しました。</p>';
        });
}