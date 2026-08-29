const languageButtons = [...document.querySelectorAll("[data-lang]")];
const copyBlocks = [...document.querySelectorAll("[data-copy]")];

function setProjectLanguage(language) {
  const activeLanguage = language === "en" ? "en" : "zh";
  document.documentElement.lang = activeLanguage === "zh" ? "zh-CN" : "en";
  copyBlocks.forEach((block) => {
    block.hidden = block.dataset.copy !== activeLanguage;
  });
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === activeLanguage));
  });
  const title = document.body.dataset[`title${activeLanguage === "zh" ? "Zh" : "En"}`];
  if (title) document.title = title;
  localStorage.setItem("ethan-site-language", activeLanguage);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setProjectLanguage(button.dataset.lang));
});
setProjectLanguage(localStorage.getItem("ethan-site-language") === "en" ? "en" : "zh");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = [...document.querySelectorAll(".reveal")];
if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: "0px 0px -8%" });
  reveals.forEach((element) => observer.observe(element));
}

const demoVideos = [...document.querySelectorAll("video[data-autoplay]")];
if (!reduceMotion && "IntersectionObserver" in window) {
  const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > .55) entry.target.play().catch(() => {});
      else entry.target.pause();
    });
  }, { threshold: [0, .55, 1] });
  demoVideos.forEach((video) => mediaObserver.observe(video));
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
