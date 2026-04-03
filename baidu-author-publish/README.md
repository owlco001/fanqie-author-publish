# baidu-author-publish

一个面向百度作家平台的半自动发布技能包，目标运行环境为 Linux + OpenClaw。

当前版本是与 `fanqie-author-publish` 对齐的精简骨架，适合继续做真实页面联调与页面定位校准。

## 目标

- 读取章节内容
- 打开百度作家平台后台
- 自动填入章节标题和正文
- 优先保存草稿
- 人工确认后再执行最终发布

## 目录结构

```text
baidu-author-publish/
├─ README.md
├─ SKILL.md
├─ manifest.json
├─ browser-workflow.md
├─ execution-policy.md
├─ selectors.md
├─ input.schema.json
├─ output.schema.json
├─ chapter.template.json
├─ chapter.example.json
├─ chapters.batch.template.json
├─ chapters.batch.example.json
├─ publish-log.template.md
├─ test-cases.md
├─ real-site-calibration-checklist.md
├─ setup-linux.sh
├─ validate-input.sh
├─ logs/
└─ screenshots/
```

## 说明

- 输入输出结构与 `fanqie-author-publish` 保持一致，便于多平台复用。
- 当前仍需根据百度作家平台真实页面补充按钮文案、编辑器行为和发布校验规则。
- 建议先完成真实页面联调，再启用正式发布流程。

## 登录态保持说明

不建议提取、导出或复用站点 Cookie。

推荐做法是：
- 在 Linux 主机上为百度作家平台使用固定浏览器 profile
- 用这个 profile 手动登录一次
- 后续始终复用同一个 profile 运行 OpenClaw 浏览器流程

推荐目录：

```text
/home/author/browser-profiles/baidu-author/
```

示例启动方式：

```bash
chromium --user-data-dir=/home/author/browser-profiles/baidu-author
```

或者：

```bash
google-chrome --user-data-dir=/home/author/browser-profiles/baidu-author
```
