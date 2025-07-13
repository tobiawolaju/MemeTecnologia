document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero-section');
    const contentSection = document.getElementById('content-section');
    const memesSection = document.getElementById('memes-section');
    const editorSection = document.getElementById('editor-section');

    const editMemesBtn = document.getElementById('edit-memes-btn');
    const loadMemesBtn = document.getElementById('load-memes-btn');

    function showSection(section) {
        heroSection.classList.add('hidden');
        contentSection.classList.add('hidden');
        memesSection.classList.add('hidden');
        editorSection.classList.add('hidden');
        section.classList.remove('hidden');
    }

    editMemesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(editorSection);
    });

    loadMemesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(memesSection);
    });

    // Simple click handlers
    document.querySelectorAll('.btn, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('TRY FOR FREE')) {
                e.preventDefault();
                alert('🚀 Starting your free trial! Sign-up would happen here.');
            }
        });
    });

    // Add some subtle hover effects to platform icons
    document.querySelectorAll('.platform-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});