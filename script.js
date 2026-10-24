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
    // row, or on a link to it, slides the chapter open, shuts the one that was open, and scrolls
    // to the row; the menu marks the chapter being read. From then on reading is continuous:
    // when the next row reaches the baseline (55% down the screen) its chapter opens, scrolling
    // back up reopens the one before, and a chapter that has left the screen shuts, with the
    // scroll position adjusted so the view stays still (style.css turns the browser's own
    // scroll anchoring off, or it would adjust a second time). Scrolling alone never opens the
    // first chapter, and shutting a chapter by its row ends the continuous reading until the
    // next click. Without this script the rows still open and close, and the links jump to them.
    const chapters = Array.from(document.querySelectorAll('.chapter'));
    if (chapters.length) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const menuLinks = Array.from(document.querySelectorAll('.nav-link'));
        const BASELINE = 0.55;
        let reading = false;
        // A scroll the reader did not make (to a row, or to an address) is "settling" until it
        // comes to rest; a keyboard focus move is quiet for a moment
        let settling = false;
        let settleTimer = 0;
        let quietUntil = 0;
        let lastY = window.scrollY;
        let down = true;
        let ticking = false;

        const isOpen = function (chapter) {
            return chapter.open && !chapter.classList.contains('is-closing');
        };
        const rowTop = function (chapter) {
            return chapter.querySelector('summary').getBoundingClientRect().top;
        };
        const baseline = function () {
            return window.innerHeight * BASELINE;
        };

        // The chapter being read: of the open ones, the last whose row is above the baseline,
        // else the first
        const current = function () {
            const open = chapters.filter(isOpen);
            const above = open.filter(function (c) { return rowTop(c) <= baseline(); });
            return above.length ? above[above.length - 1] : open[0];
        };

        const markMenu = function () {
            const open = current();
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
                // The page may have moved while it slid: look again
                readOn();
            };
            animation.oncancel = function () {
                chapter.classList.remove('is-sliding');
            };
        };

        // Scroll so the row lands under the header, allowing for the open chapters above it,
        // which shut while the page scrolls
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

        // Once the page has come to rest, it is read as if the reader had scrolled down to it
        const settle = function () {
            settling = true;
            clearTimeout(settleTimer);
            settleTimer = setTimeout(function () {
                settling = false;
                lastY = window.scrollY;
                down = true;
                readOn();
            }, 200);
        };

        const openChapter = function (chapter) {
            // While reading on, two chapters can be open as one hands over to the next
            const closing = chapters.filter(function (c) { return c !== chapter && isOpen(c); });
            reading = true;
            settle();
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
                    reading = false;
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
            reading = true;
            settle();
            markMenu();
            target.scrollIntoView();
        };

        // The reader's own wheel, touch or keys end a settling scroll at once
        ['wheel', 'touchmove', 'keydown'].forEach(function (type) {
            window.addEventListener(type, function () {
                if (!settling) return;
                clearTimeout(settleTimer);
                settling = false;
            }, { passive: true });
        });
        // Moving the keyboard focus scrolls the page too; a keyboard reader opens rows with
        // Enter instead. Focus that follows a click or a tap is not the keyboard's.
        let pointerAt = 0;
        document.addEventListener('pointerdown', function () {
            pointerAt = Date.now();
        }, true);
        document.addEventListener('focusin', function () {
            if (Date.now() - pointerAt > 500) quietUntil = Date.now() + 600;
        });

        // Continuous reading, as described above. A change of height above the reader is
        // compensated in one step, which must not be smooth. The position is set from the
        // document's change of height, not scrolled by it: near the end of the page the
        // browser already pulls the view up as soon as the page gets shorter, and a relative
        // scroll would move it a second time.
        const keepStill = function (change) {
            const root = document.documentElement;
            const y = window.scrollY;
            const height = root.scrollHeight;
            change();
            const was = root.style.scrollBehavior;
            root.style.scrollBehavior = 'auto';
            window.scrollTo(0, y + root.scrollHeight - height);
            root.style.scrollBehavior = was;
            // Only the reader's own scrolling tells the direction
            lastY = window.scrollY;
        };
        function readOn() {
            const y = window.scrollY;
            if (y !== lastY) down = y > lastY;
            lastY = y;
            if (!reading || settling || Date.now() < quietUntil || ticking) return;
            // Past either end of the page (a touch screen's bounce) nothing opens or shuts
            if (y < 0 || y > document.documentElement.scrollHeight - window.innerHeight) return;
            ticking = true;
            requestAnimationFrame(function () {
                ticking = false;
                let target = null;
                chapters.forEach(function (c) { if (rowTop(c) <= baseline()) target = c; });
                if (target && !target.open) {
                    if (down) {
                        // Reached from above: it unfolds under its row
                        slide(target, true);
                    } else {
                        // Reached from below: it opens above the reader, and the view stays
                        keepStill(function () { target.open = true; });
                        if (!reducedMotion.matches) {
                            target.querySelector('.chapter-body').animate({ opacity: [0, 1] }, { duration: 350 });
                        }
                    }
                }
                chapters.forEach(function (c) {
                    if (c === target || !c.open || c.classList.contains('is-sliding')) return;
                    const r = c.getBoundingClientRect();
                    if (r.bottom < 0) {
                        keepStill(function () { c.open = false; });
                    } else if (r.top > window.innerHeight) {
                        c.open = false;
                    }
                });
                markMenu();
                // The address names the chapter being read
                const now = current();
                if (window.location.hash !== (now ? '#' + now.id : '')) {
                    history.replaceState(null, '', now ? '#' + now.id : window.location.pathname + window.location.search);
                }
            });
        }
        window.addEventListener('scroll', function () {
            if (settling) settle();
            else readOn();
        }, { passive: true });
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