import fs from 'node:fs/promises';

const BOOK_ID = '7624670035260230680';
const TITLE = '第一章 穿越天津卫';
const BODY_PATH = '/tmp/ch1-clean.txt';

// 生产建议默认 false，确认稳定后再改 true
const AUTO_PUBLISH = false;

// 测试时可设 20；正式发章节建议按平台要求调高
const MIN_WORDS = 20;

const NEW_DRAFT_URL = `https://fanqienovel.com/main/writer/${BOOK_ID}/publish/?enter_from=newdraft`;
const NEW_CHAPTER_URL = `https://fanqienovel.com/main/writer/${BOOK_ID}/publish/?enter_from=newchapter`;

const titleLocator = page.locator('input.serial-editor-input-hint-area[placeholder="请输入标题"]');
const editorLocator = page.locator('.serial-editor-container .ProseMirror[contenteditable="true"]').first();
const saveDraftBtn = page.locator('button.auto-editor-save-btn');
const headerLocator = page.locator('.publish-header');
const statusLocator = page.locator('.publish-maintain-info-status');
const bodyLocator = page.locator('body');
const toastLocator = page.locator('.semi-toast, .semi-notification, .toast, [class*="toast"]');

function nowTag() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    '-',
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join('');
}

async function shot(name) {
  const path = `/tmp/${name}-${nowTag()}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log('screenshot =', path);
  return path;
}

function extractWordCount(text) {
  const m = text.match(/正文字数\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

async function getHeaderStatus() {
  const headerText = await headerLocator.innerText().catch(() => '');
  const statusText = await statusLocator.innerText().catch(() => '');
  return { headerText, statusText };
}

async function openEditorPage() {
  for (const url of [NEW_DRAFT_URL, NEW_CHAPTER_URL]) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1800);

    const titleVisible = await titleLocator.first().isVisible().catch(() => false);
    const editorVisible = await editorLocator.first().isVisible().catch(() => false);

    console.log('try url =', url);
    console.log({
      titleVisible,
      editorVisible,
      currentUrl: page.url()
    });

    if (titleVisible && editorVisible) {
      return url;
    }
  }

  await shot('fanqie-open-editor-failed');
  throw new Error('未能进入番茄章节编辑器页面');
}

async function verifyEditorReady() {
  const titleVisible = await titleLocator.first().isVisible().catch(() => false);
  const editorVisible = await editorLocator.first().isVisible().catch(() => false);

  if (!titleVisible || !editorVisible) {
    await shot('fanqie-editor-missing');
    throw new Error('编辑器关键元素不存在或不可见');
  }
}

async function fillReactInput(locator, value) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.click();

  await locator.evaluate((el, nextValue) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set;

    if (!setter) throw new Error('HTMLInputElement.value setter not found');

    el.focus();
    setter.call(el, nextValue);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);

  await page.waitForTimeout(200);

  // 逼 React / 表单状态真正更新
  await locator.press('End').catch(() => {});
  await locator.press(' ').catch(() => {});
  await locator.press('Backspace').catch(() => {});
  await locator.blur().catch(() => {});
}

async function verifyTitle(expected) {
  const actual = await titleLocator.inputValue().catch(() => '');
  console.log('titleValue =', actual);

  if (actual !== expected) {
    await shot('fanqie-title-failed');
    throw new Error(`标题未成功写入，当前值: ${actual}`);
  }
}

async function fillProseMirror(locator, text) {
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  await locator.click();
  await page.waitForTimeout(300);

  await page.keyboard.press('Control+A').catch(() => {});
  await page.keyboard.press('Backspace').catch(() => {});
  await page.waitForTimeout(300);

  // 优先尝试粘贴
  await page.evaluate(async value => {
    await navigator.clipboard.writeText(value);
  }, text);

  await page.keyboard.press('Control+V').catch(() => {});
  await page.waitForTimeout(1500);

  const editorText = await locator.evaluate(el => (el.innerText || '').trim()).catch(() => '');

  // 粘贴失败时退回逐段输入
  if (!editorText || editorText.length < 20) {
    console.log('paste fallback -> type mode');

    await locator.click();
    await page.waitForTimeout(200);

    const lines = text.replace(/\r\n/g, '\n').split('\n');
    for (const line of lines) {
      if (line === '') {
        await page.keyboard.press('Enter');
      } else {
        await page.keyboard.type(line, { delay: 10 });
        await page.keyboard.press('Enter');
      }
    }

    await page.waitForTimeout(1200);
  }
}

async function waitForWordCount(min = 20, timeout = 15000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const headerText = await headerLocator.innerText().catch(() => '');
    const count = extractWordCount(headerText);

    console.log('headerText =', headerText);
    console.log('wordCount =', count);

    if (count !== null && count >= min) {
      return count;
    }

    await page.waitForTimeout(500);
  }

  await shot('fanqie-wordcount-timeout');
  throw new Error('等待正文字数同步超时');
}

async function verifyEditorContent() {
  const editorText = await editorLocator.evaluate(el => (el.innerText || '').trim()).catch(() => '');
  console.log('editorText preview =', editorText.slice(0, 200));

  if (!editorText || editorText.length < 20) {
    await shot('fanqie-editor-empty');
    throw new Error('正文疑似未成功写入，编辑器内容过短');
  }

  return editorText;
}

async function waitForSaved(timeout = 15000) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const { headerText, statusText } = await getHeaderStatus();
    const combined = `${headerText}\n${statusText}`;

    console.log('save status =', combined);

    if (/已保存|保存成功|草稿已保存/.test(combined)) {
      return { headerText, statusText };
    }

    const toastText = await toastLocator.first().innerText().catch(() => '');
    if (toastText) {
      console.log('toast =', toastText);
    }

    await page.waitForTimeout(500);
  }

  await shot('fanqie-save-timeout');
  throw new Error('等待保存成功状态超时');
}

async function saveDraftAndVerify() {
  await bodyLocator.click().catch(() => {});
  await page.waitForTimeout(400);

  await saveDraftBtn.waitFor({ state: 'visible', timeout: 10000 });

  const disabled = await saveDraftBtn.isDisabled().catch(() => false);
  console.log('saveDraft disabled =', disabled);

  if (disabled) {
    await shot('fanqie-save-disabled');
    throw new Error('存草稿按钮当前不可用');
  }

  await saveDraftBtn.click();
  return await waitForSaved();
}

async function findPublishEntry() {
  const candidates = [
    page.getByRole('button', { name: /下一步|发布/i }),
    page.locator('button:has-text("下一步"), button:has-text("发布")'),
    page.locator('a:has-text("下一步"), a:has-text("发布")')
  ];

  for (const locator of candidates) {
    const count = await locator.count().catch(() => 0);
    if (count > 0) {
      const first = locator.first();
      const visible = await first.isVisible().catch(() => false);
      if (visible) return first;
    }
  }

  return null;
}

async function publishIfEnabled() {
  if (!AUTO_PUBLISH) {
    console.log('AUTO_PUBLISH = false，跳过自动发布');
    return;
  }

  const publishEntry = await findPublishEntry();
  if (!publishEntry) {
    await shot('fanqie-publish-entry-missing');
    throw new Error('未找到“下一步”或“发布”入口');
  }

  const disabled = await publishEntry.isDisabled?.().catch(() => false);
  console.log('publishEntry disabled =', disabled);

  if (disabled) {
    await shot('fanqie-publish-entry-disabled');
    throw new Error('发布入口当前不可用');
  }

  await publishEntry.click();
  await page.waitForTimeout(2000);

  const confirmBtn = page.getByRole('button', { name: /确认发布|发布|确定/i }).first();
  const confirmVisible = await confirmBtn.isVisible().catch(() => false);

  if (confirmVisible) {
    await confirmBtn.click();
    await page.waitForTimeout(3000);
  }

  const pageText = await page.locator('body').innerText().catch(() => '');
  console.log('publish page text preview =', pageText.slice(0, 300));

  await shot('fanqie-after-publish');
}

async function main() {
  const bodyText = await fs.readFile(BODY_PATH, 'utf8');

  const openedUrl = await openEditorPage();
  console.log('opened editor via =', openedUrl);

  await verifyEditorReady();

  await fillReactInput(titleLocator, TITLE);
  await verifyTitle(TITLE);

  await fillProseMirror(editorLocator, bodyText);
  await verifyEditorContent();

  const wordCount = await waitForWordCount(MIN_WORDS);
  console.log('final wordCount =', wordCount);

  const saveResult = await saveDraftAndVerify();
  console.log('saveResult =', saveResult);

  await publishIfEnabled();

  console.log('流程执行完成。');
}

await main();
