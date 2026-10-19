const assert = require("assert");
const { analyze, providerFromSrc, isCardField } = require("./logic.js");

assert.strictEqual(providerFromSrc("https://js.stripe.com/v3/"), "Stripe");
assert.strictEqual(providerFromSrc("https://example.com/frame"), null);

let a = analyze({ https: true, providerIframes: ["Stripe"], directFields: [] });
assert.strictEqual(a.verdict, "saq_a");
assert.strictEqual(a.confidence, "medium");

a = analyze({ https: true, providerIframes: [], directFields: [{ name: "card_number" }] });
assert.strictEqual(a.verdict, "saq_d");
assert.strictEqual(a.confidence, "high");

a = analyze({ https: false, providerIframes: ["Adyen"], directFields: [] });
assert.strictEqual(a.verdict, "saq_a");
assert.strictEqual(a.confidence, "low");
assert.ok(a.warnings.some((w) => w.includes("HTTPS")));

a = analyze({ https: true, providerIframes: ["Stripe", "PayPal"], directFields: [] });
assert.ok(a.warnings.some((w) => w.includes("Multiple")));

a = analyze({ https: true, providerIframes: [], directFields: [] });
assert.strictEqual(a.verdict, "unknown");

assert.strictEqual(isCardField({ name: "cc-number", type: "text" }), true);
assert.strictEqual(isCardField({ name: "email", type: "email" }), false);
assert.strictEqual(isCardField({ name: "card", type: "hidden" }), false);

console.log("test_logic: 10 assertions OK");
