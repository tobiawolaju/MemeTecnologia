document.addEventListener('DOMContentLoaded', () => {
    const memesContainer = document.getElementById('memes-container');

    fetch('https://www.reddit.com/r/meme/.json')
        .then(response => response.json())
        .then(data => {
            const memes = data.data.children;
            memes.forEach(meme => {
                // Ensure it's an image post and has a valid image URL
                let imageUrl = null;
                if (meme.data.post_hint === 'image' && meme.data.url) {
                    imageUrl = meme.data.url;
                }
                // Prioritize direct image from preview if available and it's a valid image type
                if (meme.data.preview && meme.data.preview.images && meme.data.preview.images.length > 0 && meme.data.preview.images[0].source && meme.data.preview.images[0].source.url) {
                    const previewUrl = meme.data.preview.images[0].source.url;
                    // Basic check for image file extension
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
                    image.src = imageUrl; // Use the determined image URL for display
                    image.alt = meme.data.title;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit Meme';
                    editButton.classList.add('btn');
                    editButton.addEventListener('click', () => {
                        // Pass the determined image URL to the editor
                        window.location.href = `edit.html?imageUrl=${encodeURIComponent(imageUrl)}`;
                    });

                    memeElement.appendChild(title);
                    memeElement.appendChild(image);
                    memeElement.appendChild(editButton);
                    memesContainer.appendChild(memeElement);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching memes:', error);
            memesContainer.textContent = 'Failed to load memes. Please try again later.';
        });
});