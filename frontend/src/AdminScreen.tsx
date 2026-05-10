import { useEffect, useMemo, useState } from "react";
import "./AdminScreen.css";
import UserDetail from "./UserDetail";
import { get_users, create_user, update_user, delete_user } from "./config/api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

type ModalMode = "create" | "edit" | null;

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
};

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  password: "",
  role: "USER",
};

export default function AdminScreen() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();
  const adminRaw = localStorage.getItem("user");
  const adminData = adminRaw ? JSON.parse(adminRaw) : null;

  const fetchUsers = async () => {
    try {
      setFetchError("");
      const data = await get_users({ size: 100 });
      setUsers(data.items ?? []);
    } catch {
      setFetchError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return users;
    return users.filter((u) =>
      [u.name, u.email, u.role].some((v) => v.toLowerCase().includes(kw)),
    );
  }, [search, users]);

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;

  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setFormError("");
    setEditUserId(null);
    setModalMode("create");
  };

  const openEdit = (user: ApiUser, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormError("");
    setEditUserId(user.id);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditUserId(null);
    setFormError("");
  };

  const handleSubmit = async () => {
    setFormError("");
    setFormLoading(true);
    try {
      if (modalMode === "create") {
        await create_user(formData);
      } else {
        await update_user(editUserId!, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      if (err instanceof AxiosError) {
        setFormError(err.response?.data?.detail ?? "Operation failed.");
      } else {
        setFormError("Operation failed.");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteConfirm = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError("");
    setDeleteTargetId(userId);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await delete_user(deleteTargetId);
      if (selectedUserId === deleteTargetId) setSelectedUserId(null);
      setDeleteTargetId(null);
      await fetchUsers();
    } catch {
      setDeleteError("Failed to delete user. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="admin-screen w-full">
      <main className="admin-main">
        <div className="admin-toolbar">
          <h1 className="admin-title">Users</h1>
          <div className="admin-toolbar-right">
            <input
              className="admin-search"
              type="text"
              placeholder="Search users..."
              aria-label="Search users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="admin-add-btn"
              type="button"
              onClick={openCreate}
            >
              + Add User
            </button>
          </div>
        </div>

        {fetchError && <p className="admin-fetch-error">{fetchError}</p>}

        <section className="admin-table-card">
          <div className="admin-table admin-table-head">
            <div className="admin-user-cell admin-user-cell-head">
              <span className="admin-user-avatar admin-user-avatar-placeholder" />
              <span>Name</span>
            </div>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <p className="admin-status-msg">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="admin-status-msg">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div
                className="admin-table admin-row admin-row-clickable"
                key={user.id}
                onClick={() => navigate(`/admin/users/${user.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setSelectedUserId(user.id)
                }
              >
                <div className="admin-user-cell">
                  <div
                    className={`admin-user-avatar ${
                      user.role === "ADMIN"
                        ? "admin-user-avatar-gold"
                        : "admin-user-avatar-green"
                    }`}
                  >
                    {/* {getInitials(user.name)} */}
                  </div>
                  <span className="admin-user-name">{user.name}</span>
                </div>

                <span className="admin-muted">{user.email}</span>

                <span>
                  <span
                    className={
                      user.role === "ADMIN"
                        ? "admin-role-badge admin-role-admin"
                        : "admin-role-badge admin-role-user"
                    }
                  >
                    {user.role.toLowerCase()}
                  </span>
                </span>

                <div
                  className="admin-row-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="admin-action-btn admin-action-edit"
                    type="button"
                    onClick={(e) => openEdit(user, e)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-action-btn admin-action-delete"
                    type="button"
                    onClick={(e) => openDeleteConfirm(user.id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <p className="admin-footnote">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
          total · click a row to view details
        </p>
      </main>

      {/* Create / Edit modal */}
      {modalMode && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">
              {modalMode === "create" ? "Add User" : "Edit User"}
            </h2>

            <div className="admin-modal-field">
              <label className="admin-modal-label">Full Name</label>
              <input
                className="admin-modal-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="admin-modal-field">
              <label className="admin-modal-label">Email</label>
              <input
                className="admin-modal-input"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            {modalMode === "create" && (
              <div className="admin-modal-field">
                <label className="admin-modal-label">Password</label>
                <input
                  className="admin-modal-input"
                  type="password"
                  placeholder="Min 8 chars, 1 upper, 1 digit, 1 special"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
              </div>
            )}

            <div className="admin-modal-field">
              <label className="admin-modal-label">Role</label>
              <select
                className="admin-modal-input admin-modal-select"
                value={formData.role}
                onChange={(e) => updateField("role", e.target.value)}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {formError && <p className="admin-modal-error">{formError}</p>}

            <div className="admin-modal-actions">
              <button
                className="admin-modal-cancel"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="admin-modal-submit"
                type="button"
                disabled={formLoading}
                onClick={handleSubmit}
              >
                {formLoading
                  ? "Saving..."
                  : modalMode === "create"
                    ? "Create"
                    : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTargetId && (
        <div
          className="admin-modal-overlay"
          onClick={() => {
            setDeleteTargetId(null);
            setDeleteError("");
          }}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">Delete User</h2>
            <p className="admin-modal-body">
              Are you sure? This will permanently delete the user and all their
              data. This cannot be undone.
            </p>
            {deleteError && <p className="admin-modal-error">{deleteError}</p>}
            <div className="admin-modal-actions">
              <button
                className="admin-modal-cancel"
                type="button"
                onClick={() => {
                  setDeleteTargetId(null);
                  setDeleteError("");
                }}
              >
                Cancel
              </button>
              <button
                className="admin-modal-delete"
                type="button"
                disabled={deleteLoading}
                onClick={handleDelete}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
