document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");

    if (token) {
        try {
            const user = await apiGetMe();
            localStorage.setItem("user_data", JSON.stringify(user));
            showDashboard(user);
        } catch (error) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_data");
            showAuthSection();
        }
    } else {
        showAuthSection();
    }
});

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const btn = document.getElementById("login-btn");

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Signing in...';

    try {
        const tokenData = await apiLogin(username, password);
        localStorage.setItem("access_token", tokenData.access_token);

        const user = await apiGetMe();
        localStorage.setItem("user_data", JSON.stringify(user));

        showToast(`Welcome back, ${user.username}!`, "success");
        showDashboard(user);

        document.getElementById("login-form").reset();
    } catch (error) {
        showToast(error.message || "Login failed", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = "Sign In";
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const btn = document.getElementById("register-btn");

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Creating account...';

    try {
        await apiRegister(username, email, password);

        showToast("Account created! Logging you in...", "success");

        const tokenData = await apiLogin(username, password);
        localStorage.setItem("access_token", tokenData.access_token);

        const user = await apiGetMe();
        localStorage.setItem("user_data", JSON.stringify(user));

        showDashboard(user);
        document.getElementById("register-form").reset();
    } catch (error) {
        showToast(error.message || "Registration failed", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = "Create Account";
    }
}

function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    showAuthSection();
    showToast("Logged out successfully", "info");
}

function switchAuthTab(tab) {
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const adminTab = document.getElementById("admin-login-tab");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const adminForm = document.getElementById("admin-login-form");

    [loginTab, registerTab, adminTab].forEach(t => t.classList.remove("active"));
    [loginForm, registerForm, adminForm].forEach(f => f.classList.add("hidden"));

    if (tab === "login") {
        loginTab.classList.add("active");
        loginForm.classList.remove("hidden");
    } else if (tab === "register") {
        registerTab.classList.add("active");
        registerForm.classList.remove("hidden");
    } else if (tab === "admin") {
        adminTab.classList.add("active");
        adminForm.classList.remove("hidden");
    }
}

async function handleAdminLogin(event) {
    event.preventDefault();

    const username = document.getElementById("admin-username").value.trim();
    const password = document.getElementById("admin-password").value;
    const btn = document.getElementById("admin-login-btn");

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Authenticating...';

    try {
        const tokenData = await apiLogin(username, password);
        localStorage.setItem("access_token", tokenData.access_token);

        const user = await apiGetMe();

        if (user.role !== "admin") {
            localStorage.removeItem("access_token");
            showToast("Access denied. This account does not have admin privileges.", "error");
            return;
        }

        localStorage.setItem("user_data", JSON.stringify(user));
        showToast(`Welcome, Admin ${user.username}!`, "success");
        showDashboard(user);

        document.getElementById("admin-login-form").reset();
    } catch (error) {
        showToast(error.message || "Admin login failed", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🛡️ Sign In as Admin';
    }
}

function showAuthSection() {
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
}

function showDashboard(user) {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");

    document.getElementById("nav-username").textContent = user.username;
    const roleBadge = document.getElementById("nav-role");
    roleBadge.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    roleBadge.className = `role-badge ${user.role}`;

    const usersTabBtn = document.getElementById("users-tab-btn");
    if (user.role === "admin") {
        usersTabBtn.classList.remove("hidden");
        loadUsers();
    } else {
        usersTabBtn.classList.add("hidden");
        document.getElementById("users-tab").classList.add("hidden");
    }

    loadTasks();
}

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const icons = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
    };

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || ""}</span> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100px)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
