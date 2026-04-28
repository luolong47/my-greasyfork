// ==UserScript==
// @name         Linux.do 增强 - 帖子自动于新标签页打开
// @name:en      Linux.do Enhanced - Open Posts in New Tab
// @namespace    https://greasyfork.org/
// @version      2.1.0
// @description  使 Linux.do 的帖子链接自动在新标签页中打开，并直接跳转外部链接（跳过确认窗口），让浏览体验更流畅。
// @description:en Automatically open Linux.do post links in a new tab and direct jump to external links (skip confirmation window) for a seamless browsing experience.
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
 
    // 检查是否为内部帖子链接
    function isInternalPost(anchor) {
        const href = anchor.getAttribute('href');
        return href && href.startsWith('/t/');
    }

    // 检查是否为外部链接
    function isExternalLink(url) {
        return url.origin !== window.location.origin && 
               (url.protocol === 'http:' || url.protocol === 'https:');
    }
 
    function handleClick(e) {
        // 不是纯粹的左键单击 → 让浏览器自行处理
        if (!isPlainLeftClick(e)) return;
 
        const anchor = e.target.closest('a');
        if (!anchor) return;
 
        const href = anchor.getAttribute('href');
        if (!href) return;

        try {
            const url = new URL(anchor.href, window.location.origin);
            let shouldIntercept = false;

            // 逻辑 A: 内部帖子链接
            if (isInternalPost(anchor)) {
                shouldIntercept = true;
            } 
            // 逻辑 B: 外部链接直接开启
            else if (isExternalLink(url)) {
                shouldIntercept = true;
            }

            if (shouldIntercept) {
                // 阻止默认跳转、阻止冒泡、阻止 Discourse 确认弹窗
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
 
                // 统一在新标签页打开
                window.open(url.href, '_blank', 'noopener');
            }
        } catch (err) {
            // 解析 URL 失败则不干预
        }
    }
 
    // 在捕获阶段尽早拦截
    document.addEventListener('click', handleClick, true);
})();