/* 互動 JavaScript：script.js
   提供：導覽切換、FAQ 展開、頁尾年份自動更新、表單暫時的前端處理提示 */

/* 小螢幕導航切換 */
document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      // 以簡單方式顯示/隱藏選單（可改為動畫）
      nav.style.display = expanded ? '' : 'flex';
    });
  }

  /* FAQ 手風琴 */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      if(!answer) return;
      const open = answer.style.display === 'block';
      // 關閉所有其他答案（如需多開可移除這段）
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