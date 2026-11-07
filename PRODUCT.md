# Todo Studio — 产品说明

## 产品
Todo Studio：一个进阶版待办事项管理工具，作为个人作品集项目。单页应用，本地优先（LocalStorage 持久化），无后端。

## 受众与场景
作品集访客（招聘方、同行开发者）在桌面浏览器打开演示，30 秒内理解这是一个真实可用的工具而非截图；本人日常在夜间环境实际使用它管理任务。

## 核心任务
1. 快速录入带分类、优先级、截止日期的任务
2. 通过关键词 / 分类 / 状态 / 优先级筛选与搜索
3. 勾选完成、删除、编辑任务
4. 顶部统计面板反映全局进度

## 功能清单
- 数据模型：id, title, description, category, priority (低/中/高), dueDate, completed, createdAt
- Zustand store：添加 / 删除 / 更新 / 切换完成 / 多条件筛选（分类、优先级、状态）
- LocalStorage 持久化（zustand/persist）
- 日期处理一律 date-fns
- 搜索：标题 + 描述模糊匹配
- 列表排序：优先级、日期视觉降序

## 技术约束
- React + TypeScript（strict）+ Vite + Zustand + Tailwind CSS + date-fns
- 不使用 Redux / Context
- 与主站（D:\个人作品网站）视觉一致：暗色胶片工作台世界

## 品牌承诺
视觉世界沿用主站：墨黑 #111111 底、暖纸白 #f5f1e8、信号橙 #ff4d00 唯一强调色、发丝线分隔、Geist（UI）/ JetBrains Mono（数据·时间码）/ YouSheBiaoTiHei（大标题）三声部。克制、精确、无装饰性渐变。

## 成功标准
1. 能添加带分类和截止日期的任务
2. Zustand 正确联动筛选与搜索
3. 刷新后数据仍在；UI 暗黑质感 + 流畅过渡动画
