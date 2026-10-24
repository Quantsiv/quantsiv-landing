document.addEventListener('DOMContentLoaded', function () {
    // The menu and the hero's first button are plain links to a chapter's row; the chapter code
    // below opens the row they point to.

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

    // Chapters: each row of the overview is a <details> holding the whole chapter. A click on a
    // row, or on a link to it, slides the chapter open, slides the one that was open shut and
    // scrolls to the row; a click on the open row shuts it. The menu marks the open chapter and
    // the address names it. Nothing opens or shuts as the page scrolls. Without this script the
    // rows still open and close, and the links jump to them.
    const chapters = Array.from(document.querySelectorAll('.chapter'));
    if (chapters.length) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const menuLinks = Array.from(document.querySelectorAll('.nav-link'));

        const isOpen = function (chapter) {
            return chapter.open && !chapter.classList.contains('is-closing');
        };

        const markMenu = function () {
            const open = chapters.find(isOpen);
            menuLinks.forEach(function (a) {
                if (open && a.getAttribute('href') === '#' + open.id) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        };

        // The <details> element opens and shuts at once, so its body is animated from or to
        // zero height around that.
        const slide = function (chapter, open) {
            const body = chapter.querySelector('.chapter-body');
            // Start from where a slide still running has got to
            const from = chapter.open ? body.getBoundingClientRect().height : 0;
            body.getAnimations().forEach(function (a) { a.cancel(); });
            chapter.classList.remove('is-closing');
            if (reducedMotion.matches) {
                chapter.open = open;
                return;
            }
            chapter.open = true;
            const to = open ? body.offsetHeight : 0;
            chapter.classList.add('is-sliding');
            if (!open) chapter.classList.add('is-closing');
            const animation = body.animate(
                { height: [from + 'px', to + 'px'], opacity: open ? [0, 1] : [1, 0] },
                { duration: open ? 450 : 350, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
            );
            animation.onfinish = function () {
                chapter.classList.remove('is-sliding', 'is-closing');
                if (!open) chapter.open = false;
                markMenu();
            };
            animation.oncancel = function () {
                chapter.classList.remove('is-sliding');
            };
        };

        // Scroll so the row lands under the header, allowing for the open chapter above it,
        // which shuts while the page scrolls (style.css turns the browser's own scroll
        // anchoring off, or it would allow for it a second time)
        const scrollToRow = function (chapter, closing) {
            let top = chapter.getBoundingClientRect().top + window.scrollY;
            closing.forEach(function (c) {
                if (c.compareDocumentPosition(chapter) & Node.DOCUMENT_POSITION_FOLLOWING) {
                    top -= c.querySelector('.chapter-body').offsetHeight;
                }
            });
            const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
            window.scrollTo({ top: top - offset, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
        };

        const openChapter = function (chapter) {
            const closing = chapters.filter(function (c) { return c !== chapter && isOpen(c); });
            scrollToRow(chapter, closing);
            closing.forEach(function (c) { slide(c, false); });
            if (!isOpen(chapter)) slide(chapter, true);
            history.replaceState(null, '', '#' + chapter.id);
            markMenu();
        };

        chapters.forEach(function (chapter) {
            chapter.querySelector('summary').addEventListener('click', function (e) {
                e.preventDefault();
                if (isOpen(chapter)) {
                    slide(chapter, false);
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                    markMenu();
                } else {
                    openChapter(chapter);
                }
            });
            // Find in page can open a row on its own
            chapter.addEventListener('toggle', markMenu);
        });

        document.addEventListener('click', function (e) {
            const link = e.target.closest('a[href^="#"]');
            const chapter = link && document.getElementById(link.getAttribute('href').slice(1));
            if (!chapter || !chapter.classList.contains('chapter')) return;
            e.preventDefault();
            openChapter(chapter);
            chapter.querySelector('summary').focus({ preventScroll: true });
        });

        // An address that names a chapter, or something inside one, opens it
        const fromAddress = function () {
            const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
            const chapter = target && target.closest('.chapter');
            if (!chapter) return;
            // The browser may already have opened it; shut the others either way
            chapters.forEach(function (c) { c.open = c === chapter; });
            markMenu();
            target.scrollIntoView();
        };
        fromAddress();
        window.addEventListener('hashchange', fromAddress);
    }

    // Motion: one button pauses the hero drawing, by swapping in its still frame, and the
    // standards banner together (WCAG 2.2.2), and plays them again. style.css also pauses the
    // banner on hover. Under reduced motion neither moves, so the button stays hidden.
    const motionToggle = document.getElementById('motion-toggle');
    const heroArt = document.getElementById('hero-art');
    const banner = document.querySelector('.supported-banner');
    if (motionToggle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        motionToggle.hidden = false;
        motionToggle.addEventListener('click', function () {
            const paused = !motionToggle.classList.contains('is-paused');
            motionToggle.classList.toggle('is-paused', paused);
            motionToggle.setAttribute('aria-label', paused ? motionToggle.dataset.labelPlay : motionToggle.dataset.labelPause);
            if (heroArt) heroArt.setAttribute('src', paused ? heroArt.dataset.still : heroArt.dataset.motion);
            if (banner) banner.classList.toggle('is-paused', paused);
        });
    }

    // Deadlines: the dates already past get a filled marker and later ones an open one, with
    // a "today" marker between them on the line. Without this script the line is plain.
    const deadlines = document.querySelector('.deadlines');
    if (deadlines) {
        const today = new Date().toISOString().slice(0, 10);
        let marked = false;
        deadlines.querySelectorAll('.deadline').forEach(function (item) {
            const future = item.dataset.date > today;
            item.classList.add(future ? 'is-future' : 'is-past');
            if (future && !marked) {
                marked = true;
                const now = document.createElement('li');
                const label = document.createElement('span');
                now.className = 'deadline-now';
                now.setAttribute('aria-hidden', 'true');
                label.textContent = deadlines.dataset.labelNow || 'Today';
                now.appendChild(label);
                item.before(now);
            }
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
                return;
            }

            // A valid address goes to the form's own action, the email service named in the
            // privacy notice, as the same post the browser sends without this script. The post
            // goes to a hidden, sandboxed frame instead of replacing the page, so the page stays
            // where it is and the confirmation takes the form's place. The service's reply is
            // never read or run here.
            let sink = document.getElementById('form-sink');
            if (!sink) {
                sink = document.createElement('iframe');
                sink.id = 'form-sink';
                sink.name = 'form-sink';
                sink.hidden = true;
                sink.tabIndex = -1;
                sink.title = '';
                sink.setAttribute('aria-hidden', 'true');
                sink.setAttribute('sandbox', '');
                document.body.appendChild(sink);
            }
            form.target = sink.name;
            window.setTimeout(function () {
                form.classList.add('is-sent');
                formMessage.textContent = form.dataset.msgSent || 'Thanks! Check your inbox and confirm your address to join the waitlist.';
                formMessage.tabIndex = -1;
                formMessage.hidden = false;
                formMessage.focus({ preventScroll: true });
            }, 0);
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