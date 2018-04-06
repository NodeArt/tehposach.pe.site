(function () {
    'use strict';
    const form = document.getElementById('inputForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                name: form.elements.name.value,
                email: form.elements.email.value,
                subject: form.elements.subject.value,
                message: ( (form.elements.textarea) ? form.elements.textarea.value : 'no message sent' )
            };
            console.log(JSON.stringify(data));
            fetch('/sendMail', {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => res.text())
                .then(data => console.log(data))
                .catch(e => console.log(e));
        });
    }
})();