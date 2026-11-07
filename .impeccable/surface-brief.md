# Surface brief — todo-studio 单页应用（src/App.tsx 入口）

## Scope / mode
Operate 模式：用户在任务中，工具消失于任务之后。单页，桌面优先，移动可用。

## Audience / job / proof / constraints
作品集访客 + 本人日常使用。任务：录任务、筛任务、勾任务。证明：真实可用的交互与统计。约束：技术栈 React+TS+Vite+Zustand+Tailwind+date-fns；视觉沿用主站墨黑胶片世界。

## Direction contract

THESIS: 剪辑软件的时间线工作台 —— 任务即剪辑台上的素材条目，统计面板即监视器读数。拒绝的类别默认：彩色便利贴卡片墙 + 居中 hero。

OWN-WORLD: 墨黑 #111111 底、暖纸白文字、信号橙 #ff4d00 仅用于主行动与当前状态。发丝线（rgba 纸白 12%）分区，无卡片圆角堆叠。Geist 管控件，JetBrains Mono 管时间码/索引/统计数字，YouSheBiaoTiHei 只出现在页面大标题。优先级 = 素材标签式小徽记（mono 大写 + 左侧 1px 颜色条…禁：这是左色条禁令的例外——仅 1px、非彩色大条），用 mono 缩写 HI/MD/LO + 颜色点替代。

STORY: 访客打开页面，先看到胶片工作台的暗色界面与顶部监视器读数（总数/已完成/完成率），立刻明白这是一个真实工具；录入一条任务，看到它以时间码编号落入列表；筛选与搜索即时联动；勾选完成时条目划出+淡出。

FIRST VIEWPORT: 纵向三段。顶部：品牌行（TODO STUDIO 大标题 YouShe + 右侧实时时间码 mono）之下是统计条 —— 三个 mono 读数（TASKS/COMPLETED/RATE）横排，发丝线下收边。中部：筛选栏（搜索输入 + 分类下拉 + 状态下拉 + 优先级下拉）单行。主体：任务列表，每行 = 时间码索引 + 完成勾选框 + 标题 + 分类·截止日·优先级 meta（mono）+ 操作。新增入口为列表上方常驻内联表单（非弹窗）。主行动（添加按钮）信号橙实心。

FORM: 列表即时间线的横排条目，来自「剪辑台素材列表」结构，排位 1/7（七个候选：素材列表、时间线轨道、监视器四分屏、场记板、胶片盒标签墙、剪辑快捷键图谱、调色轮盘；素材列表最贴合任务密度与扫读）。

SEED REFERENCE: 无 concept-seed 掷点（brief 钉死了视觉世界与构图，属既定世界的整面扩展，代码主导路径）。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Signature interaction
勾选完成 → 条目 200ms 纸白→灰淡出 + 删除线扫入 + 向右划出收起；新增 → 条目自上而下 8px 位移淡入。时间码每秒跳格。

## Unresolved decisions
- 编辑任务采用行内展开（首版实现），后续可升级为抽屉。
