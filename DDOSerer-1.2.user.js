// ==UserScript==
// @name         DDOSerer
// @version      1.2
// @description  Description
// @namespace    http://tampermonkey.net/
// @match        https://skr.webactivity.online/student/
// @match        https://skr.webactivity.online/teacher/
// @match        https://skr.webactivity.online/admin/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webactivity.online
// @license      GNU General Public License v3.0
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2.1.4
// ==/UserScript==

(function () {
    'use strict';

    const populateField = (placeholderText, value) => {
        const inputField = Array.from(document.querySelectorAll('input[placeholder]')).find(input => input.getAttribute('placeholder') === placeholderText);
        if (inputField) {
            inputField.value = value;
            console.log(`Populated field '${placeholderText}' with value: ${value}`);
        }
    };

    const worker = new Worker(URL.createObjectURL(new Blob([`
        self.onmessage = function(event) {
            const { min, max } = event.data;
            const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
            self.postMessage(randomValue);
        };
    `], { type: 'application/javascript' })));

    const generateAndPopulateFields = () => {
        worker.postMessage({ min: 52000, max: 53000 });
        worker.onmessage = function(event) {
            const studentID = event.data;
            populateField('เลขประจำตัวนักเรียน 5 หลัก', studentID);
            populateField('รหัสผ่านที่โรงเรียนกำหนด', studentID);
        };
    };

    const decodeCaptcha = () => {
        const captchaImage = document.querySelector('#imgCaptcha');
        if (captchaImage) {
            Tesseract.recognize(
                captchaImage.src,
                'eng',
                {
                    logger: m => console.log(m)
                }
            ).then(({ data: { text } }) => {
                const captchaValue = text.replace(/\D/g, '');
                populateField('พิมพ์ตัวเลขที่ปรากฏ', captchaValue);
                console.log('Decoded CAPTCHA:', captchaValue);
            });
        }
    };

    window.addEventListener('load', () => {
        console.log("Page Loaded. Populating fields...");
        generateAndPopulateFields();
        decodeCaptcha();
    });

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.classList.contains('swal2-container') && node.classList.contains('swal2-center') && node.classList.contains('swal2-backdrop-show')) {
                        console.log("Error popup detected. Refreshing ID and PIN...");
                        generateAndPopulateFields();
                        decodeCaptcha();
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();