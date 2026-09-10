(function () {
    var form = document.getElementById('enquire');
    if (!form) return;
    var steps = form.querySelectorAll('.step');
    var step = 1;
    var statusEl = document.getElementById('form-status');
    var successEl = document.getElementById('form-success');

    var rules = {
        1: [
            { name: 'client_name', test: function (v) { return String(v).trim().length >= 2; }, msg: 'Please enter your name.' },
            { name: 'email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim()); }, msg: 'Enter a valid email address.' },
            { name: 'phone', test: function (v) { return String(v).replace(/\D/g, '').length >= 7; }, msg: 'Enter a valid phone number.' }
        ],
        2: [
            { name: 'delivery_site', test: function (v) { return String(v).trim().length >= 2; }, msg: 'Enter the delivery site location.' }
        ],
        3: []
    };

    var baseBorder = {
        client_name: 'border-slate',
        email: 'border-slate',
        phone: 'border-slate',
        delivery_site: 'border-slate'
    };

    function fieldEl(name) {
        return form.querySelector('[name="' + name + '"]');
    }

    function borderFor(input) {
        return baseBorder[input.getAttribute('name')] || 'border-line';
    }

    function clearError(input) {
        input.classList.remove('border-red-400');
        input.classList.add(borderFor(input));
        var err = input.parentElement.querySelector('.field-error');
        if (err) err.remove();
    }

    function showError(input, msg) {
        input.classList.add('border-red-400');
        input.classList.remove('border-slate', 'border-line');
        input.parentElement.querySelectorAll('.field-error').forEach(function (e) { e.remove(); });
        var err = document.createElement('p');
        err.className = 'field-error text-red-600 text-xs font-semibold mt-1';
        err.textContent = msg;
        input.parentElement.appendChild(err);
    }

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
        el.addEventListener('input', function () { clearError(el); });
    });

    function validateStep(s) {
        var ok = true;
        rules[s].forEach(function (r) {
            var input = fieldEl(r.name);
            if (!input) return;
            if (!r.test(input.value)) {
                showError(input, r.msg);
                ok = false;
            } else {
                clearError(input);
            }
        });
        return ok;
    }

    function show(s) {
        step = s;
        steps.forEach(function (el) { el.classList.toggle('hidden', Number(el.dataset.step) !== step); });
        form.querySelectorAll('#step-indicator > div').forEach(function (el) {
            var active = Number(el.dataset.step) <= step;
            el.classList.toggle('text-primary', active);
            el.classList.toggle('border-primary', active);
            el.classList.toggle('text-slate', !active);
            el.classList.toggle('border-line', !active);
            if (Number(el.dataset.step) === step) el.setAttribute('aria-current', 'step');
            else el.removeAttribute('aria-current');
        });
        window.scrollTo({ top: form.closest('#enquiry-form').offsetTop - 120, behavior: 'smooth' });
    }

    function resetStatus() {
        statusEl.className = 'hidden mt-[26px] p-4 text-sm font-bold';
        statusEl.textContent = '';
    }

    form.addEventListener('click', function (e) {
        if (e.target.classList.contains('next-step')) {
            if (validateStep(step)) { resetStatus(); show(step + 1); }
        }
        if (e.target.classList.contains('prev-step')) show(step - 1);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateStep(step)) return;
        var payload = {
            client_name: document.getElementById('client_name').value.trim(),
            company_name: document.getElementById('company_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            pipe_type: document.getElementById('pipe_type').value,
            pipe_diameter: document.getElementById('pipe_diameter').value,
            quantity: document.getElementById('quantity').value,
            delivery_site: document.getElementById('delivery_site').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        resetStatus();
        fetch('/api/enquire', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
            if (res.ok) {
                form.classList.add('hidden');
                successEl.classList.remove('hidden');
                successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                var msg = res.d.error || 'Something went wrong.';
                if (res.d.issues) msg = Object.values(res.d.issues)[0] || msg;
                statusEl.textContent = msg;
                statusEl.className = 'mt-[26px] p-4 text-sm font-bold bg-red-50 text-red-700 border border-red-200';
            }
        })
        .catch(function () {
            statusEl.textContent = 'Network error. Please try again.';
            statusEl.className = 'mt-[26px] p-4 text-sm font-bold bg-red-50 text-red-700 border border-red-200';
        });
    });

    document.getElementById('send-another').addEventListener('click', function () {
        form.reset();
        successEl.classList.add('hidden');
        form.classList.remove('hidden');
        resetStatus();
        show(1);
    });
})();