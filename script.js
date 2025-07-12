        // Simple click handlers
        document.querySelectorAll('.btn, .cta-button').forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.textContent.includes('FREE TRIAL') || this.textContent.includes('TRY FOR FREE')) {
                    e.preventDefault();
                    alert('🚀 Starting your free trial! Sign-up would happen here.');
                } else if (this.textContent.includes('Login')) {
                    e.preventDefault();
                    alert('🔐 Login form would appear here.');
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