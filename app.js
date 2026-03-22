// Data Models (Initial mock data for aesthetic)
const initialTeams = [
    { id: 'T1', name: 'Cotton 11', shortName: 'CTN11' },
    { id: 'T2', name: 'AP11', shortName: 'AP11' },
    { id: 'T3', name: 'Ankushraj11', shortName: 'ANK11' },
    { id: 'T4', name: 'Balkrushna11', shortName: 'BLK11' },
    { id: 'T5', name: 'AjinkyaClasses11', shortName: 'AJC11' }
];

const initialSchedule = [
    { date: '10 Apr 2026, 17:00 IST', team1: 'Cotton 11', team2: 'AP11', venue: 'DPL Arena' },
    { date: '11 Apr 2026, 19:30 IST', team1: 'Ankushraj11', team2: 'Balkrushna11', venue: 'DPL Arena' },
    { date: '12 Apr 2026, 17:00 IST', team1: 'AjinkyaClasses11', team2: 'Cotton 11', venue: 'DPL Arena' },
    { date: '13 Apr 2026, 19:30 IST', team1: 'AP11', team2: 'Ankushraj11', venue: 'DPL Arena' },
    { date: '14 Apr 2026, 17:00 IST', team1: 'Balkrushna11', team2: 'AjinkyaClasses11', venue: 'DPL Arena' },
    { date: '15 Apr 2026, 19:30 IST', team1: 'Cotton 11', team2: 'Ankushraj11', venue: 'DPL Arena' },
    { date: '16 Apr 2026, 17:00 IST', team1: 'AP11', team2: 'Balkrushna11', venue: 'DPL Arena' },
    { date: '17 Apr 2026, 19:30 IST', team1: 'Ankushraj11', team2: 'AjinkyaClasses11', venue: 'DPL Arena' },
    { date: '18 Apr 2026, 17:00 IST', team1: 'Balkrushna11', team2: 'Cotton 11', venue: 'DPL Arena' },
    { date: '19 Apr 2026, 19:30 IST', team1: 'AjinkyaClasses11', team2: 'AP11', venue: 'DPL Arena' },
    { date: '25 Apr 2026, 18:00 IST', team1: 'Playoff Q1', team2: 'Playoff Q2', venue: 'DPL Arena (FINAL)' }
];

const initialPoints = [
    { pos: 1, team: 'Cotton 11', p: 0, w: 0, l: 0, pts: 0, nrr: '+0.00' },
    { pos: 2, team: 'AP11', p: 0, w: 0, l: 0, pts: 0, nrr: '+0.00' },
    { pos: 3, team: 'Ankushraj11', p: 0, w: 0, l: 0, pts: 0, nrr: '+0.00' },
    { pos: 4, team: 'Balkrushna11', p: 0, w: 0, l: 0, pts: 0, nrr: '+0.00' },
    { pos: 5, team: 'AjinkyaClasses11', p: 0, w: 0, l: 0, pts: 0, nrr: '+0.00' }
];

// Initialize Local Storage backend
if (!localStorage.getItem('dpl_players')) {
    localStorage.setItem('dpl_players', JSON.stringify([]));
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 25, 47, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(10, 25, 47, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when link clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up').forEach(el => {
        observer.observe(el);
    });

    // 4. Accordion Logic
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // Close others 
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // Render Dynamic Content
    renderTeams();
    renderSchedule();
    renderPointsTable();
    updateStats();

    // 5. Registration Form Submission
    const regForm = document.getElementById('registrationForm');
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const village = document.getElementById('regVillage').value;
        const role = document.getElementById('regRole').value;
        const mobile = document.getElementById('regMobile').value;
        
        // Generate Unique ID
        const currentPlayers = JSON.parse(localStorage.getItem('dpl_players'));
        const newIdContent = String(currentPlayers.length + 1).padStart(3, '0');
        const playerId = `DPL-26-${newIdContent}`;
        
        const newPlayer = { id: playerId, name, village, role, mobile, date: new Date().toISOString() };
        currentPlayers.push(newPlayer);
        localStorage.setItem('dpl_players', JSON.stringify(currentPlayers));
        
        // Close reg modal, prep success card
        closeModal('registerModal');
        regForm.reset();
        
        const previewCard = document.getElementById('previewCard');
        previewCard.innerHTML = `
            <div class="card-id">${playerId}</div>
            <div class="card-name">${name}</div>
            <div class="card-details">
                <span><i class="fas fa-map-marker-alt"></i> ${village}</span>
                <span><i class="fas fa-baseball-ball"></i> ${role}</span>
            </div>
        `;
        
        openModal('successModal');
        updateStats();
        renderAdminPlayers();
    });
});

// Global Window Functions for Inline Events
window.openModal = function(id) {
    document.getElementById(id).classList.add('active');
    if(id === 'adminModal') {
        renderAdminPlayers();
    }
};

window.closeModal = function(id) {
    document.getElementById(id).classList.remove('active');
};

// Admin Panel Tabs
window.switchAdminTab = function(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
    
    document.getElementById(`admin-${tabName}`).classList.add('active');
};

// Render Admin Players
function renderAdminPlayers() {
    const players = JSON.parse(localStorage.getItem('dpl_players')) || [];
    const tbody = document.getElementById('adminPlayerList');
    
    if (players.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No players registered yet.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = players.map((p, index) => `
        <tr>
            <td>${p.id}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.village}</td>
            <td>${p.role}</td>
            <td>${p.mobile}</td>
            <td>
                <button class="action-btn" onclick="deletePlayer(${index})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

window.deletePlayer = function(index) {
    if(confirm('Are you sure you want to delete this player?')) {
        const players = JSON.parse(localStorage.getItem('dpl_players'));
        players.splice(index, 1);
        localStorage.setItem('dpl_players', JSON.stringify(players));
        renderAdminPlayers();
        updateStats();
    }
};

// Data Renderers
function renderTeams() {
    const container = document.getElementById('teamsContainer');
    container.innerHTML = initialTeams.map(t => `
        <div class="team-card">
            <div class="team-banner">
                <h3>${t.name}</h3>
            </div>
            <div class="team-info">
                <p>Status: Squad Finalized</p>
                <div class="btn-outline" style="padding: 6px 15px; font-size: 13px; margin-top: 10px;">${t.shortName}</div>
            </div>
        </div>
    `).join('');
}

function renderSchedule() {
    const container = document.getElementById('scheduleContainer');
    container.innerHTML = initialSchedule.map(s => `
        <div class="match-card">
            <span class="match-date">${s.date}</span>
            <div class="match-teams">
                <h3>${s.team1}</h3>
                <span class="match-vs">VS</span>
                <h3>${s.team2}</h3>
            </div>
            <p class="match-venue"><i class="fas fa-map-marker-alt"></i> ${s.venue}</p>
        </div>
    `).join('');
}

function renderPointsTable() {
    const tbody = document.getElementById('pointsTableBody');
    tbody.innerHTML = initialPoints.map(p => `
        <tr>
            <td>${p.pos}</td>
            <td>${p.team}</td>
            <td>${p.p}</td>
            <td>${p.w}</td>
            <td>${p.l}</td>
            <td>${p.pts}</td>
            <td style="color: ${parseFloat(p.nrr) > 0 ? 'var(--success)' : 'var(--danger)'}">${p.nrr}</td>
        </tr>
    `).join('');
}

function updateStats() {
    const players = JSON.parse(localStorage.getItem('dpl_players')) || [];
    const playersCountEl = document.getElementById('playersCount');
    if (playersCountEl) {
        // Base count + actual registered players for aesthetics
        playersCountEl.innerText = players.length + 120; 
    }
}
