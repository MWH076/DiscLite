async function loginWithDiscord() {
    window.location.href = '/auth';
}

async function fetchServers() {
    const response = await fetch('/servers');
    const servers = await response.json();

    const serverListDiv = document.getElementById('server-list');
    serverListDiv.innerHTML = '';
    servers.forEach(server => {
        serverListDiv.innerHTML += `
            <div class="col-lg-4 col-sm-6">
                <div class="card shadow-4-hover">
                    <div class="card-body pb-5">
                        <div class="d-flex align-items-center">
                            <div class="me-3">
                                <img alt="Profile Picture" class="avatar rounded-1"
                                    src="https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=48">
                            </div>
                            <div class="flex-1">
                                <div class="d-block font-semibold text-sm text-heading">${server.name}</div>
                                <div class="text-xs text-muted line-clamp-1">${server.member_count} members</div>
                            </div>
                            <div class="text-end">
                                <a href="#server_canvas" class="btn btn-sm btn-neutral rounded-pill"
                                    data-bs-toggle="offcanvas" onclick="viewServerDetails('${server.id}')">
                                    <i class="bi bi-folder2-open me-1"></i>
                                    <span>View</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

function viewServerDetails(serverId) {
    // Fetch and display server details in the offcanvas
    const server = /* fetch server details using serverId */;
    document.getElementById('server_canvas_label').innerText = server.name;
    // Populate other details as needed
}

document.getElementById('add-server-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const serverName = document.getElementById('serverName').value;
    const serverInvite = document.getElementById('serverInvite').value;

    await fetch('/add-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: serverName, invite: serverInvite })
    });

    // Refresh the list
    fetchServers();
});

document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const serverCards = document.querySelectorAll('.card');

    serverCards.forEach(card => {
        const serverName = card.querySelector('.text-heading').innerText.toLowerCase();
        if (serverName.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Initialize server list on page load
fetchServers();