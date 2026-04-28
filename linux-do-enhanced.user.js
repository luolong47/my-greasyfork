// ==UserScript==
// @name         Linux.do 增强 - 帖子自动于新标签页打开
// @name:en      Linux.do Enhanced - Open Posts in New Tab
// @namespace    https://greasyfork.org/
// @version      2.0.0
// @description  使 Linux.do 的帖子链接自动在新标签页中打开，让浏览体验更流畅，不再被页面刷新打断。
// @description:en Automatically open Linux.do post links in a new tab for a more seamless browsing experience without being interrupted by page refreshes.
// @author       BIGFA & Gemini (完善版)
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://raw.githubusercontent.com/luolong47/my-greasyfork/master/linux-do-enhanced.user.js
// @updateURL https://raw.githubusercontent.com/luolong47/my-greasyfork/master/linux-do-enhanced.user.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 只处理纯粹的左键单击 (button === 0)，并且没有按下任何辅助键 (Ctrl, Meta, Shift, Alt)
    function isPlainLeftClick(event) {
        return event.button === 0 &&
               !event.ctrlKey &&
               !event.metaKey &&
               !event.shiftKey &&
               !event.altKey;
    }
 
    // 检查元素是否为帖子链接 (href 以 /t/ 开头，避免误伤 /u/ 等)
    function isTopicLink(anchor) {
        const href = anchor.getAttribute('href');
        return href && href.startsWith('/t/');
    }
 
    function handleClick(e) {
        // 不是纯粹的左键单击 → 不管，让浏览器自行处理 (例如 Ctrl+点击 浏览器会新标签打开)
        if (!isPlainLeftClick(e)) return;
 
        // 找到最近的 a 标签
        const anchor = e.target.closest('a');
        if (!anchor) return;
 
        // 确认是帖子链接
        if (!isTopicLink(anchor)) return;
 
        // 阻止默认的 Discourse 客户端路由跳转
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
 
        // 用完整 URL 打开新标签页
        const fullUrl = new URL(anchor.href, window.location.origin).href;
        window.open(fullUrl, '_blank', 'noopener');
    }
 
    // 在捕获阶段尽早拦截，确保处理动态添加的元素
    document.addEventListener('click', handleClick, true);
})();