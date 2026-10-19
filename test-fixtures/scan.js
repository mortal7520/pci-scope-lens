(function () {
  const iframes = Array.from(document.querySelectorAll('iframe')).map((f) => ({src: f.src || ''}));
  const providerIframes = [];
  for (const f of iframes) {
    const p = window.PCIScopeLens.providerFromSrc(f.src);
    if (p) providerIframes.push(p);
  }
  const directFields = [];
  for (const el of Array.from(document.querySelectorAll('input, select'))) {
    if (window.PCIScopeLens.isCardField(el)) directFields.push({name: el.name || ''});
  }
  const forms = Array.from(document.querySelectorAll('form')).map((f) => ({action: f.action || ''}));
  const r = window.PCIScopeLens.analyze({
    url: location.href,
    https: location.protocol === 'https:',
    providerIframes,
    directFields,
    forms,
    formsWithPaymentAction: forms.some((f) => /checkout|payment|pay|billing|order/i.test(f.action)),
    mixedContent: false,
  });
  document.title = JSON.stringify(r);
})();
