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
                e.preventDefault();
            }
            // A valid address goes on to the form's own action: the browser posts it to the
            // email service named in the privacy notice. This script sends nothing itself.
        });
    }

    // Standards banner. The track already holds two identical groups in the markup, so the
    // -50% keyframe loops seamlessly without cloning anything in here. style.css pauses it on
    // hover; the button stops and restarts it (WCAG 2.2.2). Under reduced motion it never moves,
    // so the button stays hidden.
    const banner = document.querySelector('.supported-banner');
    const bannerToggle = document.getElementById('banner-toggle');
    if (banner && bannerToggle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        bannerToggle.hidden = false;
        bannerToggle.addEventListener('click', function () {
            const paused = banner.classList.toggle('is-paused');
            bannerToggle.textContent = paused ? bannerToggle.dataset.labelPlay : bannerToggle.dataset.labelPause;
        });
    }

    // Product preview in "How Quantsiv Works". The finding links pick a finding and the three
    // step tabs pick its panel. Without this script every panel shows (noscript.css) and the
    // links jump to each finding.
    const demo = document.getElementById('demo');
    if (demo) {
        const items = Array.from(demo.querySelectorAll('.demo-item'));
        const links = Array.from(demo.querySelectorAll('.demo-finding-link'));
        const tabs = Array.from(demo.querySelectorAll('.demo-step'));
        const announce = demo.querySelector('.demo-announce');
        const detail = demo.querySelector('.demo-detail');
        const state = { item: items[0].id, panel: tabs[0].dataset.panel };

        tabs.forEach(function (tab) {
            tab.id = 'demo-tab-' + tab.dataset.panel;
        });
        items.forEach(function (item) {
            item.querySelectorAll('.demo-panel').forEach(function (panel) {
                panel.setAttribute('role', 'tabpanel');
                panel.tabIndex = 0;
            });
        });

        const render = function () {
            items.forEach(function (item) {
                const current = item.id === state.item;
                item.classList.toggle('is-current', current);
                item.querySelectorAll('.demo-panel').forEach(function (panel) {
                    panel.classList.toggle('is-current', current && panel.dataset.panel === state.panel);
                });
            });
            links.forEach(function (link) {
                if (link.dataset.finding === state.item) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
            let before = true;
            tabs.forEach(function (tab) {
                const selected = tab.dataset.panel === state.panel;
                if (selected) before = false;
                tab.setAttribute('aria-selected', String(selected));
                tab.setAttribute('aria-controls', state.item + '-' + tab.dataset.panel);
                tab.tabIndex = selected ? 0 : -1;
                tab.classList.toggle('is-done', before && !selected);
            });
        };

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                state.item = link.dataset.finding;
                render();
                const title = document.getElementById(state.item + '-' + state.panel + '-title');
                if (announce && title) announce.textContent = title.textContent;
                // Narrow screens stack the list above the finding: bring the finding into view
                if (detail && detail.getBoundingClientRect().top > window.innerHeight * 0.6) {
                    detail.scrollIntoView({ block: 'start' });
                }
            });
        });

        const select = function (tab) {
            state.panel = tab.dataset.panel;
            render();
            tab.focus();
        };
        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { select(tab); });
            // Arrow keys, Home and End move between the steps (WAI-ARIA tabs pattern)
            tab.addEventListener('keydown', function (e) {
                let next = null;
                if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
                else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
                else if (e.key === 'Home') next = tabs[0];
                else if (e.key === 'End') next = tabs[tabs.length - 1];
                if (next) {
                    e.preventDefault();
                    select(next);
                }
            });
        });
        render();
    }
});