const ui = {
    // --- Toasts ---
    toastContainer: null,
    
    initToastContainer() {
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'global-toast-container';
            this.toastContainer.className = 'fixed bottom-4 right-4 z-[9999] space-y-3 flex flex-col items-end pointer-events-none';
            document.body.appendChild(this.toastContainer);
        }
    },
    
    showToast(message, type = 'success') {
        this.initToastContainer();
        const toast = document.createElement('div');
        
        let icon, colorClass, borderClass;
        if (type === 'success') {
            icon = '✅'; colorClass = 'text-green-800'; borderClass = 'border-green-500';
        } else if (type === 'error') {
            icon = '❌'; colorClass = 'text-red-800'; borderClass = 'border-red-500';
            toast.classList.add('animate-shake'); 
        } else {
            icon = 'ℹ️'; colorClass = 'text-blue-800'; borderClass = 'border-blue-500';
        }

        toast.className = `glass bg-white p-4 rounded-xl border-l-4 ${borderClass} shadow-xl min-w-[300px] animate-fade-in-up transition-opacity duration-300 pointer-events-auto flex items-start gap-3`;
        toast.innerHTML = `
            <span class="text-xl mt-0.5">${icon}</span>
            <div class="flex-grow">
                <p class="font-bold text-sm ${colorClass} capitalize">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification'}</p>
                <p class="text-xs text-slate-600 mt-1">${message}</p>
            </div>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600">×</button>
        `;
        
        this.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },

    // --- Loading Spinners ---
    renderSpinner(containerId, message = 'Loading...') {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center p-12 text-nature-600">
                <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-nature-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="font-medium animate-pulse">${message}</p>
            </div>
        `;
    },

    // --- Components ---
    renderNavbar(activePage = 'home') {
        const root = document.getElementById('navbar-root');
        if (!root) return;
        
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        let adminTag = user && user.role === 'admin' ? '<span class="text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded ml-2 align-middle">ADMIN</span>' : '';
        
        let rightSideHtml = '';
        if (user) {
            rightSideHtml = `
                <div class="hidden md:flex items-center space-x-4">
                    ${user.role === 'admin' ? `<a href="admin.html" class="text-sm font-bold ${currentPath === 'admin.html' ? 'text-nature-600' : 'text-slate-600 hover:text-nature-600'}">Admin Panel</a>` : ''}
                    <span class="font-medium text-nature-800">Hi, ${user.name.split(' ')[0]}</span>
                    <button onclick="ui.logout()" class="text-sm font-bold text-red-500 hover:text-red-700">Log Out</button>
                </div>
            `;
        } else {
            rightSideHtml = `
                <div class="hidden md:flex space-x-4">
                    <a href="login.html" class="text-slate-600 font-bold hover:text-nature-600 py-2 px-4 transition-colors">Log In</a>
                    <a href="register.html" class="bg-nature-600 hover:bg-nature-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-transform hover:scale-105">Sign Up</a>
                </div>
            `;
        }

        const navHtml = `
            <nav class="navbar-glass sticky top-0 z-40 p-4">
                <div class="max-w-7xl mx-auto flex justify-between items-center relative">

                    <!-- Logo -->
                    <a href="index.html" class="text-2xl font-extrabold text-nature-700 flex items-center">
                        <span class="text-3xl mr-2">🌱</span> Compostify ${adminTag}
                    </a>

                    <!-- Desktop Links -->
                    <div class="hidden md:flex space-x-8 items-center font-bold text-sm uppercase tracking-wide">
                        <a href="index.html" class="${currentPath === 'index.html' ? 'text-nature-600 border-b-2 border-nature-600' : 'text-slate-500 hover:text-nature-600'}">Home</a>
                        <a href="services.html" class="${currentPath === 'services.html' ? 'text-nature-600 border-b-2 border-nature-600' : 'text-slate-500 hover:text-nature-600'}">Services</a>
                        <a href="education.html" class="${currentPath === 'education.html' ? 'text-nature-600 border-b-2 border-nature-600' : 'text-slate-500 hover:text-nature-600'}">Learn</a>
                        ${user ? `<a href="dashboard.html" class="${currentPath === 'dashboard.html' ? 'text-nature-600 border-b-2 border-nature-600' : 'text-slate-500 hover:text-nature-600'}">Dashboard</a>` : ''}
                    </div>

                    <!-- Right Side Actions -->
                    ${rightSideHtml}

                    <!-- Mobile Hamburger -->
                    <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="md:hidden text-2xl px-2">
                        ☰
                    </button>
                </div>

                <!-- Mobile Menu Dropdown -->
                <div id="mobile-menu" class="hidden md:hidden absolute top-full left-0 w-full navbar-glass bg-white/95 border-t border-slate-200 py-4 flex flex-col space-y-4 px-6 shadow-xl">
                    <a href="index.html" class="font-bold text-slate-700">Home</a>
                    <a href="services.html" class="font-bold text-slate-700">Services</a>
                    <a href="education.html" class="font-bold text-slate-700">Learn</a>
                    ${user ? `
                        <a href="dashboard.html" class="font-bold text-nature-600">Dashboard</a>
                        ${user.role === 'admin' ? '<a href="admin.html" class="font-bold text-nature-600">Admin Panel</a>' : ''}
                        <button onclick="ui.logout()" class="font-bold text-red-500 text-left mt-4 border-t pt-4">Log Out</button>
                    ` : `
                        <a href="login.html" class="font-bold text-slate-600 border-t pt-4">Log In</a>
                        <a href="register.html" class="font-bold text-nature-600">Sign Up</a>
                    `}
                </div>
            </nav>
        `;
        
        root.innerHTML = navHtml;
    },

    renderFooter() {
        const root = document.getElementById('footer-root');
        if (!root) return;
        root.innerHTML = `
            <footer class="bg-slate-900 text-slate-400 py-12 px-4 mt-auto">
                <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="space-y-4 md:col-span-2">
                        <a href="index.html" class="text-2xl font-bold text-white flex items-center gap-2">
                            <span class="text-2xl">🌱</span> Compostify
                        </a>
                        <p class="max-w-sm">Building a sustainable, greener planet by empowering local communities with education and dedicated waste management services.</p>
                    </div>
                    <div>
                        <h4 class="text-white font-bold mb-4">Platform</h4>
                        <ul class="space-y-2">
                            <li><a href="services.html" class="hover:text-nature-400 transition">Services</a></li>
                            <li><a href="education.html" class="hover:text-nature-400 transition">Education</a></li>
                            <li><a href="dashboard.html" class="hover:text-nature-400 transition">Dashboard</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-bold mb-4">Support</h4>
                        <ul class="space-y-2">
                            <li><a href="#" class="hover:text-nature-400 transition">Contact Us</a></li>
                            <li><a href="#" class="hover:text-nature-400 transition">FAQ</a></li>
                            <li><a href="#" class="hover:text-nature-400 transition">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm text-center">
                    &copy; 2026 Compostify Digital Platform. All rights reserved.
                </div>
            </footer>
        `;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
};

window.ui = ui;

// Auto-inject CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
    }
    .animate-shake { animation: shake 0.4s ease-in-out; }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.35s ease-out both; }
`;
document.head.appendChild(style);
