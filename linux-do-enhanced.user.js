// ==UserScript==
// @name         Linux.do 增强 - 帖子自动于新标签页打开
// @name:en      Linux.do Enhanced - Open Posts in New Tab
// @namespace    https://greasyfork.org/
// @version      1.6.0
// @description  使 Linux.do 的帖子链接自动在新标签页中打开，让浏览体验更流畅，不再被页面刷新打断。
// @description:en Automatically open Linux.do post links in a new tab for a more seamless browsing experience without being interrupted by page refreshes.
// @author       BIGFA & Gemini
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/568592/linux-do-enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/568592/linux-do-enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = '🕵️‍♂️ [Linux.do 调试]';
    // console.log(`${LOG_PREFIX} 脚本已加载，准备就绪。`);

    // 核心拦截处理逻辑
    function handleEvent(e) {
        // 只处理鼠标左键(0)和中键(1)
        if (e.button !== 0 && e.button !== 1) return;

        // 向上寻找 <a> 标签
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href) return;

        // console.log(`${LOG_PREFIX} --- 捕获到 [${e.type}] 事件 ---`);
        // console.log(`${LOG_PREFIX} 元素 class:`, anchor.className);
        // console.log(`${LOG_PREFIX} 解析到的 href:`, href);

        // 核心判断：是否为帖子列表链接
        const isTopicLink = href.startsWith('/t/') &&
                            (anchor.classList.contains('title') ||
                             anchor.classList.contains('raw-topic-link') ||
                             anchor.closest('.topic-list-item') ||
                             anchor.closest('.latest-topic-list-item'));

        if (isTopicLink) {
            // console.log(`${LOG_PREFIX} 🎯 [命中判断] 确认是帖子链接！`);

            // 彻底阻止 Discourse 的单页路由跳转
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // console.log(`${LOG_PREFIX} 🛑 已强行拦截 Discourse 默认跳转。`);

            // 只有在 click 事件时才打开新窗口
            if (e.type === 'click') {
                const fullUrl = new URL(anchor.href, window.location.origin).href;
                // console.log(`${LOG_PREFIX} 🚀 正在尝试打开新标签页:`, fullUrl);
                window.open(fullUrl, '_blank', 'noopener');
            } else {
                 // console.log(`${LOG_PREFIX} ⏳ 当前是 mousedown 事件，已拦截但不触发弹窗（等待 click 事件）。`);
            }
        } else {
             // console.log(`${LOG_PREFIX} ⏩ [未命中] 可能是普通链接或按钮，已放行。`);
        }
    }

    // 绑定全局事件拦截器 (使用 capture: true 在捕获阶段最先拦截)
    function init() {
        // console.log(`${LOG_PREFIX} 开始绑定全局鼠标拦截器 (mousedown + click)...`);
        document.addEventListener('click', handleEvent, true);
        document.addEventListener('mousedown', handleEvent, true);
        // console.log(`${LOG_PREFIX} 拦截器绑定完成！`);
    }

    // 尽早注入脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();