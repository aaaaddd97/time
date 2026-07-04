// 支援兩種導覽互動：按鈕切換（.nav-btn + data-target）與錨點連結（.main-nav a[href^="#"]）。
// 當兩者都存在時，會統一使用 showPanel 以管理 panels 的顯示、aria-pressed 與 focus/scroll 行為。
document.addEventListener('DOMContentLoaded', function () {
  const buttons = Array.from(document.querySelectorAll('.nav-btn'));
  const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  function showPanel(targetId, pushHash = true, doScroll = true) {
    if (!targetId) return;
    panels.forEach(p => {
      if (p.id === targetId) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    });

    // 更新按鈕的 aria-pressed
    buttons.forEach(b => {
      try {
        b.setAttribute('aria-pressed', b.dataset.target === targetId ? 'true' : 'false');
      } catch (e) {}
    });

    // 更新連結的 active 樣式（加入 aria-current 或 data-active）
    links.forEach(a => {
      try {
        const id = a.getAttribute('href').slice(1);
        if (id === targetId) {
          a.setAttribute('aria-current', 'page');
          a.classList.add('active');
        } else {
          a.removeAttribute('aria-current');
          a.classList.remove('active');
        }
      } catch (e) {}
    });

    if (pushHash) {
      history.replaceState(null, '', '#' + targetId);
    }

    const el = document.getElementById(targetId);
    if (el) {
      if (doScroll) el.scrollIntoView({ behavior: 'smooth' });
      el.focus({ preventScroll: true });
    }
  }

  // 綁定按鈕（如果有）
  if (buttons.length) {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => showPanel(btn.dataset.target));
    });
  }

  // 綁定錨點連結（如果有）
  if (links.length) {
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const id = this.getAttribute('href').slice(1);
        const hasPanel = document.getElementById(id);
        if (hasPanel) {
          e.preventDefault();
          showPanel(id);
        }
        // 若沒有對應 panel，保留預設的錨點行為
      });
    });
  }

  // 初始顯示：優先使用 URL hash，如果沒有則嘗試顯示第一個 panel 或 about
  const hashTarget = location.hash.replace('#', '');
  const initial = (hashTarget && document.getElementById(hashTarget)) ? hashTarget : (panels.length ? panels[0].id : '');
  // 第一次不要 pushHash（已經在 URL 中或不需要）
  if (initial) showPanel(initial, false, true);
});
