// Panel de administración para dueños de canchas (owners)

const API_BASE = "http://localhost:3000/api";
let currentOwner = null;
let ownerFields = [];

window.onload = async function () {
    // Simulación: obtener usuario logueado desde localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'ownercanchas') {
        window.location.href = 'login.html';
        return;
    }
    currentOwner = await fetchOwnerByUserId(user.id);
    renderOwnerProfile(user, currentOwner);
    await loadFields();
};

async function fetchOwnerByUserId(user_id) {
    // Busca el owner por user_id
    const res = await fetch(`${API_BASE}/owners/`);
    const owners = await res.json();
    return owners.find(o => o.user_id === user_id);
}

function renderOwnerProfile(user, owner) {
    const el = document.getElementById('ownerProfile');
    el.innerHTML = `
        <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Perfil</h2>
            <p><b>Nombre:</b> ${user.name}</p>
            <p><b>Email:</b> ${user.email}</p>
            <p><b>Teléfono:</b> ${user.phone || ''}</p>
            <button onclick="showEditUserProfile()" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Editar Datos Personales</button>
            <p class="mt-4"><b>Negocio:</b> ${owner?.business_name || ''}</p>
            <p><b>Dirección:</b> ${owner?.address || ''}</p>
            <button onclick="showEditOwnerProfile()" class="mt-2 bg-yellow-500 text-white px-4 py-2 rounded">Editar Perfil Negocio</button>
        </div>
    `;
}

window.showEditUserProfile = function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const el = document.getElementById('editUserProfileContainer');
    el.innerHTML = `
        <form id="editUserProfileForm" class="bg-gray-100 p-4 rounded-lg mb-4">
            <div class="mb-2">
                <label>Nombre</label>
                <input type="text" id="edit_user_name" value="${user.name || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <div class="mb-2">
                <label>Email</label>
                <input type="email" id="edit_user_email" value="${user.email || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <div class="mb-2">
                <label>Teléfono</label>
                <input type="text" id="edit_user_phone" value="${user.phone || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar Cambios</button>
            <button type="button" onclick="cancelEditUserProfile()" class="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
        </form>
    `;
    document.getElementById('editUserProfileForm').onsubmit = submitEditUserProfile;
};

window.cancelEditUserProfile = function() {
    document.getElementById('editUserProfileContainer').innerHTML = '';
};

async function submitEditUserProfile(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const name = document.getElementById('edit_user_name').value;
    const email = document.getElementById('edit_user_email').value;
    const phone = document.getElementById('edit_user_phone').value;
    await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
    });
    // Refrescar datos en localStorage y UI
    user.name = name;
    user.email = email;
    user.phone = phone;
    localStorage.setItem('currentUser', JSON.stringify(user));
    renderOwnerProfile(user, currentOwner);
    cancelEditUserProfile();
}

window.showEditOwnerProfile = function() {
    const el = document.getElementById('editOwnerProfileContainer');
    el.innerHTML = `
        <form id="editOwnerProfileForm" class="bg-gray-100 p-4 rounded-lg mb-4">
            <div class="mb-2">
                <label>Nombre del Negocio</label>
                <input type="text" id="edit_business_name" value="${currentOwner?.business_name || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <div class="mb-2">
                <label>Dirección</label>
                <input type="text" id="edit_address" value="${currentOwner?.address || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar Cambios</button>
            <button type="button" onclick="cancelEditOwnerProfile()" class="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
        </form>
    `;
    document.getElementById('editOwnerProfileForm').onsubmit = submitEditOwnerProfile;
};

window.cancelEditOwnerProfile = function() {
    document.getElementById('editOwnerProfileContainer').innerHTML = '';
};

async function submitEditOwnerProfile(e) {
    e.preventDefault();
    const business_name = document.getElementById('edit_business_name').value;
    const address = document.getElementById('edit_address').value;
    await fetch(`${API_BASE}/owners/${currentOwner.owner_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name, address })
    });
    // Refrescar datos
    currentOwner.business_name = business_name;
    currentOwner.address = address;
    renderOwnerProfile(JSON.parse(localStorage.getItem('currentUser')), currentOwner);
    cancelEditOwnerProfile();
}

async function loadFields() {
    if (!currentOwner) return;
    const res = await fetch(`${API_BASE}/fields/owner/${currentOwner.owner_id}`);
    ownerFields = await res.json();
    renderFields();
}

function renderFields() {
    const el = document.getElementById('fieldsSection');
    el.innerHTML = `
        <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">Tus canchas</h2>
            <button onclick="showFieldForm()" class="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Agregar Cancha</button>
            <div id="fieldsList">
                ${ownerFields.map(f => fieldCard(f)).join('')}
            </div>
        </div>
        <div id="fieldFormContainer"></div>
    `;
}

function fieldCard(field) {
    return `
        <div class="border rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <b>${field.name}</b> <span class="text-gray-500">(${field.address})</span><br>
                <span class="text-sm text-gray-600">Precio/hora: $${field.price_per_hour}</span>
            </div>
            <div class="mt-2 md:mt-0 flex gap-2">
                <button onclick="editField(${field.field_id})" class="bg-yellow-500 text-white px-3 py-1 rounded">Editar</button>
                <button onclick="deleteField(${field.field_id})" class="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
            </div>
        </div>
    `;
}

window.showFieldForm = function(field = null) {
    const el = document.getElementById('fieldFormContainer');
    el.innerHTML = `
        <form id="fieldForm" class="bg-gray-100 p-4 rounded-lg mb-4">
            <input type="hidden" id="field_id" value="${field?.field_id || ''}">
            <div class="mb-2">
                <label>Nombre</label>
                <input type="text" id="field_name" value="${field?.name || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <div class="mb-2">
                <label>Dirección</label>
                <input type="text" id="field_address" value="${field?.address || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <div class="mb-2">
                <label>Precio por hora</label>
                <input type="number" id="field_price" value="${field?.price_per_hour || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <div class="mb-2">
                <label>Tipo de deporte (type_id)</label>
                <input type="number" id="field_type" value="${field?.type_id || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <div class="mb-2">
                <label>Descripción</label>
                <textarea id="field_desc" class="w-full px-2 py-1 rounded border">${field?.description || ''}</textarea>
            </div>
            <div class="mb-2">
                <label>Imagen URL</label>
                <input type="text" id="field_img" value="${field?.image_url || ''}" class="w-full px-2 py-1 rounded border">
            </div>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">${field ? 'Actualizar' : 'Crear'}</button>
            <button type="button" onclick="cancelFieldForm()" class="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
        </form>
    `;
    document.getElementById('fieldForm').onsubmit = field ? submitEditField : submitCreateField;
};

window.cancelFieldForm = function() {
    document.getElementById('fieldFormContainer').innerHTML = '';
};

window.editField = function(field_id) {
    const field = ownerFields.find(f => f.field_id === field_id);
    showFieldForm(field);
};

window.deleteField = async function(field_id) {
    if (!confirm('¿Seguro que deseas eliminar esta cancha?')) return;
    await fetch(`${API_BASE}/fields/${field_id}`, { method: 'DELETE' });
    await loadFields();
};

async function submitCreateField(e) {
    e.preventDefault();
    const body = {
        owner_id: currentOwner.owner_id,
        type_id: Number(document.getElementById('field_type').value),
        name: document.getElementById('field_name').value,
        description: document.getElementById('field_desc').value,
        address: document.getElementById('field_address').value,
        price_per_hour: Number(document.getElementById('field_price').value),
        image_url: document.getElementById('field_img').value
    };
    await fetch(`${API_BASE}/fields/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    await loadFields();
    cancelFieldForm();
}

async function submitEditField(e) {
    e.preventDefault();
    const field_id = document.getElementById('field_id').value;
    const body = {
        type_id: Number(document.getElementById('field_type').value),
        name: document.getElementById('field_name').value,
        description: document.getElementById('field_desc').value,
        address: document.getElementById('field_address').value,
        price_per_hour: Number(document.getElementById('field_price').value),
        image_url: document.getElementById('field_img').value
    };
    await fetch(`${API_BASE}/fields/${field_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    await loadFields();
    cancelFieldForm();
}
