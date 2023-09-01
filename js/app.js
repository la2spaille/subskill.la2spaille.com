window.M = {};

M.Is = {
    def: t => t !== undefined,
    und: t => t === undefined,
    null: t => t === null,
    str: t => typeof t == "string",
    obj: t => t === Object(t),
    arr: t => t.constructor === Array,
    img: t => t.tagName === "IMG",
    interval: (t, inf, sup) => t >= inf && t <= sup
};
M.Ease = {
    linear: t => t,
    cb: t => t ** 3 - 3 * t ** 2 + 3 * t,
    o1: t => Math.sin(t * (Math.PI / 2)),
    io2: t => t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1,
    o3: t => (--t) * t * t + 1,
    i3: t => t * t * t,
    io3: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    o5: t => 1 + --t * t * t * t * t,
    o6: t => 1 === t ? 1 : 1 - 2 ** (- 10 * t),
    io6: t => {
        if (t === 0) return 0
        if (t === 1) return 1
        if ((t /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (t - 1))
        return 0.5 * (-Math.pow(2, -10 * --t) + 2)
    }
};
M.XY = {
    accX: 0, accY: 0,
    offsetTop: function (el) {
        this.accY = 0;
        if (el.offsetParent) {
            this.accY = this.offsetTop(el.offsetParent);
        }
        return el.offsetTop + this.accY
    },
    offsetLeft: function (el) {
        this.accX = 0;
        if (el.offsetParent) {
            this.accX = this.offsetLeft(el.offsetParent);
        }
        return el.offsetLeft + this.accX
    },
    Cx: function (el) {
        return this.offsetLeft(el) + el.offsetWidth / 2
    },
    Cy: function (el) {
        return this.offsetTop(el) + el.offsetHeight / 2
    },
    T: el => {
        const t = el.style.getPropertyValue('transform');
        const matches = t.split('(')[1].replace(')', '').split(',').map((val) => parseFloat(val.trim().replace('px', '')));


        return {
            x: matches[0],
            y: matches[1]
        }
    },

    Tx: function (el) {

        return this.T(el).x

    },

    Ty: function (el) {
        return this.T(el).y
    }
};
M.G = {
    root: r => M.Is.def(r) ? r : document,
    s: (r, t, el) => {
        const l = M.G.root(r)["getElement" + t](el);
        return t === "ById" ? l : Array.from(l)
    },
    id: (el, r) => M.G.s(r, "ById", el),
    class: (el, r) => M.G.s(r, "sByClassName", el),
    tag: (el, r) => M.G.s(r, "sByTagName", el),
    attr: el => Array.from(document.querySelectorAll(el))
};
M.Pe = {
    f: (t, r) => {
        M.Select(t).style.pointerEvents = r;
    }, all: t => {
        M.Pe.f(t, "all");
    }, none: t => {
        M.Pe.f(t, "none");
    }
};
M.Index = (el, arr) => {
    const n = M.L(arr);
    for (let i = 0; i < n; i++)
        if (el === arr[i])
            return i;
    return -1
};
M.Clamp = (t, inf, sup) => Math.max(inf, Math.min(sup, t));
M.Lerp = (s, e, a) => s * (1 - a) + a * e;
M.Has = (t, r) => Object.prototype.hasOwnProperty.call(t, r);
M.Rand = (a, b) => Math.random() * (b - a) + a;
M.Fetch = o => {
    let t = o.type === "json";
    const s = t ? "json" : "text"
        , p = {
            method: o.method,
            headers: new Headers({
                "Content-type": t ? "application/x-www-form-urlencoded" : "text/html"
            }),
            mode: "same-origin"
        };
    t && (p.body = o.body);
    fetch(o.url, p)
        .then(r => {
            if (r.ok) return r[s]()
        })
        .then(r => {
            o.success(r);
        });
};
M.PD = t => {
    t.cancelable && t.preventDefault();
};
M.Bind = (t, f) => {
    f.forEach(T => {
        t[T] = t[T].bind(t);
    });
};
M.Select = el => {
    if (!M.Is.str(el)) return el
    let s = el.substring(1),
        c = el.charAt(0) === "#" ? M.G.id(s) : el.charAt(0) === "." ? M.G.class(s) : M.G.tag(el);
    if (M.Is.null(c)) return
    c = M.Is.arr(c) ? c : [c];
    return c[0]
};
M.SelectAll = el => {
    if (!M.Is.str(el)) {
        if (M.Is.arr(el)) {
            return el
        } else {
            return [el]
        }
    }
    let s = el.substring(1),
        c = el.charAt(0) === "#" ? M.G.id(s) : el.charAt(0) === "." ? M.G.class(s) : M.G.tag(el);
    if (M.Is.null(c)) return
    return M.Is.arr(c) ? c : [c]
};
M.Ga = (t, r) => t.getAttribute(r);
M.T = (t, x, y, u) => {
    t = M.Select(t);
    if (M.Is.und(t)) return
    u = M.Is.und(u) ? "%" : u;
    const xyz = "translate3d(" + x + u + "," + y + u + ",0)";
    let s = t.style;
    s['transform'] = xyz;
    s['mozTransform'] = xyz;
    s['msTransform'] = xyz;
};
M.O = (t, r) => {
    t = M.Select(t);
    t.style.opacity = r;
};
M.D = (t, r) => {
    r = r === 'n' ? 'none' : 'flex';
    let s = M.Select(t).style;
    s['display'] = r;
};
M.S = (t, p, r) => {
    let s = M.Select(t).style;
    s[p] = r;

};
M.R = (t, r) => {
    r = M.Is.und(r) ? 100 : 10 ** r;
    return Math.round(t * r) / r
};
M.E = (el, e, cb, o, opt) => {
    const s = M.SelectAll(el);
    o = o === 'r' ? 'remove' : 'add';
    s.forEach(T => {
        T[o + "EventListener"](e, cb, opt);
    });
};
M.L = t => t.length;
M.De = (t, s) => {
    const cE = new CustomEvent(s);
    t.dispatchEvent(cE);
};
M.Cl = (el, action, css) => {
    if (M.Is.und(el)) return
    const s = M.SelectAll(el);
    action = action === 'a' ? 'add' : action === 'r' ? 'remove' : 'toggle';
    s.forEach(T => {
        T.classList[action](css);
    });
};
M.Cr = el => document.createElement(el);
M.Tg = (t, i = false) => i ? t.currentTarget : t.target;
M.Pn = t => t.parentNode;
M.C = t => Array.from(t.children);
M.Sp = t => t.stopPropagation();
M.In = t => location.href.includes(t);
M.__ = (p, v, t) => {
    const el = t ? M.Select(t) : M.Dom.root;
    el.style.setProperty(p, v);
};
M.g__ = (p) => {
    let root = M.Dom.root,
        v = root.style.getPropertyValue(p);
    return parseFloat(v.split('px')[0])
};


M.Mo = class {
    constructor(o) {
        M.Bind(this, ['run', 'rRaf', 'uProp']);
        this.r = new M.RafR(this.run);
        this.o = this.init(o);
    }

    init(o) {
        let i = {
            el: o.el ? M.SelectAll(o.el) : [],
            d: {
                origin: o.d || 0,
                curr: 0
            },
            delay: o.delay || 0,
            cb: o.cb || !1,
            a: o.a || !1,
            i: o.i || !1,
            r: o.r || 2,
            e: {
                curve: o.e || "linear"
            },
            prog: 0,
            progE: 0,
            elapsed: 0
        };
        i.i && i.i();
        i.el = M.Is.arr(i.el) ? i.el : [i.el];
        i.elL = i.el.length;
        i.up = M.Has(o, 'update') ? t => o.update(i) : this.uProp;
        let p = o.p || !1;
        if (p) {
            i.prop = {};
            i.propLi = [];
            let k = Object.keys(p);
            i.propL = k.length;
            let n = i.propL;
            for (; n--;) {
                const c = k[n];
                i.prop[n] = {
                    name: c,
                    origin: {
                        start: p[c][0],
                        end: p[c][1],
                    },
                    curr: p[c][0],
                    start: p[c][0],
                    end: p[c][1],
                    unit: p[c][2] || '%'
                };
                if (M.L(c) < 4) {
                    i.propLi[c] = n;

                } else {
                    i.propLi[c.charAt(0)] = n;

                }
            }

        }
        return i
    }

    uProp() {
        const p = this.o.prop;
        let li = this.o.propLi;
        let n = this.o.propL;
        for (; n--;) {
            let ob = p[n];


            ob.curr = this.lerp(ob.start, ob.end);

            let x = M.Has(li, 'x') ? p[li.x].curr + p[li.x].unit : 0,
                y = M.Has(li, 'y') ? p[li.y].curr + p[li.y].unit : 0,
                r = M.Has(li, 'r') ? p[li.r].name + '(' + p[li.r].curr + 'deg)' : 0,
                sX = M.Has(li, 'sX') ? 'scaleX(' + p[li.sX].curr + ')' : 0,
                sY = M.Has(li, 'sY') ? 'scaleY(' + p[li.sY].curr + ')' : 0,
                s = M.Has(li, 's') ? 'scale(' + p[li.s].curr + ')' : 0,
                xy = x + y === 0 ? 0 : 'translate3d(' + x + ',' + y + ', 0)';
            var t = xy + r + sX + sY + s === 0 ? 0 : [xy, r, sX, sY, s].filter(t => t !== 0).join(" "),
                o = M.Has(li, 'o') ? p[li.o].curr : -1,
                g = M.Has(li, 'g') ? 'grayscale(' + p[li.g].curr + ')' : -1;
        }
        n = this.o.elL;
        for (; n-- && M.Is.def(this.o.el[n]);) {
            t !== 0 && (this.o.el[n].style.transform = t);
            o >= 0 && (this.o.el[n].style.opacity = o);
            g !== 0 && (this.o.el[n].style.filter = g);
        }
    }

    run(t) {
        if (this.o.prog === 1) {
            this.pause();
            this.o.up();
            this.o.cb && this.o.cb();
        } else {
            this.o.elapsed = M.Clamp(t, 0, this.o.d.curr);
            this.o.prog = M.Clamp(this.o.elapsed / this.o.d.curr, 0, 1);
            this.o.progE = this.o.e.calc(this.o.prog);
            this.o.a && this.o.a(this.o.progE);
            this.o.up();
        }
    }

    update(o) {
        let t = o || {},
            s = M.Has(t, 'reverse') ? "start" : "end";
        if (M.Has(this.o, 'prop')) {
            let n = this.o.propL;
            for (; n--;) {
                let p = this.o.prop[n];
                p.end = p.origin[s];
                p.start = p.curr;
            }
        }
        this.o.d.curr = t.d ? t.d : M.R(this.o.d.origin - this.o.d.curr + this.o.elapsed);
        this.o.e.curve = t.e || this.o.e.curve;
        this.o.e.calc = M.Ease[this.o.e.curve];
        this.o.delay = (M.Has(t, 'delay') ? t : this.o).delay;
        this.o.cb = (M.Has(t, 'cb') ? t : this.o).cb;
        this.o.prog = this.progE = this.o.d.curr === 0 ? 1 : 0;
        this.delay = new M.Delay(this.o.delay, this.rRaf);
    }

    rRaf() {
        this.r.run();
    }

    play(t) {
        this.pause();
        this.update(t);
        this.delay.run();
    }

    pause() {
        this.r.stop();
        this.delay && this.delay.stop();
    }

    lerp(s, e) {
        return M.R(M.Lerp(s, e, this.o.progE), this.o.r)
    }
};
M.TL = class {
    constructor() {
        this.arr = [];
        this.delay = 0;
    }

    add(o) {
        this.delay += M.Has(o, "delay") ? o.delay : 0;
        o.delay = this.delay;
        this.arr.push(new M.Mo(o));
        return this
    }

    play(t) {
        this.arr.forEach(el => {
            el.play();
        });
    }
};
M.Tab = class {

    constructor() {
        this.arr = [];
        this.pause = 0;

        M.Bind(this, ['v']);

        M.E(document, 'visibilitychange', this.v, 'a');
    }

    add(o) {
        this.arr.push(o);
    }

    v() {
        const now = performance.now();
        let elapsed;
        let type;

        if (document.hidden) {
            this.pause = now;
            type = 'stop';
        } else {
            elapsed = now - this.pause;
            type = 'start';
        }

        const l = this.l();
        for (let i = l; i >= 0; i--) {
            this.arr[i][type](elapsed);
        }
    }

    l() {
        return this.arr.length - 1
    }

};
M.Raf = class {
    static Tab = new M.Tab

    constructor() {
        M.Bind(this, ['loop', 'tOff', 'tOn']);
        this.arr = [];
        this.pause = 0;
        this.on = true;

        M.Raf.Tab.add({ stop: this.tOff, start: this.tOn });

        this.raf();
    }

    tOff() {
        this.on = false;
    }

    tOn(e) {
        const l = this.l();
        for (let i = l; i >= 0; i--) {
            this.arr[i].sT += e;
        }
        this.on = true;
    }

    add(o) {
        this.arr.push(o);
    }

    remove(id) {
        const l = this.l();
        for (let i = l; i >= 0; i--) {
            if (this.arr[i].id === id) {
                this.arr.splice(i, 1);
                return
            }
        }
    }

    loop(t) {
        if (this.on) {
            const l = this.l();
            for (let i = l; i >= 0; i--) {
                const arr = this.arr[i];
                if (!arr.sT)
                    arr.sT = t;
                const elapsed = t - arr.sT;
                arr.cb(elapsed);
            }
        }
        this.raf();
    }

    raf() {
        requestAnimationFrame(this.loop);
    }

    l() {
        return this.arr.length - 1
    }
};

M.RafR = class {
    static Raf = new M.Raf
    static id = 0

    constructor(cb) {

        M.Bind(this, ['run', 'stop']);
        this.cb = cb;
        this.id = M.RafR.id;
        this.on = !1;
        M.RafR.id++;
    }

    run() {
        if (!this.on) {
            M.RafR.Raf.add({ id: this.id, cb: this.cb });
            this.on = true;
        }
    }

    stop() {
        if (this.on) {
            M.RafR.Raf.remove(this.id);
            this.on = false;
        }
    }

};


M.Throttle = class {

    constructor(o) {
        this.del = o.delay;
        this.onlyAtEnd = o.onlyAtEnd;
        this.cb = o.cb;
        this.last = 0;
        this.t = 0;
    }

    run() {
        let firstTime = true;
        const now = Date.now();
        if ((this.last && now < this.last + this.del) || firstTime) {
            firstTime = false;
            clearTimeout(this.t);
            this.t = setTimeout(_ => {
                this.last = now;
                this.cb();
            }, this.del);
        } else {
            this.last = now;
            if (!this.onlyAtEnd) {
                firstTime = false;
                this.cb();
            }
        }
    }

};
M.RO = class {

    constructor(o) {
        this.E = 'resize';
        this.tick = false;
        this.arr = [];

        M.Bind(this, ['fn', 'gRaf', 'run']);

        this.t = new M.Throttle({
            delay: 100,
            onlyAtEnd: true,
            cb: this.gRaf
        });
        this.raf = new M.RafR(this.run);

        M.E(window, this.E, this.fn, 'a');
    }

    add(o) {
        this.arr.push(o);
    }

    remove(id) {
        const l = this.l();
        for (let i = l; i >= 0; i--) {
            if (this.arr[i].id === id) {
                this.arr.splice(i, 1);
                return
            }
        }
    }

    fn(e) {
        this.e = e;
        this.t.run();
    }

    gRaf() {
        if (!this.tick) {
            this.tick = true;
            this.raf.run();
        }
    }

    run() {
        const l = this.l();
        for (let i = l; i >= 0; i--) {
            this.arr[i].cb(this.e);
        }

        this.raf.stop();
        this.tick = false;
    }

    l() {
        return this.arr.length - 1
    }

};
M.ROR = class {

    static Ro = new M.RO()
    static RoId = 0

    constructor(c) {
        this.cb = c;

        this.id = M.ROR.RoId;
        M.ROR.RoId++;
    }

    on() {
        M.ROR.Ro.add({ id: this.id, cb: this.cb });
    }

    off() {
        M.ROR.Ro.remove(this.id);
    }

};

M.Delay = class {
    constructor(d, cb) {
        M.Bind(this, ["loop"]);
        this.d = d;
        this.cb = cb;
        this.r = new M.RafR(this.loop);
    }

    run() {
        this.d === 0 ? this.cb() : this.r.run();
    }

    stop() {
        this.r.stop();
    }

    loop(e) {
        let t = M.Clamp(e, 0, this.d);
        if (t === this.d) {
            this.stop();
            this.cb();
        }
    }
};
M.Scope = class {
    constructor(el, r, o) {
        M.Bind(this, ['cb']);
        this.el = M.Select(el);
        this.r = r;
        this.o = o;
    }

    e(a) {
        M.E(document, 'scroll', this.cb, a);
        M.E(window, 'load', this.cb, a);
    }

    observe() {
        this.e('a');

    }

    unobserve() {
        this.e('r');

    }

    visible() {
        const r = this.r, h = this.el.offsetHeight;
        let t = this.el.getBoundingClientRect().top,
            b = this.el.getBoundingClientRect().bottom,
            vH = (innerHeight - t) / h;

        return (vH > r) && (b > 0);

    }


    cb() {
        if (this.visible()) {
            this.o.css && this.cl();
            this.o.cb && this.o.cb();
            this.unobserve();
        }
    }

    cl() {
        this.o.css && M.Cl(this.el, 'r', this.o.css);
    }
};
M.sLetter = (s) => {
    M.SelectAll(s).forEach(el => {
        const chars = [...el.textContent];
        el.innerHTML = "";
        chars.forEach((char) => {
            const span = M.Cr("span");
            span.textContent = char;
            el.append(span);
        });
    });
};

M.SLine = class {
    constructor(el, css) {
        this.el = M.Select(el);
        this.c = css;
        this.w = [];
        this.init();
    }

    init() {
        const l = this.el.childNodes;
        l.forEach(n => {
            if (n.nodeType === 3) {
                const words = n.nodeValue.trim().split(' ');
                words.forEach(word => {
                    this.w.push({
                        type: 'txt',
                        n: word
                    });
                });
            } else {
                this.w.push({
                    type: 'a',
                    n: n.outerHTML
                });
            }
        });
        this.resize();

    }

    resize() {
        const w = this.el.offsetWidth;
        let d = M.Cr('div'),
            s = d.style,
            css = (s.visibility = 'hidden', s.position = 'absolute', s.whiteSpace = 'nowrap', getComputedStyle(this.el));
        s.fontFamily = this.gPV(css, 'font-family');
        s.fontSize = this.gPV(css, 'font-size');
        s.fontWeight = this.gPV(css, 'font-weight');
        s.letterSpacing = this.gPV(css, 'letter-spacing');
        M.Dom.body.prepend(d);
        let r = 0, l = [], i = '';
        l[r] = [];

        this.w.forEach(({ type, n }, i) => {
            l[r].push(n);
            d.innerHTML = l[r].join(' ');
            if (d.offsetWidth >= w) {
                l[r].pop();
                l[r] = l[r].join(' ').trim();
                l[r] = l[r].replaceAll(/(\s+)(?=,)/g, '');

                r++;
                l[r] = [];
                l[r].push(n);

            }
        });
        l[r] = l[r].join(' ').trim();
        l[r] = l[r].replaceAll(/(\s+)(?=,)/g, '');
        const b = `<span class="f-hidden"><span class="m-line ${this.c}">`,
            e = '</span></span>';
        l.forEach(r => {
            i += b + r + e;
        });

        d.parentNode.removeChild(d);
        this.el.innerHTML = i;
    }

    gPV(s, p) {
        return s.getPropertyValue(p)
    }
};
M.Dom = {
    html: document.documentElement,
    body: document.body,
    root: document.documentElement,
    nav: M.Select('#nav')
};

window.W = {};
W = class {
    static get w() {
        return innerWidth
    }

    static get hW() {
        return innerWidth / 2
    }

    static get h() {
        return innerHeight
    }

    static get hH() {
        return innerHeight / 2
    }
};

!function () {

    // Introduction
    class io {
        constructor() {
            M.Bind(this, ['intro']);

            this.init();


        }

        init() {

        }

        index() {
            this.intro()
        }

        intro(d = B.delay) {
            this.run()
        }

        run() {
            B.e.n.run();
            B.e.s.run()
            C.run();
        }

    }



    class C$Home {
        constructor() {

            this.isOn = false;


        }


        on() {
            this.isOn || this.plug();
            this.init();
            this.isOn = true;
        }

        off() {
            this.isOn = false;

        }

        plug() {
        }

        init() {



        }

        intro() {

        }

        run() {

        }
    }

    class C {
        static p = {
            '/': new C$Home()
        };

        static run() {
            C.p[location.pathname].on();
        };

        static intro() {

            C.p[location.pathname].intro();

        };

    }



    // Scroll
    class s {
        constructor() {
            M.Bind(this, ["w", "key", "tS", "tM", "onScroll", "loop", "run", "resize", "loop"]);

            this._scroll = {
                y: 0,
                dY: 0,
                o: null,

            };
            this.options = {
                mM: 1,
                tM: 2,
                fM: 50,
                kS: 240,
                s: 0.5,
                preventTouch: false,
                space: true,
                direction: 'y'
            };
            this.scroll = {
                ...this._scroll,
                v: 0
            };
            this.isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
            this.isScrolling = false;
            this.hasScrollTicking = false;
            this.l = false;
            this.roR = new M.ROR(this.resize);
            this.roR.on();


        }

        get root() {
            if (M.Select('#overlay').classList.contains('is-active')) {
                return M.Select('#work')
            } else {
                return M.Dom.root
            }
        }

        get maxY() {
            const p = this.root == M.Select('#work') ? 40 : 0;
            return this.root.scrollHeight + p - W.h
        }

        rRaf() {
            this.t = Date.now();
            this.isScrolling = true;
            this.loop();
        }

        pause() {
            cancelAnimationFrame(this.loopId);
            this.isScrolling = false;
            this._scroll.y = M.R(this._scroll.y);

        }

        cb(e) {
            const s = this._scroll,
                smooth = !!e.changedTouches ? false : true;
                return
            if (e.ctrlKey) return
            if (!smooth) return
            if (e.buttons === 4) return
            M.PD(e);
            requestAnimationFrame(() => {
                s.y = M.Clamp(s.y + s.dY, 0, this.maxY);
                this.scroll.o = s.o = e;
                if (!this.isScrolling) this.rRaf();
            });


        }

        loop() {
            if (this.isScrolling) {
                if (!this.hasScrollTicking) {
                    this.loopId = requestAnimationFrame(() => this.loop());
                    this.hasScrollTicking = true;
                }
                this.lerp();
                this.root.scrollTo(0, this.scroll.y);


                const d = Math.abs(this.scroll.y - this._scroll.y), _t = Date.now() - this.t;
                if (_t > 100 && d < 0.5) {
                    this.pause();
                }
                this.hasScrollTicking = false;
            }

        }

        run() {
            M.Cl(M.Dom.root, 'r', 's');
            !this.l && this.e('a');
            this.l = true;
        }

        stop() {
            M.Cl(M.Dom.root, 'a', 's');
            this.l && this.e('r');
            this.l = false;
        }

        init() {
            this.root.scrollTo(0, 0);
            this.scroll = { ...this.scroll, maxY: this.maxY };
            B.scroll = this.scroll;
            this.scroll.y = this._scroll.y = scrollY;


        }

        w(e) {
            const s = this._scroll;
            const o = this.options;
            const { deltaY } = e;
            s.dY = deltaY;
            if (this.isFirefox && e.deltaMode === 1) {
                s.dY *= o.fM;
            }
            s.dY *= o.mM;
            this.cb(e);
        }

        tS(e) {
            const T = (e.targetTouches) ? e.targetTouches[0] : e;
            this.tsY = T.pageY;
        }

        tM(e) {
            const s = this._scroll;
            const T = (e.targetTouches) ? e.targetTouches[0] : e;
            s.dY = (T.pageY - this.tsY) * this.options.tM;
            this.tsY = T.pageY;
            this.cb(e);
        }

        key(e) {
            const o = this.options;
            if (e.keyCode === 32 && !o.space) return
            const s = this._scroll;
            s.dY = 0;
            const keys = [
                { c: 37, d: 'y', s: -1 },
                { c: 39, d: 'y', s: 1 },
                { c: 38, d: 'y', s: -1 },
                { c: 40, d: 'y', s: 1 },
                { c: 32, d: 'y', s: 2 }
            ];
            keys.forEach(key => {
                if (e.keyCode === key.c) {
                    s[key.d === "x" ? "dX" : "dY"] = o.kS * key.s;
                }
            });

            (s.dY) && this.cb(e);
        }

        lerp() {
            const s = 0.09;
            this.scroll.y = M.Lerp(this.scroll.y, this._scroll.y, s);
        }

        resize(e) {
            if (this.maxY === 0) return
            requestAnimationFrame(() => {
                const s = this._scroll;
                s.y = M.R(M.Clamp(s.y, 0, this.maxY), 0);
                if (!this.isScrolling) this.rRaf();
            });

        }

        onScroll() {
            if (this.maxY === 0) return
            if (!this.isScrolling) {
                this.scroll.y = this._scroll.y = scrollY;
            }

        }

        e(o) {
            M.E(document, "keydown", this.key, o);
            M.E(document, "wheel", this.w, o, { passive: false });
            M.E(window, "touchstart", this.tS, o, { passive: false });
            M.E(window, "touchmove", this.tM, o);
            M.E(document, "scroll", this.onScroll, o, { passive: !1 });
        }


        scrollTo(y) {
            if (this.maxY === 0) return
            this._scroll = y;

        }


    }
    // Toggle
    class T {
        constructor(el) {
            this.id = el.id
            this.run()
        }

        static plug() {
            return Array.from(M.SelectAll('.T')).map(
                (el) => {
                    return new T(el)
                }
            )
        }

        run() {
            this.e('a')
        }

        e(a) {
            console.log(this.id)
            const
                s = B.e.s;
            M.E(".open_" + this.id, 'click', (e) => {
                M.Sp(e);
                s.stop();
                this.cl('a');
                if (this.id === 'search') M.Select('#searchInput').focus();
            }, a);
            M.E(".close_" + this.id, 'click', (e) => {
                M.Sp(e);
                s.run();
                this.cl('r');
            }, a);
        }

        cl(o) {
            M.Cl(M.Select("#" + this.id), o, "is-active");
        }
    }

    // Nav 
    class n {
        constructor() {
            M.Bind(this, ['open', 'close'])
            this.subMenu = ['solutions','services','entreprise','ressources']

        }
        open(e) {
            this.cb(e, 'a')
        }

        close(e) {
            this.cb(e, 'r')
        }

        cb(e, o) {
            M.Sp(e)
            M.Cl("#menu", o, 'is-active')
            M.Cl(".open_menu", o, 'is-active')
            M.Cl(".close_menu", o, 'is-active')
        }
          e(o) {
            M.E(".open_menu", 'click', this.open, o)
            M.E(".close_menu", 'click', this.close, o)

        }
        run() {
            this.isOn || this.e('a')
            this.isOn = true

        }
    }


    // Brain
    class b {
        constructor() {
            M.Bind(this, ['setSafePadding']);
            this.io = new io();
            this.roR = new M.ROR(this.setSafePadding);
            this.on(true);
        }

        plug() {
            B.e.s = new s();
            B.e.n = new n();
            B.E.T = T.plug()
        }

        init() {
            this.setSafePadding();
            B.e.s.init();
        }

        intro() {
            this.io.index();

        }

        run() {
            B.e.s.run();
            B.e.n.run();

        }

        setSafePadding() {
            if (M.Dom.nav === undefined) return
            const top = M.Dom.nav.offsetHeight;
            M.__('--safe-padding-top', top + 'px');

        }


        on(init) {
            init && this.roR.on();
            this.plug();
            this.init();
            this.intro();
        }


    };

    B.e.b = new b();
    console.log('\n %c Made with ❤️ by La2spaille : https://www.la2spaille.studio  %c \n ', 'border: 1px solid #000;color: #fff; background: #000; padding:5px 0;', '');
}();
