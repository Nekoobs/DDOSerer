## Table of Contents
- [Installation](#installation)
- [How It Works](#how-it-works)
- [Functions](#functions)
- [Disclaimer](#disclaimer)
- [Support](#support)
- [Lite Version](#lite-version)

![MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge) ![Maintained](https://img.shields.io/badge/Maintained%3F-yes-orange.svg?style=for-the-badge)  
![Static Badge](https://img.shields.io/badge/Made_in-Javascript-yellow?style=for-the-badge) ![Static Badge](https://img.shields.io/badge/For-userscript-black?style=for-the-badge)  
![Performance](https://img.shields.io/badge/Performance-UNOptimized-red?style=for-the-badge) ![Compatibility](https://img.shields.io/badge/Compatibility-Cross%20Platform-blue?style=for-the-badge)  
![GitHub contributors](https://img.shields.io/github/contributors/Nekoobs/DDOSerer?style=for-the-badge) ![GitHub issues](https://img.shields.io/github/issues/Nekoobs/DDOSerer?style=for-the-badge)  

# DDOSerer
**DDOSerer** is a script designed to automate form submissions with functionalities like CAPTCHA decoding and random ID generation.
## Installation
1. **Install Tampermonkey**:
   - [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari](https://www.tampermonkey.net/index.php?browser=safari&locale=en)
2. **Add the UserScript**:
   - Open the Tampermonkey dashboard and create a new script.
   - Copy and paste the entire script content into the editor.
   - Save the script.
## How It Works
- **Initialization**: The script activates upon page load, checking the URL to determine subsequent actions.
- **Random ID Generation**: Creates a random student ID within a specified range.
- **CAPTCHA Decoding**: Utilizes Tesseract.js to interpret the CAPTCHA image present on the page.
- **Form Filling**: Automatically fills out the student ID, password (same as student ID), and CAPTCHA value in the form.
- **Automatic Submission**: Submits the form automatically if the generator is enabled.
- **Logout Mechanism**: Redirects to the logout page if `AlwaysLogout` is enabled and the current page is the registration main page.
## Functions
- **Logger(message)**: Logs messages to the console if debugging is enabled.
- **GetRandomNumber(min, max)**: Generates a random number within the specified range.
- **GenerateRandomStudentID()**: Generates a random student ID.
- **DecodeCaptcha()**: Decodes the CAPTCHA image using Tesseract.js.
- **Inputter()**: Fills in the form fields with the generated student ID and decoded CAPTCHA.
- **AutoSubmit()**: Automatically submits the form if necessary.
- **CheckAndPerformActions()**: Evaluates the current URL and executes the appropriate actions.
## Disclaimer
> [!CAUTION]
> This script is intended for educational and demonstration purposes only. The author does not endorse or encourage any illegal activities or misuse of this script.
## Support
For assistance or inquiries, please contact the maintainer or open an issue on the repository.
> [!TIP]
> Contributions and feedback are always welcome! Feel free to submit pull requests or report any issues to help improve **DDOSerer**.
## Lite Version
> [!NOTE]
> For a more lightweight option, check out the [Lite Version](https://github.com/Nekoobs/DDOSerer-Lite) of DDOSerer. It loads faster and has improved CAPTCHA features, although it has fewer options.
