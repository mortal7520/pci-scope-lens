"""DOM test for popup.html with a mocked chrome.tabs API (no extension load needed)."""
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
INIT = """
window.chrome = {
  runtime: { lastError: null },
  tabs: {
    query: (_q, cb) => cb([{ id: 1 }]),
    sendMessage: (_id, _msg, cb) => {
      const direct = location.hash === '#direct';
      cb({
        url: 'https://example.com/checkout',
        https: true,
        providerIframes: direct ? [] : ['Stripe'],
        directFields: direct ? [{ name: 'cardnumber', id: '', type: 'text', autocomplete: '' }] : [],
        forms: [{ action: 'https://example.com/pay', method: 'post' }],
        formsWithPaymentAction: true,
        mixedContent: false
      });
    }
  }
};
"""


def run() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.add_init_script(INIT)
        page.goto((HERE / "popup.html").as_uri(), wait_until="load")
        page.wait_for_selector("#badge")
        assert page.inner_text("#badge") == "SAQ A likely", page.inner_text("#badge")
        assert "saq_a" in page.get_attribute("#badge", "class")
        assert page.inner_text("#providers") == "Stripe"

        page.goto("about:blank")
        page.goto((HERE / "popup.html").as_uri() + "#direct", wait_until="load")
        page.wait_for_selector("#badge")
        assert page.inner_text("#badge") == "SAQ D / A-EP likely", page.inner_text("#badge")
        assert "saq_d" in page.get_attribute("#badge", "class")
        assert "cardnumber" in page.inner_text("#fields")
        browser.close()


if __name__ == "__main__":
    run()
    print("popup DOM: 2 states OK")
