# fanqie-publisher

一个可复用的番茄章节发布 skill，用于把临时 prompt 转成结构化任务模板。

## 包含内容

- `SKILL.md`：技能定义与执行规则
- `templates/task-template.txt`：参数化任务模板
- `scripts/prepare-task.js`：任务单渲染脚本

## 用法示例

```bash
BOOK_ID=7624670035260230680 \
TITLE='第一章 穿越天津卫' \
BODY_PATH='/tmp/ch1-clean.txt' \
AUTO_PUBLISH=false \
MIN_WORDS=20 \
node skills/fanqie-publisher/scripts/prepare-task.js /tmp/fanqie-task.txt
```

生成后可把 `/tmp/fanqie-task.txt` 交给浏览器代理或 ACP 执行。
