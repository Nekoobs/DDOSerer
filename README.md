# DDOSerer

# Installation
1. Install Tampermonkey:
- [Tampermonkey for Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
- [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Tampermonkey for Safari](https://www.tampermonkey.net/index.php?browser=safari&locale=en)
2. Add the UserScript:
- Open Tampermonkey dashboard and create a new script.
- Copy and paste the entire script content into the editor.
- Save the script.
# How It Works
- Initialization: The script runs when the page is loaded, and it checks the current URL to determine the actions to perform.
- Random ID Generation: Generates a random student ID within the specified range.
- CAPTCHA Decoding: Uses Tesseract.js to decode the CAPTCHA image on the page.
- Form Filling: Fills in the student ID, password (same as student ID), and CAPTCHA value in the form fields.
- Automatic Submission: Submits the form automatically if the generator is enabled.
- Logout Mechanism: Redirects to the logout page if AlwaysLogout is enabled and the current page is the registration main page.
# Functions
- Logger(message): Logs messages to the console if debugging is enabled.
- GetRandomNumber(min, max): Generates a random number within the specified range.
- GenerateRandomStudentID(): Generates a random student ID.
- DecodeCaptcha(): Decodes the CAPTCHA image using Tesseract.js.
- Inputter(): Fills in the form fields with generated student ID and decoded CAPTCHA.
- AutoSubmit(): Automatically submits the form if necessary.
- CheckAndPerformActions(): Checks the current URL and performs the appropriate actions.
# Disclaimer
This script is intended for educational and demonstration purposes only. The author does not endorse or encourage any illegal activities or misuse of this script.
