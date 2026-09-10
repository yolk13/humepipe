(function () {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('mobile-nav');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('hidden') === false;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? '\u00d7' : '\u2261';
        if (open) {
            var first = menu.querySelector('a');
            if (first) first.focus();
        }
    });

    menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
            menu.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.textContent = '\u2261';
        }
    });
})();