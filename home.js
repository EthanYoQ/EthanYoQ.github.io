/* 首页交互：语言切换、进入动效、飘雪、哈士奇倾斜、窗口视差、跑马灯、视频。
   所有动画合并在一个 requestAnimationFrame 循环里，并且只处理当前可见的区块。 */
(() => {
  const copy = window.SITE_COPY;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- 语言 ---------- */
  const description = $('meta[name="description"]');
  const buttons = $$("[data-lang]");
  let words = [];
  let wordIndex = 0;
  function setLanguage(language) {
    const dict = copy[language] || copy.zh;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = dict.pageTitle;
    description?.setAttribute("content", dict.pageDescription);
    $$("[data-i18n]").forEach((el) => { if (dict[el.dataset.i18n] != null) el.textContent = dict[el.dataset.i18n]; });
    $$("[data-i18n-html]").forEach((el) => { if (dict[el.dataset.i18nHtml] != null) el.innerHTML = dict[el.dataset.i18nHtml]; });
    $$("[data-i18n-aria]").forEach((el) => { if (dict[el.dataset.i18nAria] != null) el.setAttribute("aria-label", dict[el.dataset.i18nAria]); });
    $$("[data-i18n-alt]").forEach((el) => { if (dict[el.dataset.i18nAlt] != null) el.setAttribute("alt", dict[el.dataset.i18nAlt]); });
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === language)));
    $$("[data-contact]").forEach((el) => { el.hidden = el.dataset.contact !== language; });
    words = dict.bubbleWords || [];
    wordIndex = 0;
    const bubble = $("#bubble");
    if (bubble && words.length) bubble.textContent = words[0];
    try { localStorage.setItem("ethan-site-language", language); } catch (e) { /* 隐私模式下忽略 */ }
  }
  buttons.forEach((b) => b.addEventListener("click", () => setLanguage(b.dataset.lang)));
  let saved = "zh";
  try { saved = localStorage.getItem("ethan-site-language") === "en" ? "en" : "zh"; } catch (e) { /* 忽略 */ }
  setLanguage(saved);

  /* ---------- 进入动效 ---------- */
  const reveals = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) reveals.forEach((el) => el.classList.add("is-visible"));
  else {
    const io = new IntersectionObserver((entries, o) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); o.unobserve(e.target); } }), { threshold: 0.08, rootMargin: "0px 0px -6%" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- 可见性：只驱动屏幕内的动画 ---------- */
  const visible = new Set();
  const vis = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))), { threshold: 0 });
  const sky = $(".sky");
  const stages = $$("[data-depth]").map((el) => ({ el, tx: 0, ty: 0, x: 0, y: 0, layers: $$(".win", el).map((w) => ({ w, k: Number(w.dataset.layer || 1), rz: getComputedStyle(w).getPropertyValue("--rz").trim() || "0deg" })) }));
  if (sky) vis.observe(sky);
  stages.forEach((s) => vis.observe(s.el));

  /* ---------- 飘雪（仅首屏） ---------- */
  const cv = $("#snow");
  const cx = cv ? cv.getContext("2d") : null;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, flakes = [], wind = 0, lastMx = 0;
  function sizeSnow() {
    if (!cv || !sky) return;
    W = sky.clientWidth; H = sky.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const density = fine ? 14000 : 30000;
    flakes = Array.from({ length: Math.round((W * H) / density) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.6 + 0.8, v: Math.random() * 0.9 + 0.35, p: Math.random() * 6.28 }));
  }
  if (cv && !reduce) { sizeSnow(); addEventListener("resize", sizeSnow); }

  /* ---------- 哈士奇倾斜 + 气泡 ---------- */
  const husky = $("#husky"), hw = $("#hw");
  let hx = 0, hy = 0, thx = 0, thy = 0;
  if (fine && !reduce) {
    addEventListener("pointermove", (e) => {
      wind += (e.clientX - lastMx) * 0.02; lastMx = e.clientX;
      if (hw) { const b = hw.getBoundingClientRect(); thx = (e.clientX - (b.left + b.width / 2)) / innerWidth; thy = (e.clientY - (b.top + b.height / 2)) / innerHeight; }
      stages.forEach((s) => { const b = s.el.getBoundingClientRect(); s.tx = (e.clientX - (b.left + b.width / 2)) / innerWidth; s.ty = (e.clientY - (b.top + b.height / 2)) / innerHeight; });
    });
  }
  const bubble = $("#bubble");
  if (bubble && !reduce) {
    setInterval(() => {
      if (!words.length || !visible.has(sky)) return;
      wordIndex = (wordIndex + 1) % words.length;
      bubble.classList.add("pop");
      setTimeout(() => { bubble.textContent = words[wordIndex]; bubble.classList.remove("pop"); }, 180);
    }, 2200);
  }

  /* ---------- 跑马灯：速度随滚动速度，方向随滚动方向 ---------- */
  const track = $("#track");
  let anim = null, lastY = scrollY, dir = 1;
  if (track && !reduce) anim = track.animate([{ transform: "translateX(0)" }, { transform: "translateX(-25%)" }], { duration: 16000, iterations: Infinity });

  /* ---------- 统一动画循环 ---------- */
  function frame() {
    const heroOn = sky && visible.has(sky);
    if (heroOn) {
      if (cx && !reduce) {
        cx.clearRect(0, 0, W, H);
        wind *= 0.96;
        for (const f of flakes) {
          f.p += 0.01; f.y += f.v + Math.abs(wind) * 0.1; f.x += Math.sin(f.p) * 0.4 + wind * f.r * 0.22;
          if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
          if (f.x > W + 6) f.x = -6; else if (f.x < -6) f.x = W + 6;
          cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, 6.283); cx.fillStyle = `rgba(255,255,255,${0.35 + f.r / 5})`; cx.fill();
        }
      }
      if (husky) {
        hx += (thx - hx) * 0.08; hy += (thy - hy) * 0.08;
        husky.style.transform = `rotate(4deg) rotateY(${(hx * 26).toFixed(2)}deg) rotateX(${(hy * -22).toFixed(2)}deg) translate3d(${(hx * 20).toFixed(1)}px,${(hy * 14).toFixed(1)}px,0)`;
      }
      if (anim) {
        const v = scrollY - lastY; lastY = scrollY;
        if (Math.abs(v) > 0.5) dir = Math.sign(v);
        anim.playbackRate += (dir * (1 + Math.min(Math.abs(v) * 0.35, 9)) - anim.playbackRate) * 0.08;
      }
    } else lastY = scrollY;
    for (const s of stages) {
      if (!visible.has(s.el)) continue;
      s.x += (s.tx - s.x) * 0.08; s.y += (s.ty - s.y) * 0.08;
      for (const { w, k, rz } of s.layers) w.style.transform = `translate3d(${(s.x * -30 * k).toFixed(1)}px,${(s.y * -22 * k).toFixed(1)}px,0) rotateY(${(s.x * 8).toFixed(2)}deg) rotateX(${(s.y * -6).toFixed(2)}deg) rotate(${rz})`;
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) requestAnimationFrame(frame);
  else stages.forEach((s) => s.layers.forEach(({ w, rz }) => { w.style.transform = `rotate(${rz})`; }));

  /* ---------- 色域粘性堆叠：内容装不进一屏时自动降级为普通流式，避免底部按钮被截断 ---------- */
  const fieldsWrap = $(".fields");
  function fitFields() {
    if (!fieldsWrap) return;
    fieldsWrap.classList.remove("is-flow");
    const stuck = $$(".field", fieldsWrap).some((f) => getComputedStyle(f).position === "sticky");
    if (stuck && $$(".field", fieldsWrap).some((f) => f.scrollHeight > f.clientHeight + 1)) fieldsWrap.classList.add("is-flow");
  }
  fitFields();
  addEventListener("resize", fitFields);
  addEventListener("load", fitFields);
  if (document.fonts?.ready) document.fonts.ready.then(fitFields);
  buttons.forEach((b) => b.addEventListener("click", () => requestAnimationFrame(fitFields)));

  /* ---------- 视频：进入视口播放，离开暂停 ---------- */
  const videos = $$("video[data-autoplay]");
  if (!reduce && "IntersectionObserver" in window) {
    const vio = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting && e.intersectionRatio > 0.45) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: [0, 0.45, 0.8] });
    videos.forEach((v) => vio.observe(v));
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
