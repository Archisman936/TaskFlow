let allTasks = [];

async function loadTasks() {
    try {
        const tasks = await apiGetTasks();
        allTasks = tasks;
        renderTasks(tasks);
        updateStats(tasks);
    } catch (error) {
        if (error.message !== "Unauthorized") {
            showToast("Failed to load tasks", "error");
        }
    }
}

function renderTasks(tasks) {
    const grid = document.getElementById("tasks-grid");
    const emptyState = document.getElementById("empty-state");

    if (tasks.length === 0) {
        grid.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    grid.innerHTML = tasks
        .map(
            (task) => `
        <div class="task-card priority-${task.priority}" id="task-card-${task.id}">
            <div class="task-card-header">
                <div class="task-title clickable" onclick="openTaskDetail(${task.id})">${escapeHtml(task.title)}</div>
                <div class="task-actions">
                    <button class="btn btn-outline btn-icon btn-sm" onclick="openTaskDetail(${task.id})" title="View Details">👁️</button>
                    <button class="btn btn-outline btn-icon btn-sm" onclick="openEditTaskModal(${task.id})" title="Edit">✏️</button>
                    <button class="btn btn-danger btn-icon btn-sm" onclick="confirmDeleteTask(${task.id})" title="Delete">🗑️</button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ""}
            <div class="task-meta">
                <span class="badge badge-${task.status}">${formatStatus(task.status)}</span>
                <span class="badge badge-${task.priority}">${task.priority}</span>
                <span style="color: var(--text-muted); font-size: 0.75rem; margin-left: auto;">
                    ${formatDate(task.created_at)}
                </span>
            </div>
        </div>
    `
        )
        .join("");
}

function updateStats(tasks) {
    document.getElementById("stat-total").textContent = tasks.length;
    document.getElementById("stat-todo").textContent = tasks.filter(
        (t) => t.status === "todo"
    ).length;
    document.getElementById("stat-progress").textContent = tasks.filter(
        (t) => t.status === "in_progress"
    ).length;
    document.getElementById("stat-done").textContent = tasks.filter(
        (t) => t.status === "done"
    ).length;
}

function openCreateTaskModal() {
    document.getElementById("modal-title").textContent = "New Task";
    document.getElementById("task-submit-btn").textContent = "Create Task";
    document.getElementById("task-edit-id").value = "";
    document.getElementById("task-form").reset();
    document.getElementById("task-modal").classList.remove("hidden");
}

function openEditTaskModal(taskId) {
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    document.getElementById("modal-title").textContent = "Edit Task";
    document.getElementById("task-submit-btn").textContent = "Save Changes";
    document.getElementById("task-edit-id").value = taskId;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-description").value = task.description || "";
    document.getElementById("task-status").value = task.status;
    document.getElementById("task-priority").value = task.priority;
    document.getElementById("task-modal").classList.remove("hidden");
}

function closeTaskModal() {
    document.getElementById("task-modal").classList.add("hidden");
}

async function handleTaskSubmit(event) {
    event.preventDefault();

    const editId = document.getElementById("task-edit-id").value;
    const btn = document.getElementById("task-submit-btn");

    const taskData = {
        title: document.getElementById("task-title").value.trim(),
        description: document.getElementById("task-description").value.trim() || null,
        status: document.getElementById("task-status").value,
        priority: document.getElementById("task-priority").value,
    };

    btn.disabled = true;

    try {
        if (editId) {
            await apiUpdateTask(parseInt(editId), taskData);
            showToast("Task updated successfully!", "success");
        } else {
            await apiCreateTask(taskData);
            showToast("Task created successfully!", "success");
        }

        closeTaskModal();
        await loadTasks();
    } catch (error) {
        showToast(error.message || "Failed to save task", "error");
    } finally {
        btn.disabled = false;
    }
}

async function confirmDeleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        await apiDeleteTask(taskId);
        showToast("Task deleted", "success");
        await loadTasks();
    } catch (error) {
        showToast(error.message || "Failed to delete task", "error");
    }
}

async function loadUsers() {
    try {
        const users = await apiGetUsers();
        renderUsers(users);
    } catch (error) {
        if (error.message !== "Unauthorized") {
            showToast("Failed to load users", "error");
        }
    }
}

function renderUsers(users) {
    const tbody = document.getElementById("users-table-body");
    const currentUser = JSON.parse(localStorage.getItem("user_data"));

    tbody.innerHTML = users
        .map(
            (user) => `
        <tr>
            <td>${user.id}</td>
            <td><strong class="clickable" onclick="openUserDetail(${user.id})">${escapeHtml(user.username)}</strong></td>
            <td style="color: var(--text-secondary)">${escapeHtml(user.email)}</td>
            <td><span class="badge role-badge ${user.role}">${user.role}</span></td>
            <td>
                <span class="badge ${user.is_active ? "badge-done" : "badge-high"}">
                    ${user.is_active ? "Active" : "Inactive"}
                </span>
            </td>
            <td style="color: var(--text-muted); font-size: 0.85rem">${formatDate(user.created_at)}</td>
            <td>
                <div class="user-actions-group">
                    <button class="btn btn-outline btn-sm" onclick="openUserDetail(${user.id})" title="View">👁️</button>
                    <button class="btn btn-outline btn-sm" onclick="openUserEditModal(${user.id})" title="Edit">✏️</button>
                    ${
                        user.id !== currentUser.id
                            ? `<button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${user.id}, '${escapeHtml(user.username)}')" title="Delete">🗑️</button>`
                            : '<span style="color: var(--text-muted); font-size: 0.8rem">You</span>'
                    }
                </div>
            </td>
        </tr>
    `
        )
        .join("");
}

async function confirmDeleteUser(userId, username) {
    if (!confirm(`Delete user "${username}" and all their tasks?`)) return;

    try {
        await apiDeleteUser(userId);
        showToast(`User "${username}" deleted`, "success");
        await loadUsers();
    } catch (error) {
        showToast(error.message || "Failed to delete user", "error");
    }
}

function switchDashboardTab(tab) {
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => btn.classList.remove("active"));

    if (tab === "tasks") {
        tabBtns[0].classList.add("active");
        document.getElementById("tasks-tab").classList.remove("hidden");
        document.getElementById("users-tab").classList.add("hidden");
        loadTasks();
    } else if (tab === "users") {
        tabBtns[1].classList.add("active");
        document.getElementById("users-tab").classList.remove("hidden");
        document.getElementById("tasks-tab").classList.add("hidden");
        loadUsers();
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatStatus(status) {
    const statusMap = {
        todo: "To Do",
        in_progress: "In Progress",
        done: "Done",
    };
    return statusMap[status] || status;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

let currentDetailTaskId = null;

async function openTaskDetail(taskId) {
    const modal = document.getElementById("task-detail-modal");
    const content = document.getElementById("task-detail-content");

    currentDetailTaskId = taskId;
    modal.classList.remove("hidden");
    content.innerHTML = `
        <div class="detail-loading">
            <div class="spinner"></div>
            <span>Loading task details...</span>
        </div>
    `;

    try {
        const task = await apiGetTask(taskId);
        renderTaskDetail(task);
    } catch (error) {
        if (error.message !== "Unauthorized") {
            content.innerHTML = `
                <div class="detail-error">
                    <div class="detail-error-icon">⚠️</div>
                    <p>${escapeHtml(error.message || "Failed to load task")}</p>
                    <button class="btn btn-outline btn-sm" onclick="openTaskDetail(${taskId})">Retry</button>
                </div>
            `;
        }
    }
}

function renderTaskDetail(task) {
    const content = document.getElementById("task-detail-content");

    const priorityIcons = { high: "🔴", medium: "🟡", low: "🟢" };
    const statusIcons = { todo: "📝", in_progress: "🔄", done: "✅" };

    content.innerHTML = `
        <div class="detail-title-row">
            <span class="detail-priority-icon">${priorityIcons[task.priority] || "⚪"}</span>
            <h3 class="detail-title">${escapeHtml(task.title)}</h3>
        </div>

        <div class="detail-badges">
            <span class="badge badge-${task.status}">${statusIcons[task.status] || ""} ${formatStatus(task.status)}</span>
            <span class="badge badge-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
        </div>

        <div class="detail-section">
            <div class="detail-label">Description</div>
            <div class="detail-value">${task.description ? escapeHtml(task.description) : '<span class="text-muted">No description provided</span>'}</div>
        </div>

        <div class="detail-meta-grid">
            <div class="detail-meta-item">
                <div class="detail-label">Task ID</div>
                <div class="detail-value">#${task.id}</div>
            </div>
            <div class="detail-meta-item">
                <div class="detail-label">Created</div>
                <div class="detail-value">${formatDateTime(task.created_at)}</div>
            </div>
            <div class="detail-meta-item">
                <div class="detail-label">Last Updated</div>
                <div class="detail-value">${task.updated_at ? formatDateTime(task.updated_at) : 'Never'}</div>
            </div>
            <div class="detail-meta-item">
                <div class="detail-label">Owner ID</div>
                <div class="detail-value">#${task.owner_id}</div>
            </div>
        </div>
    `;
}

function closeTaskDetailModal() {
    document.getElementById("task-detail-modal").classList.add("hidden");
    currentDetailTaskId = null;
}

function editFromDetail() {
    if (currentDetailTaskId) {
        closeTaskDetailModal();
        openEditTaskModal(currentDetailTaskId);
    }
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

let currentDetailUserId = null;

async function openUserDetail(userId) {
    const modal = document.getElementById("user-detail-modal");
    const content = document.getElementById("user-detail-content");

    currentDetailUserId = userId;
    modal.classList.remove("hidden");
    content.innerHTML = `
        <div class="detail-loading">
            <div class="spinner"></div>
            <span>Loading user details...</span>
        </div>
    `;

    try {
        const user = await apiGetUser(userId);
        renderUserDetail(user);
    } catch (error) {
        if (error.message !== "Unauthorized") {
            content.innerHTML = `
                <div class="detail-error">
                    <div class="detail-error-icon">⚠️</div>
                    <p>${escapeHtml(error.message || "Failed to load user")}</p>
                    <button class="btn btn-outline btn-sm" onclick="openUserDetail(${userId})">Retry</button>
                </div>
            `;
        }
    }
}

function renderUserDetail(user) {
    const content = document.getElementById("user-detail-content");
    const currentUser = JSON.parse(localStorage.getItem("user_data"));

    content.innerHTML = `
        <div class="detail-title-row">
            <span class="detail-priority-icon">${user.role === "admin" ? "🛡️" : "👤"}</span>
            <h3 class="detail-title">${escapeHtml(user.username)}</h3>
        </div>

        <div class="detail-badges">
            <span class="badge role-badge ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            <span class="badge ${user.is_active ? 'badge-done' : 'badge-high'}">
                ${user.is_active ? "Active" : "Inactive"}
            </span>
            ${user.id === currentUser.id ? '<span class="badge badge-todo">You</span>' : ''}
        </div>

        <div class="detail-section">
            <div class="detail-label">Email</div>
            <div class="detail-value">${escapeHtml(user.email)}</div>
        </div>

        <div class="detail-meta-grid">
            <div class="detail-meta-item">
                <div class="detail-label">User ID</div>
                <div class="detail-value">#${user.id}</div>
            </div>
            <div class="detail-meta-item">
                <div class="detail-label">Role</div>
                <div class="detail-value">${user.role === "admin" ? "🛡️ Admin" : "👤 User"}</div>
            </div>
            <div class="detail-meta-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">${user.is_active ? "✅ Active" : "🚫 Inactive"}</div>
            </div>
            <div class="detail-meta-item">
                <div class="detail-label">Created</div>
                <div class="detail-value">${formatDateTime(user.created_at)}</div>
            </div>
        </div>
    `;
}

function closeUserDetailModal() {
    document.getElementById("user-detail-modal").classList.add("hidden");
    currentDetailUserId = null;
}

function editFromUserDetail() {
    if (currentDetailUserId) {
        closeUserDetailModal();
        openUserEditModal(currentDetailUserId);
    }
}

async function openUserEditModal(userId) {
    const modal = document.getElementById("user-edit-modal");

    try {
        const user = await apiGetUser(userId);

        document.getElementById("user-edit-id").value = user.id;
        document.getElementById("user-edit-title").textContent = `Edit — ${user.username}`;
        document.getElementById("user-edit-email").value = user.email;
        document.getElementById("user-edit-role").value = user.role;
        document.getElementById("user-edit-active").value = user.is_active.toString();

        modal.classList.remove("hidden");
    } catch (error) {
        showToast(error.message || "Failed to load user data", "error");
    }
}

function closeUserEditModal() {
    document.getElementById("user-edit-modal").classList.add("hidden");
}

async function handleUserEditSubmit(event) {
    event.preventDefault();

    const userId = document.getElementById("user-edit-id").value;
    const btn = document.getElementById("user-edit-submit-btn");

    const userData = {
        email: document.getElementById("user-edit-email").value.trim() || undefined,
        role: document.getElementById("user-edit-role").value,
        is_active: document.getElementById("user-edit-active").value === "true",
    };

    btn.disabled = true;

    try {
        await apiUpdateUser(parseInt(userId), userData);
        showToast("User updated successfully!", "success");
        closeUserEditModal();
        await loadUsers();
    } catch (error) {
        showToast(error.message || "Failed to update user", "error");
    } finally {
        btn.disabled = false;
    }
}

document.addEventListener("click", (event) => {
    if (event.target.id === "task-modal") closeTaskModal();
    if (event.target.id === "task-detail-modal") closeTaskDetailModal();
    if (event.target.id === "user-detail-modal") closeUserDetailModal();
    if (event.target.id === "user-edit-modal") closeUserEditModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeTaskModal();
        closeTaskDetailModal();
        closeUserDetailModal();
        closeUserEditModal();
    }
});
