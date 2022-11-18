<!--FUNCIONES PARA USO DE HOSTPOT VERSION BETA RAPIDA-->
window.closeDropdown = function() {
    console.log("closedropdown");
    var mydropdown = document.getElementById("mydropdown");
    mydropdown.emit('closedropdown');
    var myoptions = document.getElementById("myoptions");
    myoptions.emit('closedropdown');

}
window.openDropdown = function() {
    console.log("opendropdown");
    var mydropdown = document.getElementById("mydropdown");
    mydropdown.emit('opendropdown');
    var myoptions = document.getElementById("myoptions");
    myoptions.emit('opendropdown');}


function show() {
    $("#dialog").toggleClass('intro-overlay');
}



document.addEventListener('DOMContentLoaded', () => {
    initSubscribeForm();
});

/**
 * Init XHR handler to subscribe.
 */
function initSubscribeForm () {
    const form = document.querySelector('form');
    if (!form) { return; }

    if (localStorage.getItem('subscribeClosed')) {
        const formParent = form.parentNode;
        formParent.parentNode.removeChild(formParent);
        return;
    }

    document.getElementById('subscribeClose').addEventListener('click', () => {
        const formParent = form.parentNode;
        formParent.parentNode.removeChild(formParent);
        localStorage.setItem('subscribeClosed', true);
    });

    const button = form.querySelector('.submit');
    const input = form.querySelector('input[type="email"]');
    const newsletterHeader = document.querySelector('#subscribeForm > h2');

    let originalHeaderText = '';
    if (newsletterHeader) {
        originalHeaderText = newsletterHeader.innerHTML;
    }

    form.addEventListener('submit', evt => {
        evt.preventDefault();

        // supermedium/superchimp
        const xhr = new XMLHttpRequest();
        let endpoint = 'http://localhost:5000/mail/subscribe';
        if (process.env.NODE_ENV === 'production') {
            endpoint = 'https://supermedium.com/mail/subscribe';
        }
        xhr.open('POST', endpoint);

        xhr.addEventListener('load', () => {
            if (parseInt(xhr.status, 10) !== 200) {
                window.location.href = 'https://supermedium/subscribe/';
            }
            if (button) {
                button.disabled = true;
                button.innerHTML = 'Subscribed!';
            }
            if (newsletterHeader) {
                newsletterHeader.innerHTML = 'Successfully subscribed, thank you!';
            }
        });

        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify({
            email: document.querySelector('[name="email"]').value,
            source: 'moonrider'
        }));

        return false;
    });

    if (button) {
        input.addEventListener('keydown', () => {
            if (button.hasAttribute('disabled')) {
                button.innerHTML = 'Subscribe';
                button.removeAttribute('disabled');
            }
            if (newsletterHeader && originalHeaderText) {
                newsletterHeader.innerHTML = originalHeaderText;
            }
        });
    }
}