(function () {
  'use strict';
  var WA_NUMBER = '5551991822007';
  var LEAD_ENDPOINT = 'https://formspree.io/f/xqejnbbb';   /* envio de segurança do formulário (Formspree). Deixe '' para desativar. */
  window.dataLayer = window.dataLayer || [];

  /* Mensuração: cliques em links de WhatsApp */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-wa]') : null;
    if (!el) return;
    window.dataLayer.push({ event: 'whatsapp_click', click_origin: el.getAttribute('data-wa'), page_path: location.pathname });
  });

  /* Menu mobile fecha ao tocar em um link */
  document.querySelectorAll('header details a').forEach(function (a) {
    a.addEventListener('click', function () { var d = a.closest('details'); if (d) d.removeAttribute('open'); });
  });

  /* Revelação suave ao rolar (só com JavaScript ativo; o conteúdo existe no HTML de qualquer forma) */
  var itens = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
    }, { threshold: 0.08 });
    itens.forEach(function (el) { obs.observe(el); });
  } else { itens.forEach(function (el) { el.classList.add('visible'); }); }

  /* Demonstração por segmento */
  var dadosEl = document.getElementById('demoData');
  if (dadosEl) {
    var dados = JSON.parse(dadosEl.textContent);
    var ativa = 'niche-tab px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all bg-ink text-cream-light shadow-sm';
    var inativa = 'niche-tab px-5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all bg-cream-card border border-cream-mid text-ink hover:bg-cream-mid';
    document.querySelectorAll('.niche-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var k = btn.getAttribute('data-niche'), d = dados[k]; if (!d) return;
        document.querySelectorAll('.niche-tab').forEach(function (b) {
          var on = b === btn; b.className = on ? ativa : inativa; b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        document.getElementById('demo-bad-title').textContent = d.badTitle;
        document.getElementById('demo-bad-query').textContent = d.badQuery;
        document.getElementById('demo-good-title').textContent = d.goodTitle;
        document.getElementById('demo-good-query').textContent = d.goodQuery;
      });
    });
  }

  /* Formulário de diagnóstico: valida, registra o lead e abre o WhatsApp */
  var form = document.getElementById('contactDiagnosticForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return (document.getElementById(id).value || '').trim(); };
      var nome = v('leadName'), empresa = v('leadCompany'), fone = v('leadPhone'), cidade = v('leadCity'), servico = v('leadService');
      var erro = document.getElementById('formError');
      if (!nome || !empresa || !servico || fone.replace(/\D/g, '').length < 10) {
        erro.textContent = 'Preenche todos os campos, com o WhatsApp completo (DDD + número).';
        erro.classList.remove('hidden'); return;
      }
      erro.classList.add('hidden');

      window.dataLayer.push({ event: 'generate_lead', lead_city: cidade, page_path: location.pathname });
      if (LEAD_ENDPOINT && window.fetch) {
        try {
          fetch(LEAD_ENDPOINT, { method: 'POST', keepalive: true,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ _subject: 'Novo pedido de diagnóstico pelo site da Gentte', nome: nome, empresa: empresa,
              whatsapp: fone, cidade: cidade, produto_servico: servico, pagina: location.pathname }) }).catch(function () {});
        } catch (x) {}
      }

      var msg = 'Olá, Gentte! Solicitei um diagnóstico de presença pelo site:\n\n' +
        '• Nome: ' + nome + '\n• Empresa: ' + empresa + '\n• WhatsApp: ' + fone + '\n• Cidade: ' + cidade +
        '\n• Produto/serviço principal: ' + servico + '\n\nGostaria de avaliar como a minha empresa está aparecendo no Google e nas IAs!';
      var a = document.createElement('a');
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
    });
  }
})();
