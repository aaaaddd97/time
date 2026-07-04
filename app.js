// 最簡互動邏輯：按鈕切換區塊、更新 aria-pressed、支援 URL hash
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.panel');

  function showPanel(targetId, pushHash = true) {
    panels.forEach(p => {
      if (p.id === targetId) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    });
    buttons.forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.target === targetId ? 'true' : 'false');
    });
    if (pushHash) {
      history.replaceState(null, '', '#' + targetId);
    }
    const el = document.getElementById(targetId);
    if (el) el.focus();
  }

  // 按鈕綁定
  buttons.forEach(btn => {
    btn.addEventListener('click', () => showPanel(btn.dataset.target));
    // Enter/Space 已由 button 預設處理
  });

  // 讀取 URL hash（允許直接連到 #departments）
  const hashTarget = location.hash.replace('#', '');
  const initial = (hashTarget && document.getElementById(hashTarget)) ? hashTarget : 'about';
  showPanel(initial, false);
});