#!/usr/bin/env python3
"""重新生成展示字体子集（得意黑 / 霞鹜文楷），并校验页面里每个展示字符都被覆盖。

为什么需要它：站点只对「展示元素」（标有 data-font 的标题、海报字、气泡等）使用自托管中文字体，
并把字体裁到只含这些字符（几十 KB）。改了这些元素的文案之后必须重新运行本脚本，否则缺字会回退到系统字体，
在巨型标题里很显眼。

用法（在仓库根目录）：
    python -m pip install fonttools brotli beautifulsoup4
    python tools/build-fonts.py --download   # 首次：从 GitHub Release 下载原始 TTF（约 25MB，缓存在 tools/.cache/）
    python tools/build-fonts.py              # 重新生成 assets/fonts/*.woff2 并校验
    python tools/build-fonts.py --check      # 只校验覆盖，不生成（缺字时退出码为 1）

字体授权：得意黑 Smiley Sans（atelier-anchor/smiley-sans）与霞鹜文楷 LXGW WenKai（lxgw/LxgwWenKai）均为 SIL OFL 1.1。
"""
import glob
import json
import re
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "tools" / ".cache"
OUT = ROOT / "assets" / "fonts"
FONTS = {
    "smiley": {"src": CACHE / "SmileySans-Oblique.ttf", "out": OUT / "smiley-display.woff2"},
    "kai": {"src": CACHE / "LXGWWenKai-Medium.ttf", "out": OUT / "kai-display.woff2"},
}
BASE = "".join(chr(c) for c in range(32, 127)) + "，。、：；！？“”‘’（）—·…\u00a0"


def load_copy():
    text = (ROOT / "i18n.js").read_text(encoding="utf-8")
    return json.loads(text[text.index("{"): text.rindex("}") + 1])


def plain(value):
    return re.sub(r"<[^>]+>", "", value)


def collect():
    """返回 {字体名: 需要覆盖的字符集合}，来源：HTML 中的 data-font 元素 + i18n.js 里对应 key 的中英文值。"""
    copy = load_copy()
    need = {k: set(BASE) for k in FONTS}
    for page in glob.glob(str(ROOT / "**" / "*.html"), recursive=True):
        if "/tools/" in page.replace("\\", "/"):
            continue
        soup = BeautifulSoup(Path(page).read_text(encoding="utf-8"), "html.parser")
        for el in soup.select("[data-font]"):
            kind = el["data-font"]
            if kind not in need:
                continue
            need[kind] |= set(el.get_text())
            for attr in ("data-i18n", "data-i18n-html"):
                key = el.get(attr)
                if key:
                    for lang in copy.values():
                        if key in lang:
                            need[kind] |= set(plain(lang[key]))
            if el.get("id") == "bubble":  # 气泡轮播词
                for lang in copy.values():
                    for word in lang.get("bubbleWords", []):
                        need[kind] |= set(word)
    for k in need:
        need[k] = {c for c in need[k] if not c.isspace() or c == " "}
    return need


def download():
    CACHE.mkdir(parents=True, exist_ok=True)
    subprocess.run(["gh", "release", "download", "v2.0.1", "-R", "atelier-anchor/smiley-sans", "-p", "smiley-sans-v2.0.1.zip", "--dir", str(CACHE), "--clobber"], check=True)
    import zipfile
    with zipfile.ZipFile(CACHE / "smiley-sans-v2.0.1.zip") as z:
        z.extract("SmileySans-Oblique.ttf", CACHE)
    subprocess.run(["gh", "release", "download", "v1.522", "-R", "lxgw/LxgwWenKai", "-p", "LXGWWenKai-Medium.ttf", "--dir", str(CACHE), "--clobber"], check=True)


def build(need):
    OUT.mkdir(parents=True, exist_ok=True)
    for name, cfg in FONTS.items():
        if not cfg["src"].exists():
            sys.exit(f"缺少 {cfg['src']}，请先运行 --download")
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        font = subset.load_font(str(cfg["src"]), opts)
        sub = subset.Subsetter(opts)
        sub.populate(text="".join(sorted(need[name])))
        sub.subset(font)
        subset.save_font(font, str(cfg["out"]), opts)
        print(f"{name}: {len(need[name])} 个字符 -> {cfg['out'].relative_to(ROOT)} ({cfg['out'].stat().st_size // 1024} KB)")


def check(need):
    ok = True
    for name, cfg in FONTS.items():
        if not cfg["out"].exists():
            print(f"[缺失] {cfg['out']}")
            ok = False
            continue
        cmap = TTFont(str(cfg["out"])).getBestCmap()
        missing = sorted(c for c in need[name] if ord(c) not in cmap)
        if missing:
            ok = False
            print(f"[缺字] {name}: {''.join(missing)}")
    print("字体覆盖校验通过" if ok else "字体覆盖校验失败：请运行 python tools/build-fonts.py")
    return ok


if __name__ == "__main__":
    args = set(sys.argv[1:])
    if "--download" in args:
        download()
    needed = collect()
    if "--check" not in args:
        build(needed)
    sys.exit(0 if check(needed) else 1)
