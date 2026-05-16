// ════════════════════════════════════════════════════════
// serotoninSEN - Application Core
// ════════════════════════════════════════════════════════

const STORAGE_KEY = 'seratonin_v21';
let STATE = loadState();
let currentUser = null;
let currentProject = null;
let currentPage = 'dashboard';

function defaultState() {
  return {
    projects: [{
      id: 'proj_seratonin',
      name: 'serotoninSEN',
      metier: 'Électricien',
      info: {
        nom: 'DIALLO ELECT',
        metier: 'Électricien qualifié',
        tel: '(+221) 77 576 17 24',
        adresse: 'Darou Salam, Tivaouane',
        email: 'dialloelect@gmail.com'
      }
    }],
    users: [{
      id: 'u_admin',
      login: 'admin',
      password: 'admin321',
      nom: 'Administrateur',
      role: 'admin'
    }, {
      id: 'u_support',
      login: 'support',
      password: 'support321',
      nom: 'Support serotoninSEN',
      role: 'support'
    }],
    projectData: {
      proj_seratonin: {
        clients: [],
        chantiers: [],
        paiements: []
      }
    }
  };
}

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : defaultState();
  } catch(e) {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
}

function doLogin() {
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  const found = STATE.users.find(u => u.login === user && u.password === pass);
  
  if (found) {
    currentUser = found;
    currentProject = STATE.projects[0];
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').classList.add('active');
    document.getElementById('user-name-display').textContent = found.nom;
    renderNav();
    renderPage('dashboard');
  } else {
    document.getElementById('login-error').style.display = 'block';
    setTimeout(() => {
      document.getElementById('login-error').style.display = 'none';
    }, 3000);
  }
}

function doLogout() {
  currentUser = null;
  currentProject = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').classList.remove('active');
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
}

function renderNav() {
  const navMenu = document.getElementById('nav-menu');
  const items = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'chantiers', label: 'Chantiers', icon: '🏗️' },
    { id: 'parametres', label: 'Paramètres', icon: '⚙️' }
  ];
  
  navMenu.innerHTML = '<div class="nav-section">Menu</div>' + 
    items.map(item => `
      <button class="nav-item" onclick="navigateTo('${item.id}')" data-page="${item.id}">
        <span>${item.icon}</span>
        <span>${item.label}</span>
      </button>
    `).join('');
}

function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  renderPage(page);
  if (window.innerWidth <= 768) toggleSidebar();
}

function renderPage(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  pageEl?.classList.add('active');
  
  switch(page) {
    case 'dashboard':
      renderDashboard(pageEl);
      break;
    case 'clients':
      renderClients(pageEl);
      break;
    case 'chantiers':
      renderChantiers(pageEl);
      break;
    case 'parametres':
      renderParametres(pageEl);
      break;
  }
}

function renderDashboard(el) {
  const data = STATE.projectData[currentProject.id];
  const clientCount = data.clients.length;
  const chantiersCount = data.chantiers.length;
  const paiementsSum = data.paiements.reduce((sum, p) => sum + (p.montant || 0), 0);
  
  el.innerHTML = `
    <div class="page-header">
      <h2>Tableau de bord</h2>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="openClientModal()">+ Client</button>
        <button class="btn btn-primary" onclick="openChantierModal()">+ Chantier</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Clients</div>
        <div class="stat-value">${clientCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Chantiers</div>
        <div class="stat-value">${chantiersCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Paiements</div>
        <div class="stat-value">${paiementsSum.toLocaleString()}</div>
      </div>
    </div>
  `;
}

function renderClients(el) {
  const data = STATE.projectData[currentProject.id];
  
  el.innerHTML = `
    <div class="page-header">
      <h2>Clients</h2>
      <button class="btn btn-primary" onclick="openClientModal()">+ Ajouter Client</button>
    </div>
    <div class="table-wrap">
      <div class="table-header">
        <div class="table-title">Liste des clients</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.clients.map((c, i) => `
            <tr>
              <td>${c.nom}</td>
              <td>${c.tel}</td>
              <td>${c.email}</td>
              <td>
                <div class="actions">
                  <button class="icon-btn" onclick="deleteClient(${i})" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderChantiers(el) {
  const data = STATE.projectData[currentProject.id];
  
  el.innerHTML = `
    <div class="page-header">
      <h2>Chantiers</h2>
      <button class="btn btn-primary" onclick="openChantierModal()">+ Ajouter Chantier</button>
    </div>
    <div class="table-wrap">
      <div class="table-header">
        <div class="table-title">Liste des chantiers</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Client</th>
            <th>Montant</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.chantiers.map((c, i) => `
            <tr>
              <td>${c.nom}</td>
              <td>${c.client}</td>
              <td>${c.montant.toLocaleString()} CFA</td>
              <td><span class="badge badge-${c.status === 'actif' ? 'green' : 'red'}">${c.status}</span></td>
              <td>
                <div class="actions">
                  <button class="icon-btn" onclick="deleteChantier(${i})" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderParametres(el) {
  el.innerHTML = `
    <div class="page-header">
      <h2>Paramètres du Projet</h2>
    </div>
    <div class="table-wrap">
      <div style="padding: 20px;">
        <h3 style="margin-bottom: 16px;">${currentProject.name}</h3>
        <p><strong>Métier:</strong> ${currentProject.metier}</p>
        <p><strong>Nom:</strong> ${currentProject.info.nom}</p>
        <p><strong>Téléphone:</strong> ${currentProject.info.tel}</p>
        <p><strong>Email:</strong> ${currentProject.info.email}</p>
        <p><strong>Adresse:</strong> ${currentProject.info.adresse}</p>
      </div>
    </div>
  `;
}

function openClientModal() {
  const modal = document.getElementById('form-modal');
  document.getElementById('form-modal-title').textContent = 'Ajouter un Client';
  document.getElementById('form-modal-body').innerHTML = `
    <div class="form-group">
      <label>Nom</label>
      <input type="text" id="client-nom" placeholder="Nom du client"/>
    </div>
    <div class="form-group">
      <label>Téléphone</label>
      <input type="tel" id="client-tel" placeholder="+221..."/>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="client-email" placeholder="email@example.com"/>
    </div>
  `;
  document.getElementById('form-modal-submit').onclick = saveClient;
  modal.classList.add('open');
}

function saveClient() {
  const nom = document.getElementById('client-nom').value;
  const tel = document.getElementById('client-tel').value;
  const email = document.getElementById('client-email').value;
  
  if (!nom || !tel) {
    showToast('Veuillez remplir tous les champs', 'error');
    return;
  }
  
  STATE.projectData[currentProject.id].clients.push({ nom, tel, email });
  saveState();
  closeFormModal();
  renderPage('clients');
  showToast('Client ajouté avec succès', 'success');
}

function deleteClient(idx) {
  STATE.projectData[currentProject.id].clients.splice(idx, 1);
  saveState();
  renderPage('clients');
  showToast('Client supprimé', 'success');
}

function openChantierModal() {
  const modal = document.getElementById('form-modal');
  const clients = STATE.projectData[currentProject.id].clients;
  document.getElementById('form-modal-title').textContent = 'Ajouter un Chantier';
  document.getElementById('form-modal-body').innerHTML = `
    <div class="form-group">
      <label>Nom du chantier</label>
      <input type="text" id="chantier-nom" placeholder="Nom"/>
    </div>
    <div class="form-group">
      <label>Client</label>
      <select id="chantier-client">
        <option>Sélectionner un client</option>
        ${clients.map((c, i) => `<option value="${c.nom}">${c.nom}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label>Montant (CFA)</label>
      <input type="number" id="chantier-montant" placeholder="0"/>
    </div>
    <div class="form-group">
      <label>Status</label>
      <select id="chantier-status">
        <option value="actif">Actif</option>
        <option value="fermé">Fermé</option>
      </select>
    </div>
  `;
  document.getElementById('form-modal-submit').onclick = saveChantier;
  modal.classList.add('open');
}

function saveChantier() {
  const nom = document.getElementById('chantier-nom').value;
  const client = document.getElementById('chantier-client').value;
  const montant = parseInt(document.getElementById('chantier-montant').value) || 0;
  const status = document.getElementById('chantier-status').value;
  
  if (!nom || client === 'Sélectionner un client') {
    showToast('Veuillez remplir tous les champs', 'error');
    return;
  }
  
  STATE.projectData[currentProject.id].chantiers.push({ nom, client, montant, status });
  saveState();
  closeFormModal();
  renderPage('chantiers');
  showToast('Chantier ajouté avec succès', 'success');
}

function deleteChantier(idx) {
  STATE.projectData[currentProject.id].chantiers.splice(idx, 1);
  saveState();
  renderPage('chantiers');
  showToast('Chantier supprimé', 'success');
}

function closeFormModal() {
  document.getElementById('form-modal').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').style.transform = 
    document.getElementById('sidebar').style.transform === 'translateX(0px)' 
      ? 'translateX(-100%)' 
      : 'translateX(0)';
}

function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  const item = document.createElement('div');
  item.className = `toast-item ${type}`;
  item.textContent = msg;
  toast.appendChild(item);
  setTimeout(() => item.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-user').value = 'admin';
  document.getElementById('login-pass').value = 'admin321';
  document.getElementById('login-user').addEventListener('keypress', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('login-pass').addEventListener('keypress', e => {
    if (e.key === 'Enter') doLogin();
  });
});