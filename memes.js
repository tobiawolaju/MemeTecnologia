document.addEventListener('DOMContentLoaded', () => {
    const memesContainer = document.getElementById('memes-container');

    fetch('https://www.reddit.com/r/meme/.json')
        .then(response => response.json())
        .then(data => {
            const memes = data.data.children;
            memes.forEach(meme => {
                if (meme.data.post_hint === 'image') {
                    const memeElement = document.createElement('div');
                    memeElement.classList.add('meme');

                    const title = document.createElement('h2');
                    title.textContent = meme.data.title;

                    const image = document.createElement('img');
                    image.src = meme.data.url;
                    image.alt = meme.data.title;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit Meme';
                    editButton.classList.add('btn'); // Use existing button style
                    editButton.addEventListener('click', () => {
                        window.location.href = `edit.html?imageUrl=${encodeURIComponent(meme.data.url)}`;
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