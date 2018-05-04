(function () {
    'use strict';
    const form = document.getElementById('inputForm');
    const popup = document.getElementById('popup-container');
    const file = document.getElementById('file');

    const message = document.getElementById('inputTextArea');
    const motivation = document.getElementById('inputTextAreaContact');

    const span = document.createElement('span');
    span.className = "alert";


    function popUpOpener() {
        popup.classList.add('open');
        setTimeout(() => {
            popup.classList.remove('open')
        }, 2500)
    }

    let uploadedFile;

    const maxFileSize = 5242880;

    function fileSizeNotification() {
        span.innerHTML = "File size cannot exceed 5MB";
        form.appendChild(span);
    }

    if (file) {
        file.addEventListener('change', () => {
            span.innerHTML = "";
            uploadedFile = (file.files[0].size <= maxFileSize ? file.files[0] : fileSizeNotification());
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                name: form.elements.name.value,
                email: form.elements.email.value,
                subject: form.elements.subject.value,
                referrer: document.referrer
            };

            if (message) {
                data.message = form.elements.textarea.value;
            }

            if (motivation) {
                data.motivation = form.elements.textareaContact.value;
            }

            if (file) {
                data.attachment = uploadedFile;
            }

            const formData = new FormData();

            for (let name in data) {
                formData.append(name, data[name]);
            }


            fetch('/sendMail', {
                method: "POST",
                body: formData
            })
                .then(res => res.text())
                .then(popUpOpener)
                .then(() => form.reset())
                .catch(e => console.log(e));
        });
    }
})();