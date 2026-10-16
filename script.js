document.addEventListener('DOMContentLoaded', function () {
    // Navigation links are plain anchors: style.css scrolls smoothly unless the
    // visitor asks for reduced motion, and the browser moves focus and the URL.

    // Small screens: the burger button opens the menu panel. style.css shows the button
    // only there; noscript.css shows the menu as rows when this script cannot run.
    const menuToggle = document.querySelector('.menu-toggle');
    const siteMenu = document.getElementById('site-menu');
    if (menuToggle && siteMenu) {
        const setMenu = function (open) {
            menuToggle.setAttribute('aria-expanded', String(open));
            siteMenu.classList.toggle('is-open', open);
        };
        const isOpen = function () {
            return menuToggle.getAttribute('aria-expanded') === 'true';
        };
        menuToggle.addEventListener('click', function () {
            setMenu(!isOpen());
        });
        // Following a link, clicking outside the header or pressing Escape closes it.
        siteMenu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('click', function (e) {
            if (isOpen() && !e.target.closest('.site-header')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen()) {
                setMenu(false);
                menuToggle.focus();
            }
        });
    }

    // Header menu: fill in the link of the section in view. The hero has no link,
    // so scrolling back to the top clears the menu.
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const navTargets = [document.querySelector('.hero')].concat(
        navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); })
    ).filter(Boolean);
    if ('IntersectionObserver' in window && navLinks.length) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) {
                    if (entry.target.id && a.getAttribute('href') === '#' + entry.target.id) {
                        a.setAttribute('aria-current', 'true');
                    } else {
                        a.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        navTargets.forEach(function (el) { observer.observe(el); });
    }

    // Hero drawing: the button swaps the looping drawing for its still frame and back.
    // Under reduced motion the <picture> already shows the still, so the button stays hidden.
    const heroArt = document.getElementById('hero-art');
    const heroToggle = document.getElementById('hero-art-toggle');
    if (heroArt && heroToggle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        heroToggle.hidden = false;
        heroToggle.addEventListener('click', function () {
            const playing = heroArt.getAttribute('src') === heroArt.dataset.motion;
            heroArt.setAttribute('src', playing ? heroArt.dataset.still : heroArt.dataset.motion);
            heroToggle.textContent = playing ? heroToggle.dataset.labelPlay : heroToggle.dataset.labelPause;
        });
    }

    // Form handling. Messages come from the form's data-msg-* attributes,
    // so each language version of the page supplies its own wording.
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
                formMessage.textContent = form.dataset.msgInvalid || 'Please enter a valid email address.';
                formMessage.hidden = false;
                emailInput.classList.add('error');
                return;
            }

            // The waitlist is not open yet, so nothing is sent or stored
            formMessage.textContent = form.dataset.msgClosed || 'The waitlist is not open yet. Nothing was sent.';
            formMessage.hidden = false;
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