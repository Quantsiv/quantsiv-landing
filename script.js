document.addEventListener('DOMContentLoaded', function () {
    // The menu and the hero's first button are plain links to a chapter's card; the chapter code
    // below opens the chapter they point to.

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

    // Chapters: the overview is a stack of cards, one <details> per chapter with the whole
    // chapter inside. A click on a card, or on a link to it, grows the card into a full-screen
    // chapter (the sheet in the page's HTML): the card's number, title and summary travel to
    // their places, the title shrinks into the sheet's bar, and the chapter's content arrives
    // in turn. The card at the end of a chapter grows into the next one the same way; the steps
    // in the bar, the arrow keys and a sideways swipe move between chapters; Esc, the cross or
    // the chapter's own card shrinks it back. The page behind settles on the open chapter's
    // card, so the chapter always lands in its slot. Nothing opens or shuts as the page scrolls:
    // scrolling only stacks the cards (--cover, read by style.css). Without this script the
    // cards stay put and open in place (noscript.css).
    const chapters = Array.from(document.querySelectorAll('.chapter'));
    const sheet = document.getElementById('sheet');
    if (chapters.length && sheet) {
        const root = document.documentElement;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
        const EASE_OUT = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
        const T = { grow: 720, glide: 480, uncover: 700, cover: 420, shrink: 620, side: 560, fade: 380 };
        const FULL = 'inset(0px 0px 0px 0px round 0px)';
        const header = document.querySelector('.site-header');
        const overview = document.querySelector('.overview');
        const labels = sheet.dataset;

        const info = chapters.map(function (c) {
            return {
                el: c,
                id: c.id,
                num: c.querySelector('.section-num').textContent.trim(),
                title: c.querySelector('.overview-title').textContent.trim(),
                text: c.querySelector('.overview-text').textContent.trim(),
                body: c.querySelector('.chapter-body')
            };
        });

        let current = -1;
        let busy = false;
        let afterClose = null;

        const colours = function (i) {
            const cs = getComputedStyle(chapters[i]);
            return {
                bg: cs.getPropertyValue('--ch-bg').trim(),
                fg: cs.getPropertyValue('--ch-fg').trim(),
                muted: cs.getPropertyValue('--ch-muted').trim()
            };
        };

        // The cards stick under the header, each a little lower than the one before
        const measure = function () {
            const h = header ? header.getBoundingClientRect().height : 0;
            root.style.setProperty('--stack-top', Math.round(h + 12) + 'px');
        };

        // How far the next card has climbed over each card, for style.css
        let ticking = false;
        const updateStack = function () {
            ticking = false;
            chapters.forEach(function (c, i) {
                if (reduce.matches || i === chapters.length - 1) {
                    c.style.removeProperty('--cover');
                    return;
                }
                const top = c.getBoundingClientRect().top;
                const h = c.offsetHeight;
                const nextTop = chapters[i + 1].getBoundingClientRect().top;
                const p = (top + h - nextTop) / Math.max(1, h - 14);
                c.style.setProperty('--cover', Math.max(0, Math.min(1, p)).toFixed(3));
            });
        };
        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateStack);
            }
        }, { passive: true });
        window.addEventListener('resize', function () {
            measure();
            updateStack();
        });

        // Where the page must be scrolled for a card to sit at its sticky top with the next card
        // below it. Rects move when a card sticks, so this is built from the cards' heights.
        const restingScroll = function (i) {
            let top = overview.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(overview).paddingTop);
            for (let k = 0; k < i; k++) {
                top += chapters[k].offsetHeight + parseFloat(getComputedStyle(chapters[k]).marginBottom);
            }
            return Math.max(0, Math.round(top - (parseFloat(getComputedStyle(chapters[i]).top) || 0)));
        };
        const settle = function (i) {
            window.scrollTo({ top: restingScroll(i), behavior: 'instant' });
            updateStack();
        };

        // The sheet's parts
        const card = sheet.querySelector('.sheet-card');
        const ink = sheet.querySelector('.sheet-ink');
        const inkNum = ink.querySelector('.section-num');
        const inkTitle = ink.querySelector('.sheet-ink-title');
        const inkText = ink.querySelector('.sheet-ink-text');
        const floatBox = sheet.querySelector('.sheet-float');
        const barNum = sheet.querySelector('#sheet-num');
        const barTitle = sheet.querySelector('#sheet-title');
        const stepsBox = sheet.querySelector('#sheet-steps');
        const scroller = sheet.querySelector('#sheet-scroll');
        const bodyBox = sheet.querySelector('#sheet-body');
        const next = sheet.querySelector('#sheet-next');
        const nextNum = next.querySelector('.sheet-next-num');
        const nextLabel = next.querySelector('.sheet-next-label');
        const nextTitle = next.querySelector('.sheet-next-title');
        const closeBtn = sheet.querySelector('#sheet-close');
        const progress = sheet.querySelector('.sheet-progress span');

        // One step per chapter, in the bar
        const steps = info.map(function (d, k) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'sheet-step';
            b.dataset.step = String(k);
            b.setAttribute('aria-label', (labels.labelChapter || 'Chapter %n: %t').replace('%n', d.num).replace('%t', d.title));
            stepsBox.appendChild(b);
            return b;
        });

        // While a chapter is open the page behind cannot scroll and is out of reach
        const lock = function (on) {
            root.style.overflow = on ? 'hidden' : '';
            Array.from(document.body.children).forEach(function (el) {
                if (el === sheet) return;
                if (on) el.setAttribute('inert', '');
                else el.removeAttribute('inert');
            });
        };

        const paintInk = function (c, num, title, text) {
            ink.style.setProperty('--ink-bg', c.bg);
            ink.style.setProperty('--ink-fg', c.fg);
            ink.style.setProperty('--ink-muted', c.muted);
            inkNum.textContent = num;
            inkNum.hidden = !num;
            inkTitle.textContent = title;
            inkText.textContent = text;
        };
        const setInk = function (i) {
            paintInk(colours(i), info[i].num, info[i].title, info[i].text);
        };

        // The chapter's own content goes into the sheet; the bar and the end card follow it
        const fill = function (i) {
            const d = info[i];
            bodyBox.appendChild(d.body);
            barNum.textContent = d.num;
            barTitle.textContent = d.title;
            steps.forEach(function (s, k) {
                s.classList.toggle('is-done', k < i);
                if (k === i) s.setAttribute('aria-current', 'true');
                else s.removeAttribute('aria-current');
            });
            if (i < info.length - 1) {
                const n = info[i + 1];
                const c = colours(i + 1);
                next.setAttribute('href', '#' + n.id);
                next.dataset.target = String(i + 1);
                nextNum.textContent = n.num;
                nextNum.hidden = false;
                nextLabel.textContent = labels.labelNext || 'Next chapter';
                nextTitle.textContent = n.title;
                next.style.setProperty('--ch-bg', c.bg);
                next.style.setProperty('--ch-fg', c.fg);
                next.style.setProperty('--ch-muted', c.muted);
            } else {
                next.setAttribute('href', '#contact');
                next.dataset.target = 'contact';
                nextNum.textContent = '';
                nextNum.hidden = true;
                nextLabel.textContent = labels.labelAfter || 'Next step';
                nextTitle.textContent = labels.labelWaitlist || 'Join the waitlist';
                next.style.setProperty('--ch-bg', 'var(--accent-1)');
                next.style.setProperty('--ch-fg', '#ffffff');
                next.style.setProperty('--ch-muted', 'rgba(255, 255, 255, 0.94)');
            }
            scroller.scrollTop = 0;
            progress.style.transform = 'scaleX(0)';
        };

        // The pieces of a chapter that arrive in turn: the section's children, or a grid's
        const targetsOf = function (body) {
            const section = body.querySelector('.section');
            const out = [];
            if (!section) return out;
            Array.from(section.children).forEach(function (k) {
                if (k.matches('.threat-grid, .capabilities-grid, .roadmap-grid, .process-steps, .deadlines, .hndl-timeline') && k.children.length) {
                    out.push.apply(out, Array.from(k.children));
                } else {
                    out.push(k);
                }
            });
            return out;
        };
        const stagger = function (list, delay) {
            if (reduce.matches) return;
            list.forEach(function (el, k) {
                el.animate(
                    { opacity: [0, 1], transform: ['translateY(36px)', 'translateY(0)'] },
                    { duration: 800, delay: delay + Math.min(k, 12) * 65, easing: EASE_OUT, fill: 'backwards' }
                );
            });
        };
        const fadeIn = function (list, delay, duration) {
            list.forEach(function (el) {
                el.animate({ opacity: [0, 1] }, { duration: duration || T.fade, delay: delay || 0, easing: 'ease-out', fill: 'backwards' });
            });
        };

        const rectClip = function (r) {
            return 'inset(' + r.top + 'px ' + (window.innerWidth - r.right) + 'px ' + (window.innerHeight - r.bottom) + 'px ' + r.left + 'px round 28px)';
        };
        // Where a chapter opens from when its card is not on screen (the menu, the address)
        const centreClip = function () {
            const w = window.innerWidth;
            const h = window.innerHeight;
            return 'inset(' + Math.round(h * 0.2) + 'px ' + Math.round(w * 0.16) + 'px ' + Math.round(h * 0.2) + 'px ' + Math.round(w * 0.16) + 'px round 28px)';
        };
        const inView = function (r) {
            const top = header ? header.getBoundingClientRect().height : 0;
            return r.bottom > top + 40 && r.top < window.innerHeight - 40;
        };
        const cancelAll = function () {
            card.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
            floatBox.innerHTML = '';
            [inkNum, inkTitle, inkText, barNum, barTitle].forEach(function (el) { el.style.visibility = ''; });
        };

        const CARD_PAIRS = [['.section-num', '.section-num'], ['.overview-title', '.sheet-ink-title'], ['.overview-text', '.sheet-ink-text']];
        const NEXT_PAIRS = [['.sheet-next-num', '.section-num'], ['.sheet-next-title', '.sheet-ink-title']];

        // Pieces of the ink travel from (or to) the matching pieces of a card, so the card seems
        // to grow into the chapter instead of being replaced by it
        const glide = function (fromEl, pairs, toCard, duration) {
            pairs.forEach(function (p) {
                const a = fromEl.querySelector(p[0]);
                const b = ink.querySelector(p[1]);
                if (!a || !b || a.hidden || b.hidden) return;
                const ra = a.getBoundingClientRect();
                const rb = b.getBoundingClientRect();
                const move = 'translate(' + (ra.left - rb.left) + 'px, ' + (ra.top - rb.top) + 'px)';
                b.animate(
                    { transform: toCard ? ['translate(0px, 0px)', move] : [move, 'translate(0px, 0px)'] },
                    { duration: duration, easing: EASE, fill: toCard ? 'forwards' : 'backwards' }
                );
            });
        };

        // The title and number shrink into the bar as the ink lifts, and grow back out of it as
        // the ink returns, so the bar is the chapter's own heading at a smaller size
        const floatTitle = function (toBar, duration) {
            floatBox.innerHTML = '';
            [[inkTitle, barTitle], [inkNum, barNum]].forEach(function (p) {
                const big = p[0];
                const small = p[1];
                if (big.hidden) return;
                const rb = big.getBoundingClientRect();
                const rs = small.getBoundingClientRect();
                const cb = getComputedStyle(big);
                const cs = getComputedStyle(small);
                const clone = document.createElement(big.tagName);
                clone.className = big.className;
                clone.textContent = big.textContent;
                clone.style.cssText = 'position:absolute;left:' + rb.left + 'px;top:' + rb.top + 'px;margin:0;white-space:nowrap;transform-origin:0 0;' +
                    'font-size:' + cb.fontSize + ';line-height:' + cb.lineHeight + ';padding:' + cb.padding + ';';
                floatBox.appendChild(clone);
                const scale = parseFloat(cs.fontSize) / parseFloat(cb.fontSize);
                const there = 'translate(' + (rs.left - rb.left) + 'px, ' + (rs.top - rb.top) + 'px) scale(' + scale + ')';
                const here = 'translate(0px, 0px) scale(1)';
                big.style.visibility = 'hidden';
                small.style.visibility = 'hidden';
                const a = clone.animate({
                    transform: toBar ? [here, there] : [there, here],
                    color: toBar ? [cb.color, cs.color] : [cs.color, cb.color],
                    backgroundColor: toBar ? [cb.backgroundColor, cs.backgroundColor] : [cs.backgroundColor, cb.backgroundColor]
                }, { duration: duration, easing: EASE, fill: 'forwards' });
                a.onfinish = function () {
                    (toBar ? small : big).style.visibility = '';
                    clone.remove();
                };
            });
        };

        // The ink lifts away and the chapter is there, its content arriving in turn
        const reveal = function () {
            const up = ink.animate({ transform: ['translateY(0)', 'translateY(-101%)'] }, { duration: T.uncover, easing: EASE, fill: 'forwards' });
            // The summary fades first, so only the title and number are seen to travel
            inkText.animate({ opacity: [1, 0] }, { duration: 220, easing: 'ease-out', fill: 'forwards' });
            floatTitle(true, T.uncover);
            fadeIn([stepsBox, closeBtn], 200, 500);
            stagger(targetsOf(bodyBox).concat([next]), 140);
            up.onfinish = function () {
                ink.classList.remove('on');
                up.cancel();
                busy = false;
                closeBtn.focus({ preventScroll: true });
            };
        };

        // instant: no motion, for an address that names a chapter when the page loads
        const open = function (i, instant) {
            if (busy || current >= 0) return;
            busy = true;
            current = i;
            const el = info[i].el;
            const rect = el.getBoundingClientRect();
            const fromCard = inView(rect);
            setInk(i);
            fill(i);
            history.replaceState(null, '', '#' + info[i].id);
            lock(true);
            sheet.hidden = false;
            if (instant || reduce.matches) {
                settle(i);
                busy = false;
                closeBtn.focus({ preventScroll: true });
                // The browser's own jump to the address comes after this and drops the focus
                if (instant && document.readyState !== 'complete') {
                    window.addEventListener('load', function () {
                        if (current !== i) return;
                        settle(i);
                        closeBtn.focus({ preventScroll: true });
                    }, { once: true });
                }
                return;
            }
            cancelAll();
            ink.classList.add('on');
            const from = fromCard ? rectClip(rect) : centreClip();
            card.style.clipPath = from;
            if (fromCard) glide(el.querySelector('summary'), CARD_PAIRS, false, T.glide);
            else fadeIn([inkNum, inkTitle, inkText], 120, T.grow - 120);
            const a = card.animate({ clipPath: [from, FULL] }, { duration: T.grow, easing: EASE, fill: 'forwards' });
            a.onfinish = function () {
                card.style.clipPath = '';
                a.cancel();
            };
            // The ink lifts while the card is still finishing its growth
            window.setTimeout(function () {
                if (current !== i) return;
                settle(i);
                reveal();
            }, Math.round(T.grow * 0.72));
        };

        // how: { rect } grows the next chapter out of the end card; { dir } wipes it in from a side
        const goTo = function (j, how) {
            if (busy || current < 0 || j === current || j < 0 || j >= info.length) return;
            busy = true;
            const from = current;
            const swap = function () {
                info[from].el.appendChild(info[from].body);
                current = j;
                fill(j);
                history.replaceState(null, '', '#' + info[j].id);
                settle(j);
            };
            if (reduce.matches) {
                swap();
                busy = false;
                return;
            }
            cancelAll();
            setInk(j);
            ink.classList.add('on');
            let a;
            if (how && how.rect) {
                a = ink.animate({ clipPath: [rectClip(how.rect), FULL] }, { duration: T.grow, easing: EASE, fill: 'forwards' });
                glide(next, NEXT_PAIRS, false, T.glide);
                fadeIn([inkText], 200, T.grow - 200);
            } else {
                const d = how && how.dir < 0 ? -1 : 1;
                a = ink.animate({ transform: ['translateX(' + (d * 101) + '%)', 'translateX(0)'] }, { duration: T.side, easing: EASE, fill: 'forwards' });
                [inkNum, inkTitle, inkText].forEach(function (el, k) {
                    el.animate(
                        { transform: ['translateX(' + (d * 48) + 'px)', 'translateX(0)'], opacity: [0, 1] },
                        { duration: T.side, delay: 80 + k * 60, easing: EASE_OUT, fill: 'backwards' }
                    );
                });
            }
            a.onfinish = function () {
                a.cancel();
                swap();
                reveal();
            };
        };

        const finishClose = function () {
            const i = current;
            sheet.hidden = true;
            card.style.clipPath = '';
            sheet.style.opacity = '';
            cancelAll();
            ink.classList.remove('on');
            if (i >= 0) info[i].el.appendChild(info[i].body);
            lock(false);
            current = -1;
            busy = false;
            history.replaceState(null, '', window.location.pathname + window.location.search);
            if (afterClose) {
                const f = afterClose;
                afterClose = null;
                f();
            } else if (i >= 0) {
                info[i].el.querySelector('summary').focus({ preventScroll: true });
            }
        };

        const close = function () {
            if (busy || current < 0) return;
            busy = true;
            const i = current;
            if (reduce.matches) {
                finishClose();
                return;
            }
            cancelAll();
            setInk(i);
            ink.classList.add('on');
            floatTitle(false, T.cover);
            const cover = ink.animate({ transform: ['translateY(-101%)', 'translateY(0)'] }, { duration: T.cover, easing: EASE, fill: 'forwards' });
            cover.onfinish = function () {
                cover.cancel();
                settle(i);
                const rect = info[i].el.getBoundingClientRect();
                glide(info[i].el.querySelector('summary'), CARD_PAIRS, true, T.shrink);
                const a = card.animate({ clipPath: [FULL, rectClip(rect)] }, { duration: T.shrink, easing: EASE, fill: 'forwards' });
                a.onfinish = finishClose;
            };
        };

        // The last chapter's end card: the page continues at the waitlist
        const finish = function () {
            if (busy || current < 0) return;
            busy = true;
            const contact = document.getElementById('contact');
            afterClose = function () {
                const heading = contact && contact.querySelector('h2');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus({ preventScroll: true });
                }
            };
            const land = function () {
                if (contact) window.scrollTo({ top: contact.getBoundingClientRect().top + window.scrollY - 24, behavior: 'instant' });
                updateStack();
            };
            if (reduce.matches) {
                land();
                finishClose();
                return;
            }
            cancelAll();
            paintInk({ bg: 'var(--accent-1)', fg: '#ffffff', muted: 'rgba(255, 255, 255, 0.94)' }, '', nextTitle.textContent, '');
            ink.classList.add('on');
            const a = ink.animate({ clipPath: [rectClip(next.getBoundingClientRect()), FULL] }, { duration: T.grow, easing: EASE, fill: 'forwards' });
            glide(next, NEXT_PAIRS, false, T.glide);
            a.onfinish = function () {
                land();
                const out = sheet.animate({ opacity: [1, 0] }, { duration: T.fade, delay: 160, easing: 'ease-in', fill: 'forwards' });
                out.onfinish = function () {
                    out.cancel();
                    finishClose();
                };
            };
        };

        // Every way in: the cards, and the links to them (the menu, the hero's button, links
        // inside a chapter). A link to another chapter while one is open moves to it.
        const chapterOf = function (el) {
            const summary = el.closest('.chapter > summary');
            if (summary) return summary.parentNode;
            const link = el.closest('a[href^="#"]');
            const target = link && document.getElementById(link.getAttribute('href').slice(1));
            return target && target.closest('.chapter');
        };
        document.addEventListener('click', function (e) {
            if (e.target.closest('.sheet')) {
                const link = e.target.closest('a[href^="#"]');
                const target = link && !link.classList.contains('sheet-next') && document.getElementById(link.getAttribute('href').slice(1));
                const chapter = target && target.closest('.chapter');
                const j = chapter ? chapters.indexOf(chapter) : -1;
                if (j >= 0 && j !== current) {
                    e.preventDefault();
                    goTo(j, { dir: j > current ? 1 : -1 });
                }
                return;
            }
            const chapter = chapterOf(e.target);
            if (!chapter) return;
            e.preventDefault();
            open(chapters.indexOf(chapter));
        });

        next.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (next.dataset.target === 'contact') finish();
            else goTo(Number(next.dataset.target), { rect: next.getBoundingClientRect() });
        });
        steps.forEach(function (s) {
            s.addEventListener('click', function () {
                const k = Number(s.dataset.step);
                goTo(k, { dir: k > current ? 1 : -1 });
            });
        });
        closeBtn.addEventListener('click', close);
        document.addEventListener('keydown', function (e) {
            if (current < 0) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight' && current < info.length - 1) goTo(current + 1, { dir: 1 });
            else if (e.key === 'ArrowLeft' && current > 0) goTo(current - 1, { dir: -1 });
        });
        // A sideways swipe on a touch screen moves between chapters
        let touch = null;
        scroller.addEventListener('touchstart', function (e) {
            touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
        }, { passive: true });
        scroller.addEventListener('touchend', function (e) {
            if (!touch || current < 0) return;
            const dx = e.changedTouches[0].clientX - touch.x;
            const dy = e.changedTouches[0].clientY - touch.y;
            touch = null;
            if (Math.abs(dx) < 72 || Math.abs(dx) < 2 * Math.abs(dy)) return;
            if (dx < 0 && current < info.length - 1) goTo(current + 1, { dir: 1 });
            else if (dx > 0 && current > 0) goTo(current - 1, { dir: -1 });
        }, { passive: true });
        scroller.addEventListener('scroll', function () {
            const max = scroller.scrollHeight - scroller.clientHeight;
            progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scroller.scrollTop / max) : 0) + ')';
        }, { passive: true });

        // An address that names a chapter, or something inside one, opens that chapter: at
        // once when the page loads, and when the address changes by hand
        const fromAddress = function (onLoad) {
            const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
            const chapter = target && target.closest('.chapter');
            if (!chapter) {
                if (!onLoad && current >= 0 && !window.location.hash) close();
                return;
            }
            // The browser may have opened the <details> itself; the sheet shows it instead
            chapters.forEach(function (c) { c.open = false; });
            const i = chapters.indexOf(chapter);
            if (current < 0) open(i, onLoad);
            else if (i !== current) goTo(i, { dir: i > current ? 1 : -1 });
            if (target !== chapter) target.scrollIntoView();
        };
        measure();
        updateStack();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
        fromAddress(true);
        window.addEventListener('hashchange', function () { fromAddress(false); });
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