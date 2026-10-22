/* Education timeline: renders data/courses.json as a degree strip, a vertical
   timeline of index cards, and a filterable table. No build step. */
(function () {
  'use strict';

  var ICONS = window.SUBJECT_ICONS || {};
  var UI = window.UI_ICONS || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = { q: '', schools: new Set(), subjects: new Set(), materialsOnly: false, view: 'timeline', moreSubjects: false };
  var DATA = null;

  var SRC_LABEL = {
    syllabus: 'from the syllabus',
    materials: 'from my course files',
    transcript: 'from the transcript',
    general: 'catalog-style summary'
  };
  // Tab colours from the field-notebook palette, cycled per subject.
  var TINTS = ['var(--tab-1)', 'var(--tab-2)', 'var(--tab-3)', 'var(--tab-4)', 'var(--tab-5)', 'var(--tab-6)', 'var(--tab-7)', 'var(--tab-8)'];

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (k === 'html') n.innerHTML = v;
        else if (k === 'style') n.setAttribute('style', v);
        else n.setAttribute(k, v === true ? '' : v);
      });
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function svg(inner, cls, label) {
    var s = '<svg viewBox="0 0 24 24" class="' + (cls || '') + '"' + (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + '>' + inner + '</svg>';
    var t = document.createElement('span');
    t.innerHTML = s;
    return t.firstChild;
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function rot(seed) { // stable small rotation per card
    var h = 0; for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    return ((Math.abs(h) % 9) - 4) * 0.18;
  }
  function tint(subject) {
    var keys = Object.keys(DATA.subjects);
    return TINTS[keys.indexOf(subject) % TINTS.length];
  }
  function schoolMark(id, size) {
    var s = DATA.schools[id];
    if (s.logo) {
      return el('img', { src: s.logo, alt: s.name, class: 'logo logo-' + id + (size ? ' ' + size : ''), loading: 'lazy', decoding: 'async' });
    }
    return el('span', { class: 'wordmark' + (size ? ' ' + size : ''), style: '--wc:' + s.color, role: 'img', 'aria-label': s.name, text: s.wordmark || s.short });
  }

  // ---------- filtering ----------
  function haystack(c) {
    var s = DATA.schools[c.school];
    return [c.code, c.title, c.transcript_title || '', c.instructor, c.description, c.term,
      DATA.subjects[c.subject], s.name, s.short].join(' ').toLowerCase();
  }
  function schoolKey(id) { return id; }
  function matches(c) {
    if (state.q) {
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      var h = c._h;
      for (var i = 0; i < words.length; i++) if (h.indexOf(words[i]) === -1) return false;
    }
    if (state.schools.size && !state.schools.has(schoolKey(c.school))) return false;
    if (state.subjects.size && !state.subjects.has(c.subject)) return false;
    if (state.materialsOnly && !c.materials_url) return false;
    return true;
  }

  // ---------- degree strip ----------
  function renderStrip() {
    var strip = document.getElementById('strip');
    strip.innerHTML = '';
    DATA.degrees.forEach(function (d, i) {
      var cs = DATA.courses.filter(function (c) { return c.degree === d.id; });
      var terms = new Set(cs.map(function (c) { return c.term; }));
      var withMat = cs.filter(function (c) { return c.materials_url; }).length;
      var s = DATA.schools[d.school];
      var card = el('a', { class: 'deg-card reveal' + (d.id === 'online' ? ' mini' : ''), href: '#deg-' + d.id, style: '--rot:' + [-1.2, .8, -.6, 1.1, -.9][i % 5] + 'deg; --d:' + (i * 0.08) + 's; --sc:' + s.color }, [
        el('span', { class: 'tape tc', 'aria-hidden': 'true' }),
        el('div', { class: 'deg-logo' }, [schoolMark(d.school)]),
        el('div', { class: 'deg-label' }, [
          el('span', { class: 'deg-abbr', text: d.label }),
          el('span', { class: 'deg-year hand', text: d.id === 'online' ? '2014–15' : String(d.year) })
        ]),
        el('p', { class: 'deg-school', text: d.id === 'online' ? s.name + ', on Coursera' : s.name }),
        el('p', { class: 'deg-field', text: d.field }),
        el('p', { class: 'deg-count' }, [
          el('span', { class: 'big-n' }, [el('strong', { text: String(cs.length) }), ' ' + (cs.length === 1 ? 'course' : 'courses')]),
          el('span', { class: 'sub-n', text: plural(terms.size, 'term') + ' · ' + withMat + ' with materials' })
        ])
      ]);
      strip.appendChild(card);
    });
    var total = DATA.courses.filter(function (c) { return c.degree !== 'online'; }).length;
    var schools = new Set(DATA.courses.filter(function (c) { return c.degree !== 'online'; }).map(function (c) { return c.school; }));
    document.getElementById('tally').textContent = total + ' college courses at ' + schools.size + ' schools, plus ' + DATA.courses.filter(function (c) { return c.degree === 'online'; }).length + ' online';
  }

  // ---------- chips ----------
  function chip(label, count, pressed, onClick, extra) {
    var b = el('button', { type: 'button', class: 'chip' + (extra ? ' ' + extra : ''), 'aria-pressed': pressed ? 'true' : 'false' }, [
      label, count !== null ? el('span', { class: 'n', text: String(count) }) : null
    ]);
    b.addEventListener('click', onClick);
    return b;
  }
  function renderChips() {
    var sc = document.getElementById('school-chips');
    sc.innerHTML = '';
    sc.appendChild(el('span', { class: 'chip-label', text: 'School' }));
    var order = ['cmu', 'pitt', 'uwm', 'uww', 'uwo', 'matc', 'jhu'];
    var counts = {};
    DATA.courses.forEach(function (c) { var k = schoolKey(c.school); counts[k] = (counts[k] || 0) + 1; });
    order.forEach(function (k) {
      if (!counts[k]) return;
      var label = DATA.schools[k].short;
      sc.appendChild(chip(label, counts[k], state.schools.has(k), function () {
        state.schools.has(k) ? state.schools.delete(k) : state.schools.add(k);
        update();
      }));
    });
    sc.appendChild(chip('Has my materials', null, state.materialsOnly, function () { state.materialsOnly = !state.materialsOnly; update(); }, 'mat-chip'));

    var subj = document.getElementById('subject-chips');
    subj.innerHTML = '';
    subj.appendChild(el('span', { class: 'chip-label', text: 'Subject' }));
    var sCounts = {};
    DATA.courses.forEach(function (c) { sCounts[c.subject] = (sCounts[c.subject] || 0) + 1; });
    var keys = Object.keys(sCounts).sort(function (a, b) { return sCounts[b] - sCounts[a] || DATA.subjects[a].localeCompare(DATA.subjects[b]); });
    var LIMIT = 10;
    keys.forEach(function (k, i) {
      var hidden = !state.moreSubjects && i >= LIMIT && !state.subjects.has(k);
      if (hidden) return;
      var b = chip(DATA.subjects[k], sCounts[k], state.subjects.has(k), function () {
        state.subjects.has(k) ? state.subjects.delete(k) : state.subjects.add(k);
        update();
      }, 'subj');
      b.insertBefore(svg(ICONS[k] || '', 'chip-ico'), b.firstChild);
      subj.appendChild(b);
    });
    if (keys.length > LIMIT) {
      var more = el('button', { type: 'button', class: 'chip more', 'aria-expanded': state.moreSubjects ? 'true' : 'false', text: state.moreSubjects ? 'Fewer subjects' : 'All ' + keys.length + ' subjects' });
      more.addEventListener('click', function () { state.moreSubjects = !state.moreSubjects; renderChips(); });
      subj.appendChild(more);
    }
    if (state.q || state.schools.size || state.subjects.size || state.materialsOnly) {
      var clr = el('button', { type: 'button', class: 'chip clear', text: 'Clear filters' });
      clr.addEventListener('click', function () {
        state.q = ''; state.schools.clear(); state.subjects.clear(); state.materialsOnly = false;
        document.getElementById('q').value = '';
        update();
      });
      subj.appendChild(clr);
    }
  }

  // ---------- timeline ----------
  function card(c) {
    var s = DATA.schools[c.school];
    var subjLabel = DATA.subjects[c.subject];
    var meta = [el('span', { class: 'term-tag', text: c.term.replace('Transfer credit, posted ', 'Transfer, ') })];
    if (c.instructor) meta.push(el('span', { class: 'who' }, [el('span', { class: 'sr-only', text: 'Instructor: ' }), c.instructor]));
    var foot = [];
    if (c.materials_url) {
      var a = el('a', { class: 'mat', href: c.materials_url, target: '_blank', rel: 'noopener', title: 'Opens Ben’s private Google Drive' }, ['My materials']);
      a.insertBefore(svg(UI.drive, 'ui'), a.firstChild);
      foot.push(a);
    }
    foot.push(el('span', { class: 'src src-' + c.description_source, text: SRC_LABEL[c.description_source] || '' }));
    return el('article', { class: 'card kind-' + c.kind, style: '--rot:' + rot(c.id) + 'deg; --tint:' + tint(c.subject) + '; --sc:' + s.color }, [
      el('div', { class: 'card-top' }, [
        el('span', { class: 'ico', title: subjLabel }, [svg(ICONS[c.subject] || '', '', subjLabel)]),
        el('div', { class: 'ids' }, c.platform ? [
          el('span', { class: 'code uni', text: s.name }),
          el('span', { class: 'school-tag', text: 'via ' + c.platform + (c.series ? ' · ' + c.series : '') })
        ] : [
          el('span', { class: 'code', text: c.code }),
          el('span', { class: 'school-tag', text: s.short })
        ])
      ]),
      el('h3', { text: c.title }),
      el('p', { class: 'meta' }, meta),
      el('p', { class: 'desc', text: c.description }),
      c.materials_note ? el('p', { class: 'mnote', text: c.materials_note }) : null,
      el('div', { class: 'card-foot' }, foot)
    ]);
  }

  function renderTimeline(list) {
    var root = document.getElementById('timeline');
    root.innerHTML = '';
    var tl = el('div', { class: 'tl-list' });
    lens = buildLens();
    root.appendChild(tl);
    root.appendChild(lens.el);
    DATA.degrees.forEach(function (d) {
      var cs = list.filter(function (c) { return c.degree === d.id; });
      if (!cs.length) return;
      var s = DATA.schools[d.school];
      var sec = el('section', { class: 'deg deg-' + d.id, id: 'deg-' + d.id, 'aria-labelledby': 'h-' + d.id, style: '--sc:' + s.color });
      var head = el('header', { class: 'deg-head reveal' }, [
        el('div', { class: 'deg-logo' }, [schoolMark(d.school)]),
        el('div', { class: 'deg-text' }, [
          el('p', { class: 'kicker', text: d.id === 'online' ? 'After the degrees · on Coursera' : s.name + ' · ' + s.unit }),
          el('h2', { id: 'h-' + d.id }, [d.title + ' ', el('span', { class: 'hand yr', text: d.id === 'online' ? '' : String(d.year) })]),
          el('p', { class: 'deg-sub', text: d.field + '. ' + d.span + '.' + (d.note ? ' ' + d.note : '') })
        ]),
        el('span', { class: 'stamp', style: '--rot:' + (d.id === 'phd' ? -4 : 3) + 'deg', text: plural(cs.length, 'course') })
      ]);
      sec.appendChild(head);
      var terms = [];
      cs.forEach(function (c) { if (terms.indexOf(c.term) === -1) terms.push(c.term); });
      terms.forEach(function (t) {
        var tc = cs.filter(function (c) { return c.term === t; });
        var schoolsHere = new Set(tc.map(function (c) { return c.school; }));
        var block = el('div', { class: 'term' }, [
          el('div', { class: 'term-label' }, [
            el('span', { class: 'dot', 'aria-hidden': 'true' }),
            el('h3', { class: 'hand', text: t }),
            el('span', { class: 'n', text: plural(tc.length, 'course') + (schoolsHere.size > 1 ? ' · ' + Array.from(schoolsHere).map(function (k) { return DATA.schools[k].short; }).join(', ') : '') })
          ]),
          el('div', { class: 'rows' }, tc.map(row))
        ]);
        sec.appendChild(block);
      });
      tl.appendChild(sec);
    });
    // the line ends at the first semester
    if (list.some(function (c) { return c.degree === 'bba'; })) {
      var bba = tl.querySelector('.deg-bba');
      if (bba) bba.appendChild(el('p', { class: 'origin hand', text: 'Fall 2000: first semester of college' }));
    }
    observe(root.querySelectorAll('.reveal'));
    magnify(tl, list);
  }

  // ---------- table ----------
  function renderTable(list) {
    var tb = document.getElementById('tbody');
    tb.innerHTML = '';
    var frag = document.createDocumentFragment();
    var deg = null;
    list.forEach(function (c) {
      if (c.degree !== deg) {
        deg = c.degree;
        var d = DATA.degrees.filter(function (x) { return x.id === deg; })[0];
        frag.appendChild(el('tr', { class: 'grp' }, [el('th', { colspan: '6', scope: 'colgroup', text: d.label + ' · ' + DATA.schools[d.school].name + (d.id === 'online' ? ' on Coursera' : '') })]));
      }
      var s = DATA.schools[c.school];
      var mat = c.materials_url
        ? el('a', { class: 'mat sm', href: c.materials_url, target: '_blank', rel: 'noopener' }, [svg(UI.drive, 'ui'), 'Open'])
        : el('span', { class: 'muted', 'aria-label': 'none', text: '·' });
      var titleCell = el('td', { class: 't-title', 'data-l': 'Title' }, [el('span', { class: 't-in' }, [
        el('span', { class: 'ico sm', title: DATA.subjects[c.subject], style: '--tint:' + tint(c.subject) }, [svg(ICONS[c.subject] || '', '', DATA.subjects[c.subject])]),
        el('span', { text: c.title })
      ])]);
      frag.appendChild(el('tr', {}, [
        el('td', { class: 't-term', 'data-l': 'Term', text: c.term.replace('Transfer credit, posted ', 'Transfer, ') }),
        el('td', { class: 't-school', 'data-l': 'School' }, [el('span', { class: 'sdot', style: '--sc:' + s.color }), s.short]),
        el('td', { class: 't-code', 'data-l': 'Code', text: c.code || c.platform || '·' }),
        titleCell,
        el('td', { class: 't-who', 'data-l': 'Instructor', text: c.instructor || '' }),
        el('td', { class: 't-mat', 'data-l': 'Materials' }, [mat])
      ]));
    });
    tb.appendChild(frag);
  }

  // ---------- loose folders ----------
  function renderLoose() {
    var ul = document.getElementById('loose');
    DATA.loose_folders.forEach(function (f, i) {
      var a = el('a', { href: f.url, target: '_blank', rel: 'noopener', class: 'loose-name' }, [svg(UI.drive, 'ui'), f.title]);
      ul.appendChild(el('li', { class: 'reveal', style: '--rot:' + ((i % 3) - 1) * 0.5 + 'deg' }, [a, el('span', { class: 'muted', text: f.note })]));
    });
    observe(ul.querySelectorAll('.reveal'));
  }


  // ---------- compact rows ----------
  // Each course is a one-line slip: icon, code, title, instructor. The full
  // index card lives in the lens (wide screens) or unfolds under the slip.
  var byId = {};
  function row(c, i) {
    var s = DATA.schools[c.school];
    byId[c.id] = c;
    var b = el('button', {
      type: 'button', class: 'row kind-' + c.kind, 'data-id': c.id,
      'aria-expanded': 'false', 'aria-controls': 'more-' + c.id,
      style: '--rot:' + rot(c.id) * 1.6 + 'deg; --tint:' + tint(c.subject) + '; --sc:' + s.color + '; --d:' + Math.min(i, 6) * 0.05 + 's'
    }, [
      el('span', { class: 'ico sm', title: DATA.subjects[c.subject] }, [svg(ICONS[c.subject] || '', '', DATA.subjects[c.subject])]),
      el('span', { class: 'r-code' + (c.platform ? ' uni' : ''), text: c.code || s.short }),
      el('span', { class: 'r-title', text: c.title }),
      c.instructor ? el('span', { class: 'r-who', title: c.instructor, text: shortWho(c.instructor) }) : el('span', { class: 'r-who none', 'aria-hidden': 'true' }),
      c.materials_url ? el('span', { class: 'r-mat', title: 'Has my materials' }, [svg(UI.drive, 'ui', 'Has my materials')]) : el('span', { class: 'r-mat' })
    ]);
    b.addEventListener('click', function () {
      setActive(b);
      if (!wide()) toggleOpen(b);
    });
    b.addEventListener('focus', function () { if (wide()) setActive(b); });
    return el('div', { class: 'slot', id: c.id }, [b, el('div', { class: 'more', id: 'more-' + c.id })]);
  }

  // "Jeff Leek, Roger Peng and Brian Caffo" -> "Jeff Leek + 2"; the full list is on the card
  function shortWho(who) {
    var names = who.split(/,\s*|\s+and\s+/).filter(Boolean);
    return names.length > 1 ? names[0] + ' + ' + (names.length - 1) : who;
  }

  function toggleOpen(b, force) {
    var slot = b.parentNode, more = slot.lastChild;
    var open = force === undefined ? !slot.classList.contains('open') : force;
    if (open && !more.firstChild) more.appendChild(el('div', { class: 'more-in' }, [card(byId[b.getAttribute('data-id')])]));
    slot.classList.toggle('open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // ---------- the lens: a big card that follows your reading ----------
  var wideMq = window.matchMedia('(min-width: 1100px)');
  function wide() { return wideMq.matches; }
  var lens = null;
  function buildLens() {
    var stage = el('div', { class: 'lens-stage' });
    var count = el('p', { class: 'lens-count' });
    var where = el('p', { class: 'lens-where hand' });
    var box = el('aside', { class: 'lens', 'aria-label': 'Card for the highlighted course' }, [
      el('p', { class: 'lens-hint' }, [svg(UI.timeline || '', 'ui'), 'Scroll or hover the list']),
      where, stage, count
    ]);
    return { el: box, stage: stage, count: count, where: where, id: null };
  }
  function showInLens(c, n, total) {
    if (!lens || lens.id === c.id) return;
    lens.id = c.id;
    var d = DATA.degrees.filter(function (x) { return x.id === c.degree; })[0];
    lens.where.textContent = c.term + ' · ' + d.label;
    lens.count.textContent = 'Course ' + n + ' of ' + total;
    var next = card(c);
    var r = rot(c.id) * 2.2;
    next.style.setProperty('--rot', r + 'deg');
    var old = Array.prototype.slice.call(lens.stage.children);
    lens.stage.appendChild(next);
    if (reduceMotion || !next.animate) { old.forEach(function (o) { o.remove(); }); return; }
    old.forEach(function (o) {
      o.classList.add('leaving');
      var a = o.animate([
        { opacity: 1, transform: getComputedStyle(o).transform },
        { opacity: 0, transform: 'translate(70px, 26px) rotate(9deg)' }
      ], { duration: 260, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
      a.onfinish = function () { o.remove(); };
    });
    next.animate([
      { opacity: 0, transform: 'translate(-18px, -46px) rotate(' + (r - 9) + 'deg) scale(.9)' },
      { opacity: 1, transform: 'rotate(' + r + 'deg)' }
    ], { duration: 460, easing: 'cubic-bezier(.25,1.45,.5,1)' });
  }

  // ---------- dock-style magnification ----------
  // Slips swell as they pass a reading line 40% down the screen, or under the
  // mouse. The nearest one is the active course.
  var mag = { rows: [], order: {}, seen: new Set(), io: null, raf: 0, py: null, active: null, total: 0 };
  function magnify(listEl, list) {
    if (mag.io) mag.io.disconnect();
    mag.rows = Array.prototype.slice.call(listEl.querySelectorAll('.row'));
    mag.order = {};
    mag.rows.forEach(function (r, i) { mag.order[r.getAttribute('data-id')] = i + 1; });
    mag.total = list.length;
    mag.seen = new Set();
    mag.active = null;
    if (lens) lens.id = null;
    if ('IntersectionObserver' in window) {
      mag.io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { mag.seen.add(e.target); e.target.classList.add('in'); }
          else { mag.seen.delete(e.target); e.target.style.setProperty('--m', 0); e.target._m = '0'; }
        });
        schedule();
      }, { rootMargin: '120px 0px' });
      mag.rows.forEach(function (r) { mag.io.observe(r); });
    } else {
      mag.rows.forEach(function (r) { mag.seen.add(r); r.classList.add('in'); });
    }
    if (!listEl._bound) {
      listEl._bound = true;
      listEl.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') { mag.py = e.clientY; schedule(); } });
      listEl.addEventListener('pointerleave', function () { mag.py = null; schedule(); });
    }
    if (mag.rows[0]) setActive(mag.rows[0]);
    schedule();
  }
  function schedule() { if (!mag.raf) mag.raf = requestAnimationFrame(tick); }
  function tick() {
    mag.raf = 0;
    if (state.view !== 'timeline') return;
    var vh = window.innerHeight;
    var fy = mag.py !== null ? mag.py : vh * 0.4;
    var reach = wide() ? 190 : 140;
    var best = null, bestD = Infinity;
    mag.seen.forEach(function (r) {
      var b = r.getBoundingClientRect();
      var d = Math.abs(b.top + b.height / 2 - fy);
      var m = Math.max(0, 1 - d / reach);
      m = reduceMotion ? 0 : m * m * (3 - 2 * m);
      var v = m.toFixed(3);
      if (r._m !== v) { r.style.setProperty('--m', v); r._m = v; }
      if (d < bestD) { bestD = d; best = r; }
    });
    // only follow the reading line while it is actually over the list
    if (best && bestD < 160) setActive(best);
  }
  function setActive(r) {
    if (mag.active === r) return;
    if (mag.active) mag.active.classList.remove('on');
    mag.active = r;
    r.classList.add('on');
    var id = r.getAttribute('data-id');
    if (wide()) showInLens(byId[id], mag.order[id], mag.total);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  // ---------- reveal on scroll ----------
  var io = null;
  function observe(nodes) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nodes, function (n) { n.classList.add('in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    }
    Array.prototype.forEach.call(nodes, function (n) { io.observe(n); });
  }

  // ---------- view switching ----------
  function setView(v, focus) {
    state.view = v;
    ['timeline', 'table'].forEach(function (k) {
      var tab = document.getElementById('tab-' + k);
      var on = k === v;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      document.getElementById(k).hidden = !on;
      if (on && focus) tab.focus();
    });
    try { localStorage.setItem('edu-view', v); } catch (e) { /* storage blocked */ }
    if (v === 'timeline') schedule();
    if (location.hash !== '#' + v && (v === 'table' || location.hash === '#table')) history.replaceState(null, '', v === 'table' ? '#table' : location.pathname + location.search);
  }

  function update() {
    var list = DATA.courses.filter(matches);
    renderChips();
    renderTimeline(list);
    renderTable(list);
    var n = list.length, t = DATA.courses.length;
    document.getElementById('count').textContent = n === t ? 'Showing all ' + t + ' courses' : 'Showing ' + n + ' of ' + t + ' courses';
    document.getElementById('empty').hidden = n > 0;
  }

  function init(data) {
    DATA = data;
    DATA.courses.sort(function (a, b) {
      var od = DATA.degrees.map(function (d) { return d.id; });
      return od.indexOf(a.degree) - od.indexOf(b.degree) || b.term_sort - a.term_sort || a.code.localeCompare(b.code);
    });
    DATA.courses.forEach(function (c) { c._h = haystack(c); });

    Array.prototype.forEach.call(document.querySelectorAll('svg[data-ui]'), function (s) { s.innerHTML = UI[s.getAttribute('data-ui')] || ''; });

    renderStrip();
    observe(document.querySelectorAll('.strip .reveal'));
    renderLoose();

    var q = document.getElementById('q');
    var timer = null;
    q.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = q.value.trim(); update(); }, 120);
    });

    var tabs = Array.prototype.slice.call(document.querySelectorAll('.view-tabs [role=tab]'));
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { setView(tab.getAttribute('data-view')); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
          setView(next.getAttribute('data-view'), true);
        }
      });
    });

    var initial = 'timeline';
    if (location.hash === '#table') initial = 'table';
    else { try { if (localStorage.getItem('edu-view') === 'table' && !location.hash) initial = 'table'; } catch (e) { /* ignore */ } }
    update();
    setView(initial);
    if (location.hash && location.hash.length > 1 && location.hash !== '#table') {
      var target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: 'center' });
        var b = target.querySelector('.row');
        if (b) { setActive(b); if (!wide()) toggleOpen(b, true); }
      }
    }
  }

  fetch('data/courses.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(init)
    .catch(function (err) {
      var t = document.getElementById('timeline');
      t.innerHTML = '';
      t.appendChild(el('p', { class: 'empty', text: 'Could not load data/courses.json (' + err.message + '). Open this page through a web server, not straight from the file system.' }));
    });
})();
