/* script.js
   互動腳本：
   - 小螢幕導覽切換
   - FAQ 手風琴
   - 頁尾年份自動更新
   - 聯絡表單前端示範處理
   - 分頁（tab-like）行為：點選選單只顯示該 section，並更新 URL hash

   註解已標示主要行為，若需更改預設顯示分頁請修改 defaultSectionId
*/

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = document.querySelectorAll('main section');
  const defaultSectionId = 'home'; // 預設顯示的分頁 ID（如需改請修改）

  // 顯示指定 section，其他加上 .hidden；updateHistory 決定是否改變 URL hash
  function showSection(sectionId, updateHistory = true) {
    let found = false;
    sections.forEach(sec => {
      if (sec.id === sectionId) {
        sec.classList.remove('hidden');
        found = true;
      } else {
        sec.classList.add('hidden');
      }
    });

    // 更新選單樣式 (aria/current)
    navLinks.forEach(a => {
      const target = (a.getAttribute('href') || '').replace('#', '');
      if (target === sectionId) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      }
    });

    // 如果找不到目標，就顯示預設（避免空白頁）
    if (!found) {
      showSection(defaultSectionId, updateHistory);
      return;
    }

    // 更新 URL（不會產生重新載入）
    if (updateHistory) {
      try {
        history.pushState(null, '', '#' + sectionId);
      } catch (e) {
        location.hash = sectionId; // fallback
      }
    }
  }

  // 綁定選單事件
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // 如果 href 沒有 hash（或是外部連結），則讓它正常跳轉
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;

      e.preventDefault(); // 攔截原本的錨點滾動
      const targetId = href.replace('#', '') || defaultSectionId;
      showSection(targetId, true);
      // 可選：在切換時滾動至頂端（若想啟用，取消下一行註解）
      // document.getElementById(targetId).scrollIntoView({behavior: 'smooth', block:'start'});
    });
  });

  // 支援直接以 hash 開啟某分頁（或瀏覽器前進/後退）
  function handleHash() {
    const hash = (location.hash || '').replace('#', '');
    if (hash) showSection(hash, false);
    else showSection(defaultSectionId, false);
  }

  // 初次載入
  handleHash();

  // 當 hash 改變（使用者按前進/後退）時也更新分頁顯示
  window.addEventListener('hashchange', handleHash);

  /* 小螢幕導航切換（保留原先行為） */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? '' : 'flex';
    });
  }

  /* FAQ 手風琴（保留簡單行為） */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      if(!answer) return;
      const open = answer.style.display === 'block';
      // 關閉其他答案（如需多開可移除這段）
      document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
      answer.style.display = open ? 'none' : 'block';
    });
  });

  /* 頁尾年份自動更新 */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* 聯絡表單：暫時阻止送出（提示後端整合） */
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // 目前僅作示範提示。若要真的送出，請設定 form.action 與後端 API 或第三方表單服務。
      alert('表單已擷取（僅前端示範）。請在後端設定處理程式，或改用第三方服務（如 Formspree、Netlify Forms 等）。');
    });
  }
});
