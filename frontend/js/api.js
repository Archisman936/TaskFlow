const API_BASE_URL = "http://localhost:8000/api/v1";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");

    const headers = options.headers || {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (!headers["Content-Type"] && !(options.body instanceof URLSearchParams)) {
        headers["Content-Type"] = "application/json";
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_data");
            showAuthSection();
            showToast("Session expired. Please login again.", "error");
            throw new Error("Unauthorized");
        }

        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || "Something went wrong";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        if (error.message === "Failed to fetch") {
            showToast("Cannot connect to server. Is it running?", "error");
        }
        throw error;
    }
}

async function apiRegister(username, email, password) {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });
}

async function apiLogin(username, password) {
    return apiRequest("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
    });
}

async function apiGetMe() {
    return apiRequest("/auth/me");
}

async function apiGetTask(taskId) {
    return apiRequest(`/tasks/${taskId}`);
}

async function apiGetTasks() {
    return apiRequest("/tasks/");
}

async function apiCreateTask(taskData) {
    return apiRequest("/tasks/", {
        method: "POST",
        body: JSON.stringify(taskData),
    });
}

async function apiUpdateTask(taskId, taskData) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
    });
}

async function apiDeleteTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "DELETE",
    });
}

async function apiGetUsers() {
    return apiRequest("/users/");
}

async function apiGetUser(userId) {
    return apiRequest(`/users/${userId}`);
}

async function apiUpdateUser(userId, userData) {
    return apiRequest(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
    });
}

async function apiDeleteUser(userId) {
    return apiRequest(`/users/${userId}`, {
        method: "DELETE",
    });
}
