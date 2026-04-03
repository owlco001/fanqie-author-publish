# 执行策略

这个文件定义 `fanqie-author-publish` 在 OpenClaw 和 Linux 环境中的执行约束，目标是让浏览器自动化尽可能稳定、可恢复、可审计。

## 运行环境

- 操作系统：Linux
- 文件编码：UTF-8
- 换行：LF
- 浏览器：使用独立作者账号 profile
- 技能目录：建议放在固定可读写路径下

推荐目录结构：

```text
/home/author/openclaw-skills/fanqie-author-publish/
├─ README.md
├─ SKILL.md
├─ chapter.template.json
├─ chapter.example.json
├─ chapters.batch.template.json
├─ chapters.batch.example.json
├─ browser-workflow.md
├─ publish-log.template.md
├─ execution-policy.md
├─ logs/
└─ screenshots/
```

## 输入策略

- 单章输入使用 `chapter.template.json`
- 批量输入使用 `chapters.batch.template.json`
- 如果存在 `source_file`，优先将其视为来源记录，而不是运行时必须读取的唯一路径
- 缺少 `book_name`、`chapter_title`、`chapter_body` 时，不允许继续执行

## 状态策略

流程状态统一为：
- `pending`
- `backend_opened`
- `book_selected`
- `editor_opened`
- `draft_loaded`
- `draft_saved`
- `awaiting_confirmation`
- `published_verified`
- `failed_needs_review`

任何阶段退出时，都必须输出当前状态。

## 超时策略

建议默认超时：
- 打开后台首页：30 秒
- 页面跳转：20 秒
- 章节编辑器加载：30 秒
- 保存草稿结果等待：20 秒
- 发布结果等待：30 秒

如果超时：
- 不要盲目重复点击
- 先检查页面是否已发生有效变化
- 若状态不明，截图并停止

## 重试策略

允许重试的动作：
- 打开页面
- 页面刷新
- 定位非破坏性入口

不允许自动重试的动作：
- 保存草稿按钮重复点击超过 1 次
- 发布按钮重复点击
- 弹窗确认重复点击

推荐规则：
- 非破坏性动作最多重试 2 次
- 破坏性动作默认只执行 1 次

## 发布策略

- 任何发布前必须先保存草稿
- 只有在当前会话中得到明确确认后，才允许点击最终发布
- 如果发布后结果不明确，禁止再次点击发布，先去章节列表核对状态

## 批量策略

批量处理建议默认按顺序执行。

推荐规则：
- 一次批量最多处理 3 到 5 章
- 当前一章失败时，默认停止后续章节
- 如需跳过失败项继续执行，必须由用户明确要求
- 默认不允许同标题重复写入，遇到重复标题应停止并报告

## 页面验证策略

每个关键步骤后都必须做验证。

优先级从高到低：
1. 明确成功提示文案
2. 明确状态标签变化
3. 章节列表中可见状态变化
4. URL 或页面标题变化
5. 截图人工可确认

如果前 4 项都无法确认，不要假定动作成功。

## 停止策略

出现以下情况时必须立即停止：
- 登录失效
- 验证码
- 风控提示
- 账号不匹配
- 页面结构明显变化
- 编辑器无法写入正文
- 保存或发布结果无法确认

## 日志策略

每次运行后，建议都写一份日志到 `logs/` 目录。

日志至少包含：
- 时间
- 作品名
- 章节标题
- 动作
- 当前状态
- 结果说明
- 警告信息
- 截图路径
- 是否需要人工处理

推荐命名：

```text
logs/2026-04-03_第12章_夜雨将至.md
```

## 截图策略

截图建议统一放到 `screenshots/` 目录。

建议截图节点：
- 后台首页成功打开
- 目标作品页面成功打开
- 编辑器已填入内容
- 草稿保存完成
- 发布成功或失败

推荐命名：

```text
screenshots/2026-04-03_editor-filled.png
screenshots/2026-04-03_draft-saved.png
screenshots/2026-04-03_publish-result.png
```

## 人工确认策略

以下动作必须人工确认后才能继续：
- 最终发布
- 遇到重复标题但用户仍想继续
- 遇到结构变化但用户想尝试手动指定路径

建议确认话术：
- `确认发布这章`
- `继续发布`
- `跳过这一章继续下一章`

## 最小输出约定

每次运行至少输出：
- `state`
- `book_name`
- `chapter_title`
- `action`
- `result`
- `warning`
- `log_path`
- `screenshot_paths`

示例：

```text
state: draft_saved
book_name: 夜行者日志
chapter_title: 第12章 夜雨将至
action: prepare_draft
result: 已成功保存草稿。
warning: 无。
log_path: logs/2026-04-03_第12章_夜雨将至.md
screenshot_paths:
  - screenshots/2026-04-03_editor-filled.png
  - screenshots/2026-04-03_draft-saved.png
```
