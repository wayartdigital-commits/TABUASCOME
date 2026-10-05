// Links de email com plano B.
// Os links <a data-mail> abrem a app de email com assunto e texto já preenchidos.
// Se nada abrir (ex.: computador sem app de email configurada), mostra uma janela
// com "Abrir no Gmail", "Abrir no Outlook" e "Copiar endereço".
(() => {
  "use strict";

  const LABELS = {
    pt: { title: "O seu email não abriu?", gmail: "Abrir no Gmail", outlook: "Abrir no Outlook", copy: "Copiar endereço", copied: "Endereço copiado!", close: "Fechar", hint: "Envie o seu pedido para" },
    en: { title: "Your email didn't open?", gmail: "Open in Gmail", outlook: "Open in Outlook", copy: "Copy address", copied: "Address copied!", close: "Close", hint: "Send your request to" },
    fr: { title: "Votre messagerie ne s'est pas ouverte ?", gmail: "Ouvrir dans Gmail", outlook: "Ouvrir dans Outlook", copy: "Copier l'adresse", copied: "Adresse copiée !", close: "Fermer", hint: "Envoyez votre demande à" },
    es: { title: "¿No se abrió su correo?", gmail: "Abrir en Gmail", outlook: "Abrir en Outlook", copy: "Copiar dirección", copied: "¡Dirección copiada!", close: "Cerrar", hint: "Envíe su solicitud a" },
  };
  const t = () => LABELS[(document.documentElement.lang || "pt").slice(0, 2)] || LABELS.pt;

  const parseMailto = (href) => {
    const [addr, query = ""] = href.replace(/^mailto:/i, "").split("?");
    const params = new URLSearchParams(query.replace(/\+/g, "%2B"));
    return { to: decodeURIComponent(addr), subject: params.get("subject") || "", body: params.get("body") || "" };
  };

  const css = `
    .mail-fallback{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(12,11,10,.72)}
    .mail-fallback.is-open{display:flex}
    .mail-fallback__card{width:100%;max-width:380px;padding:28px 24px 22px;border-radius:14px;background:#151311;border:1px solid rgba(217,184,120,.35);text-align:center;color:#f4efe4;font-family:inherit;box-shadow:0 24px 60px rgba(0,0,0,.5)}
    .mail-fallback__title{margin:0 0 6px;font-size:18px;color:#d9b878}
    .mail-fallback__hint{margin:0 0 18px;font-size:14px;color:rgba(244,239,228,.75);line-height:1.5;word-break:break-all}
    .mail-fallback__hint strong{color:#f4efe4;font-weight:500}
    .mail-fallback__btn{display:block;width:100%;margin:0 0 10px;padding:12px 14px;border-radius:6px;border:1px solid #d9b878;background:transparent;color:#f4efe4;font:inherit;font-size:13px;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;cursor:pointer}
    .mail-fallback__btn--main{background:#d9b878;color:#0c0b0a}
    .mail-fallback__close{margin-top:4px;background:none;border:0;color:rgba(244,239,228,.6);font:inherit;font-size:13px;cursor:pointer;text-decoration:underline}
  `;

  let modal, current;
  const build = () => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    modal = document.createElement("div");
    modal.className = "mail-fallback";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="mail-fallback__card">
        <h3 class="mail-fallback__title"></h3>
        <p class="mail-fallback__hint"></p>
        <a class="mail-fallback__btn mail-fallback__btn--main" data-act="gmail" target="_blank" rel="noopener"></a>
        <a class="mail-fallback__btn" data-act="outlook" target="_blank" rel="noopener"></a>
        <button type="button" class="mail-fallback__btn" data-act="copy"></button>
        <button type="button" class="mail-fallback__close" data-act="close"></button>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) return close();
      const act = e.target.closest("[data-act]");
      if (!act) return;
      if (act.dataset.act === "close") close();
      if (act.dataset.act === "copy") {
        const done = () => { act.textContent = t().copied; };
        if (navigator.clipboard) navigator.clipboard.writeText(current.to).then(done, done);
        else done();
      }
      if (act.dataset.act === "gmail" || act.dataset.act === "outlook") setTimeout(close, 300);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  };

  const open = (mail) => {
    if (!modal) build();
    current = mail;
    const L = t();
    const q = (s) => modal.querySelector(s);
    q(".mail-fallback__title").textContent = L.title;
    q(".mail-fallback__hint").innerHTML = `${L.hint} <strong></strong>`;
    q(".mail-fallback__hint strong").textContent = mail.to;
    const enc = encodeURIComponent;
    const gmail = q('[data-act="gmail"]');
    gmail.textContent = L.gmail;
    gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(mail.to)}&su=${enc(mail.subject)}&body=${enc(mail.body)}`;
    const outlook = q('[data-act="outlook"]');
    outlook.textContent = L.outlook;
    outlook.href = `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(mail.to)}&subject=${enc(mail.subject)}&body=${enc(mail.body)}`;
    q('[data-act="copy"]').textContent = L.copy;
    q('[data-act="close"]').textContent = L.close;
    modal.classList.add("is-open");
  };
  const close = () => modal && modal.classList.remove("is-open");

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-mail]");
    if (!link) return;
    const mail = parseMailto(link.getAttribute("href"));
    // deixar o browser abrir a app de email; se a página não perder o foco, não abriu nada
    let left = false;
    const markLeft = () => { left = true; };
    window.addEventListener("blur", markLeft, { once: true });
    document.addEventListener("visibilitychange", markLeft, { once: true });
    setTimeout(() => {
      window.removeEventListener("blur", markLeft);
      document.removeEventListener("visibilitychange", markLeft);
      if (!left) open(mail);
    }, 1500);
  });
})();
