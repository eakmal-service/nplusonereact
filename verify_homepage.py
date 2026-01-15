from playwright.sync_api import sync_playwright

def verify_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3000")

            print("Waiting for network idle...")
            page.wait_for_load_state("networkidle")

            print("Taking screenshot...")
            page.screenshot(path="homepage_verification.png", full_page=True)
            print("Screenshot saved to homepage_verification.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_homepage()
