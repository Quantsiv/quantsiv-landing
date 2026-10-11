document.addEventListener('DOMContentLoaded', function () {
    // Navigation links are plain anchors: style.css scrolls smoothly unless the
    // visitor asks for reduced motion, and the browser moves focus and the URL.

    // Form handling
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            // Clear previous messages
            formMessage.hidden = true;
            formMessage.textContent = '';
            emailInput.classList.remove('error');

            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.hidden = false;
                formMessage.style.color = 'var(--color-black)';
                emailInput.classList.add('error');
                return;
            }

            // The waitlist is not open yet, so nothing is sent or stored
            formMessage.textContent = 'The waitlist is not open yet. Nothing was sent.';
            formMessage.hidden = false;
            formMessage.style.color = 'var(--color-black)';
            form.reset();
        });
    }

    // Marquee effect for supported companies banner
    // The track already holds two identical groups in the markup, so the
    // -50% keyframe loops seamlessly without cloning anything in here.
    const bannerTrack = document.querySelector('.banner-track');
    if (bannerTrack) {
        // Pause on hover
        bannerTrack.addEventListener('mouseenter', () => {
            bannerTrack.style.animationPlayState = 'paused';
        });

        bannerTrack.addEventListener('mouseleave', () => {
            bannerTrack.style.animationPlayState = 'running';
        });
    }
});