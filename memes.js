document.addEventListener('DOMContentLoaded', () => {
    const memesContainer = document.getElementById('memes-container');
    const searchInput = document.getElementById('searchInput');
    let memes = [];

    fetch('https://www.reddit.com/r/meme/.json')
        .then(response => response.json())
        .then(data => {
            memes = data.data.children;
            displayMemes(memes);
        })
        .catch(error => {
            console.error('Error fetching memes:', error);
            memesContainer.textContent = 'Failed to load memes. Please try again later.';
        });

    function displayMemes(memesToDisplay) {
        memesContainer.innerHTML = '';
        memesToDisplay.forEach(meme => {
            let imageUrl = null;
            if (meme.data.post_hint === 'image' && meme.data.url) {
                imageUrl = meme.data.url;
            }
            if (meme.data.preview && meme.data.preview.images && meme.data.preview.images.length > 0 && meme.data.preview.images[0].source && meme.data.preview.images[0].source.url) {
                const previewUrl = meme.data.preview.images[0].source.url;
                if (previewUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
                    imageUrl = previewUrl;
                }
            }

            if (imageUrl) {
                const memeElement = document.createElement('div');
                memeElement.classList.add('meme');

                const title = document.createElement('h2');
                title.textContent = meme.data.title;

                const image = document.createElement('img');
                image.src = imageUrl;
                image.alt = meme.data.title;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit Meme';
                editButton.classList.add('btn');
                editButton.addEventListener('click', () => {
                    const editorSection = document.getElementById('editor-section');
                    const heroSection = document.getElementById('hero-section');
                    const contentSection = document.getElementById('content-section');
                    const memesSection = document.getElementById('memes-section');

                    heroSection.classList.add('hidden');
                    contentSection.classList.add('hidden');
                    memesSection.classList.add('hidden');
                    editorSection.classList.remove('hidden');

                    const event = new CustomEvent('editMeme', { detail: { imageUrl } });
                    document.dispatchEvent(event);
                });

                memeElement.appendChild(title);
                memeElement.appendChild(image);
                memeElement.appendChild(editButton);
                memesContainer.appendChild(memeElement);
            }
        });
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMemes = memes.filter(meme => {
            return meme.data.title.toLowerCase().includes(searchTerm);
        });
        displayMemes(filteredMemes);
    });
});