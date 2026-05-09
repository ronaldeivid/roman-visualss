function submitForm(event) {
  event.preventDefault();

  const name     = document.getElementById('name').value.trim();
  const company  = document.getElementById('company').value.trim();
  const email    = document.getElementById('email').value.trim();
  const website  = document.getElementById('website').value.trim();
  const script   = document.getElementById('script').value;
  const assets   = document.getElementById('assets').value;
  const duration = document.getElementById('duration').value;
  const message  = document.getElementById('message').value.trim();
  const privacy  = document.getElementById('privacy').checked;
  const day      = document.getElementById('deadline-day').value;
  const month    = document.getElementById('deadline-month').value;
  const year     = document.getElementById('deadline-year').value;
  const deadline = day && month && year ? `${day}/${month}/${year}` : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let hayErrores = false;

  hayErrores = setError('name',         'err-name',     name.length<4 || /\d/.test(name)) || hayErrores;
  hayErrores = setError('company',      'err-company',  company.length<4 || !/[a-zA-Z]/.test(company)) || hayErrores;
  hayErrores = setError('email',        'err-email',    !emailRegex.test(email)) || hayErrores;
  hayErrores = setError('website',      'err-website',  !website) || hayErrores;
  hayErrores = setError('script',       'err-script',   !script) || hayErrores;
  hayErrores = setError('assets',       'err-assets',   !assets) || hayErrores;
  hayErrores = setError('duration',     'err-duration', !duration) || hayErrores;
  hayErrores = setError('deadline-day', 'err-deadline', !day || !month || !year) || hayErrores;
  hayErrores = setError('message',      'err-message',  message.length < 20 || !/[a-zA-Z]/.test(message)) || hayErrores;
  hayErrores = setErrorPrivacy(!privacy) || hayErrores;

  if (hayErrores) return;

  const btn = document.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  fetch('https://formspree.io/f/xlgzlppp', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, company, email, website, script, assets, duration, deadline, message })
  })
  .then(function(r) {
    if (r.ok) {
      mostrarExito();
    } else {
      alert('There was a problem processing your request. Please try again');
    }
  })
  .catch(function() {
    alert('No internet connection. Please try again.');
  })
  .finally(function() {
    btn.disabled = false;
    btn.textContent = 'Submit request';
  });
}

function setError(campoId, errorId, mostrar) {
  const campo = document.getElementById(campoId);
  const error = document.getElementById(errorId);
  if (mostrar) {
    campo.classList.add('error');
    error.classList.add('show');
  } else {
    campo.classList.remove('error');
    error.classList.remove('show');
  }
  return mostrar;
}

function setErrorPrivacy(mostrar) {
  document.getElementById('err-privacy').classList.toggle('show', mostrar);
  return mostrar;
}

function mostrarExito() {
  document.getElementById('formView').classList.add('hidden');
  document.getElementById('successView').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
  ['name', 'company', 'email', 'message'].forEach(function(id) {
    document.getElementById(id).addEventListener('input', function() {
      setError(id, 'err-' + id, false);
    });
  });

  ['script', 'assets', 'duration'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', function() {
      setError(id, 'err-' + id, false);
    });
  });

  var daySelect = document.getElementById('deadline-day');
  for (var d = 1; d <= 31; d++) {
    var opt = document.createElement('option');
    opt.value = d < 10 ? '0' + d : '' + d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }

  var yearSelect = document.getElementById('deadline-year');
  for (var y = 2026; y <= 2030; y++) {
    var opt2 = document.createElement('option');
    opt2.value = y;
    opt2.textContent = y;
    yearSelect.appendChild(opt2);
  }

  document.getElementById('privacy').addEventListener('change', function() {
    setErrorPrivacy(false);
  });
});
