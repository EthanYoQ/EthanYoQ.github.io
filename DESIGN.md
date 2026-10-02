# EthanYoQ 作品站设计系统（雪山哈士奇 × 色域海报 · 2026-10）

本文件由改版完成后的页面反推而成，用于保证后续修改保持一致。设计方向来自两个原型的合成：**原型 B（以哈士奇头像为人设、天空蓝为底）+ 原型 A（整屏色域与巨型海报字）**。参考了 Mat Voyce（动态文字）、By-Kin（编辑式排版）、Kantwon（人物剪影加大色块）、Bruno Simon（交互即导航）的思路，但不复制其版式与素材。

## 产品意图

- 个人作品站：展示 Ethan 的技术与审美，把访客导向 **GitHub（访问 / Star）** 与 **各作品详情页**。
- 作品层级：**AI Novel Writer 与 InvoiceFlowAI 是主力**（整屏色域 + 真实录屏，占最大面积）；Whisper Input 次之（浅天蓝色带 + 当前界面截图）；**AI 小红书工作台最弱**，只占一行文字，不放图和视频，但仍链接到它的详情页。
- 事实以各仓库 README 为准：**AI Novel Writer 不是“本地优先”产品**——它是桌面工作台，模型由用户自行配置（本地或云端），项目资料保存在用户电脑上。全站不得出现“本地优先 / local-first”作为产品定位（FAQ 里“我坚持的不是本地优先”这类否定表述除外）。
- 所有展示使用真实界面与真实录屏；Whisper 保留“新版录屏补录中”的诚实标注。

## 视觉主题

- 氛围：雪山、天空、哈士奇——明亮、有点淘气，但技术扎实。
- 个人人设：头像（戴墨镜的哈士奇，`assets/brand/ethan.png`）是首屏主角，天空蓝、雪白与狗毛铜色构成配色来源。
- 两种声音：**手写体 = 人（Ethan）**，**海报体 = 作品**。
  - 手写体 `Kai`（霞鹜文楷）：首屏问候、气泡、关于卡片的名字。
  - 海报体 `Smiley`（得意黑）：作品海报大字、跑马灯、理念与 FAQ 大标题、收尾大句、详情页 `<h1>`。
  - 正文一律使用系统字体栈（`PingFang SC` / `Microsoft YaHei UI` 等），不加载外部字体服务。

## 设计令牌

| 角色 | 值 | 用途 |
| --- | --- | --- |
| `--sky-1 / --sky-2 / --sky-3` | `#1b5be0 / #2f74e6 / #8ec1ff` | 首屏天空渐变（正文白字对比度 ≥ 4.5:1 的区域保持在较深的蓝上） |
| `--pale` | `#c3e2ff` | Whisper 色带、关于卡片、Whisper 详情页 |
| `--snow` | `#f6faff` | 页面底色 |
| `--navy` | `#0a2a5e` | 正文标题、描边、主按钮 |
| `--muted / --faint` | `#3f527a / #7d8cab` | 次要文字 / 弱文字 |
| `--ember` | `#ff4d1f` | AI Novel Writer 色域（取自狗毛与小说软件的红棕按钮） |
| `--cobalt` | `#2b3bff` | InvoiceFlowAI 色域 |
| `--focus` | `#ffb21e` | 键盘焦点环 |

详情页主题类（加在 `<html>` 上）：`theme-novel`（ember，深色字）、`theme-invoice`（cobalt，浅色字）、`theme-xhs`（`#cf3f2e`）、`theme-whisper`（pale，navy 字）。每个主题还定义 `--accent`（小标题与序号用，保证 ≥ 4.5:1）与 `--soft`（引用、表头底色）。

## 布局

首页顺序：
1. **天空首屏**：左侧手写问候 + 导语 + GitHub 主按钮；右侧哈士奇贴纸（光标倾斜、墨镜反光、气泡轮播词）与三个应用图标；底部海军蓝跑马灯（速度/方向随滚动）。飘雪画布只在首屏内。
2. **两个主力色域**（Novel = ember，Invoice = cobalt）：粘性堆叠，每块一屏。结构固定：序号标签 → 海报大字（装饰，`aria-hidden`）→ `<h2>`（保留 GEO 长句）→ 完整说明段 → 能力标签 → 操作按钮；另一侧是倾斜的真实录屏窗口 + 一张叠放的真实截图。
3. **Whisper**：浅天蓝色带，海报字、说明、截图（带黄点“补录中”标注）。
4. **小红书工作台**：一行（名称、短标题、说明、两个链接），最弱。
5. 理念（左大标题 + 右 2×2 分隔线）→ 关于与联系 → FAQ（答案全部可见）→ 收尾大句 + GitHub 按钮 → 页脚。

联系卡片：中文显示公众号二维码；**英文显示 GitHub 卡片取代二维码（不放邮箱）**。

详情页：悬浮胶囊顶栏 → 整块主题色首屏（身份、`<h1>` 海报体、导语、标签、操作、倾斜截图）→ 左目录 + 右正文 → 主题色 CTA。

## 组件

- 顶栏：悬浮白色磨砂胶囊（首页与详情页共用 `.site-header`），GitHub 链接自动渲染为深蓝胶囊（`a[href^="https://github.com"]`）。
- 按钮：胶囊形，最小高度 52px；主按钮深蓝/黑，次按钮透明描边；按下 `scale(.96)`。
- 图标：`assets/icons/ui/*.svg`（Lucide，来自 better-icons），用 `.icon.i-*` + CSS `mask` 继承文字色。禁止 emoji、文字符号、手写 SVG 充当图标。
- 徽标 `.badge`：说明素材性质——“真实录屏 · N 秒”“当前版本界面 · 新版录屏补录中”。
- 窗口 `.win`：真实录屏/截图，2px 描边，随光标视差与倾斜。

## 动效

- 所有首页动画合并在 `home.js` 的**单个 `requestAnimationFrame` 循环**里，用 `IntersectionObserver` 只驱动屏幕内的区块。
- 飘雪只在首屏内；粗指针设备降低密度；`prefers-reduced-motion` 下关闭飘雪、倾斜、跑马灯与视频自动播放。
- 视频：`preload="none"`，进入视口 45% 以上播放、离开暂停。
- **卡片堆叠**：Novel、Invoice、Whisper 和最后的雪白卡片 `.rest`（小红书行、理念、关于、FAQ、收尾）都是 `.fields` 的直接子元素，后一张覆盖前一张，桌面与手机一致。`home.js` 给每张卡片写入 `--stick`（卡片比视口高时为负值，让底部先贴住视口底部再被覆盖，内容不会被截断）和 `--p`（被覆盖进度，驱动缩小与变暗）。新增卡片时必须放进 `.fields` 内，否则会和上一张“连体”。

## 字体子集（改文案后必须重新生成）

展示字体只包含页面里“展示元素”用到的字符：HTML 中带 `data-font="smiley|kai"` 的元素（含对应 `data-i18n` 的中英文词典值、气泡轮播词），以及详情页 `<h1>`。因此：

- **改了任何展示元素或 `i18n.js` 里对应 key 的文案后**，运行：

  ```bash
  python -m pip install fonttools brotli beautifulsoup4
  python tools/build-fonts.py --download   # 首次：下载原始 TTF 到 tools/.cache/（已加入 .gitignore）
  python tools/build-fonts.py              # 重新生成 assets/fonts/*.woff2 并校验覆盖
  python tools/build-fonts.py --check      # 只校验（缺字时退出码为 1，可放进提交前检查）
  ```
- 新增展示元素时，给它加上 `data-font="smiley"` 或 `data-font="kai"`；漏标会在巨型标题里出现回退字形。
- 字体授权：得意黑（atelier-anchor/smiley-sans）与霞鹜文楷（lxgw/LxgwWenKai）均为 SIL OFL 1.1。

## 内容规则（GEO / SEO）

- 保留 `<head>` 中全部 meta、canonical、OG 与两段 JSON-LD。**FAQ 的可见文字必须与 FAQPage JSON-LD 逐字一致**（JSON-LD 中同一问题的多段回答以单个空格连接）。
- 每个作品的 `<h2>` 保留 GEO 长句（`novelTitle` / `invoiceTitle` / `whisperTitle` / `xhsTitle`），海报大字只是装饰。
- 中英文文案维护在 `i18n.js`（严格 JSON，字体脚本会读取）；改一边必须改另一边，英文不得与中文定位冲突。
- 引用 CSS/JS 时带 `?v=` 版本参数，改动样式或脚本时一并更新，并更新 `sitemap.xml` 的 `lastmod`。

## 素材

- 页面展示使用从真实录屏截取的 `assets/shots/*.webp`；旧横幅图（`assets/screens/*.png`，含营销文案，Novel 旧图含“本地优先”字样）不再用于展示，仅为兼容保留文件。
- 头像 `ethan.png` 目前只有 460px，首屏贴纸最大约 420 CSS px；如有更高分辨率原图应替换。

## 禁止事项

- 不使用紫蓝渐变光斑、玻璃拟态堆叠、居中三栏等“AI 通用模板”特征。
- 不声称不存在的演示、功能或数据；不展示未经核实的 Star 数。
- 不暴露私人手机号或个人即时通讯账号。
