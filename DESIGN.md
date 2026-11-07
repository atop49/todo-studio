---
title: Todo Studio — 待办事项
status: shipped
date: 2026-11-06
mode: operate
stack: React 19 + TypeScript + Vite 8 + Zustand 5 + Tailwind CSS v4 + date-fns
tokens:
  color:
    ink: "#111111"        # 主文字·墨黑（剪辑室暗房的墨）
    paper: "#f5f1e8"      # 地色·暖纸白（亮色主题的纸本台面）
    muted: "#8c877d"      # 次级文字·灰褐
    accent: "#ff4d00"     # 唯一强调·信号橙（勾选完成/主按钮/逾期/HI）
    card: "#ece6d9"       # 卡面·比地深半档的暖灰（hover 行底/表单细节行）
    hairline: "rgba(17,17,17,0.14)"      # 发丝线（墨黑 alpha）
    hairline-strong: "rgba(17,17,17,0.28)"
  theme: light  # 2026-11-06 由暗色翻转为亮色：地/文字对调（地=paper、字=ink），橙与三声部字体不变
  type:
    display: YouSheBiaoTiHei   # 品牌大标题（本地 woff2）
    sans: Geist                # 正文/控件
    mono: JetBrains Mono       # 时间码/统计读数/标签（tabular-nums）
  space:
    scale: Tailwind 默认 4px 基准；容器 max-w-4xl px-5 py-10 sm:px-8 sm:py-14
  radius:
    rule: 全站直角（rounded-none），无圆角卡片
  motion:
    todo-enter: 240ms translateY(-8px)→0 + opacity
    todo-exit: 220ms translateX(28px) + opacity（完成划出签名交互）
    readout-flash: 420ms 橙→纸白（统计变更）
    rate-bar: 500ms 宽度过渡（发丝线轨道）
    reduced-motion: prefers-reduced-motion 下全部动效关闭
---

# Todo Studio — DESIGN.md

## 1. World

**剪辑时间线工作台**。待办清单被当作剪辑项目的时间线素材：每条任务是轨道上的一格素材，带时间码索引（01/02/03…）、REC 指示、mono 读数。世界是**暖纸白台面 + 墨黑墨水 + 信号橙**的剪辑工作台——纸本质感（2026-11-06 起由暗房翻转为亮色纸面，橙与结构不变），不是通用 SaaS 后台。这个类比贯穿所有命名：任务剪辑台、录入新任务（素材入场）、完成（划出时间线）。

## 2. Voice

克制、精确、设备感。文案短促专业：`总任务 / TASKS`、`REC · 本地存储`、`全部条目`。中英双语 mono 标签是设备铭牌语法，不是装饰。没有口语化提示、没有感叹号、没有引导性废话。

## 3. Type

三声部，各居其位、互不越权：

| 声部 | 字体 | 用途 |
|---|---|---|
| Display | YouSheBiaoTiHei | 仅品牌大标题「待办事项」与空状态标题 |
| Sans | Geist | 正文、控件、按钮（添加按钮 uppercase + 0.08em 字距） |
| Mono | JetBrains Mono | 时间码、统计读数、索引、meta 标签（`.mono-label`：0.625rem / 0.08em / uppercase） |

禁令：无系统 display face；mono 只做数据与铭牌，不做正文；display 只做品牌瞬间。

## 4. Color

地 = 暖纸白 `--paper #f5f1e8`；文字 = 墨黑 `--ink #111111`；次级 = 灰褐 `--muted`。**信号橙 `--accent #ff4d00` 是全站唯一强调色**，只在四类语义位置出现：完成勾选框（填充态 + 墨黑对勾）、添加主按钮（橙底墨字）、逾期警示、HI 优先级点。任何新功能不得引入第二强调色，也不得把橙用于纯装饰。分隔全部用发丝线（`--hairline` 墨黑 14% / `--hairline-strong` 28%），不出现粗边框或色块分区。

## 5. Material

纯 CSS 世界，无 raster 资产承诺。质感来自三件事：发丝线分区、`--card #1a1a1a` 比 `--ink` 深一档的面层（hover 行底、表单底）、tabular-nums 的等宽数字网格。图标全部为 1.5px stroke 手绘细线 SVG（icons.tsx），禁 emoji。直角是材质的一部分——圆角会破坏设备感。

## 6. Layout

单列工作台，`max-w-4xl` 居中。垂直韵律五段（FIRST VIEWPORT 契约）：

1. **品牌行**：大标题 + mono 副标（左）｜LiveTimecode + REC 标记（右，底部对齐）
2. **统计面板**：三读数横排（grid-cols-3），上下发丝线夹持，下缘是 RateBar 发丝线进度
3. **筛选栏**：搜索 + 三下拉 + 计数，`flex-wrap` 窄视口自动换行
4. **录入表单**：常驻内联，细节行 `grid sm:2 lg:4` 按需展开
5. **任务列表**：每行 = 时间码索引 + 勾选框 + 标题/meta ｜ 右侧时间戳

响应式：窄视口只做换行与缩落（display 2.75rem→5xl），不堆叠、不抽屉化。

## 7. Motion

三层动效，全部服务于「时间线」类比：

- **入场** `todo-enter` 240ms：新任务从上方 -8px 沉入轨道
- **划出** `todo-exit` 220ms：勾选完成后右移 28px 淡出——签名交互，任务离开时间线
- **读数闪烁** `readout-flash` 420ms：统计变更时数字由橙闪回纸白，像设备指示灯

`prefers-reduced-motion` 下三层全部关闭。无弹簧、无弹跳、无视差。

## 8. Component grammar

- **控件（.field）**：透明底、1px hairline、直角、focus 时边框转橙（0.55）；下拉/输入共用
- **勾选框**：16px 直角方框，hairline-strong 空态 → accent 填充 + ink 对勾（IconCheck 11px）
- **优先级徽记**：mono 大写 HI/MD/LO + 1.5px 色点（橙/纸白 70%/灰褐）——不做成 pill 徽章
- **行**：py-4、hover 底转 `--card/40`、hover 操作按钮 opacity-0→100（含 focus-within）
- **主按钮**：accent 底 + ink 字 + uppercase，disabled opacity-35
- **空状态**：发丝线框、font-display 标题，区分「无任务」与「无匹配」

## 9. Rules for extension

1. 橙的四种语义（完成/主操作/逾期/最高优先级）之外禁用 accent。
2. 新数据读出一律走 mono + tabular-nums + `.mono-label` 铭牌语法。
3. 新动效必须提供 reduced-motion 降级，且时长落在 200–500ms 区间。
4. 保持直角与发丝线；不引入圆角、阴影、渐变。
5. 分类/筛选扩展沿用现有 `--card` 面层 + hairline 组合，不新增底色档位。
