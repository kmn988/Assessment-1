import { useMemo, useState } from "react";
import "./AdminScreen.css";
import UserDetail, { type DetailUser } from "./UserDetail";

const users: DetailUser[] = [
  {
    id: 1,
    name: "Alice Kim",
    email: "alice@mail.com",
    role: "user",
    joined: "12 Jan 2025",
    totalSpend: "$1,240",
    initials: "AK",
    accent: "green",
  },
  {
    id: 2,
    name: "Admin",
    email: "admin@app.com",
    role: "admin",
    joined: "1 Nov 2024",
    totalSpend: "$3,120",
    initials: "AD",
    accent: "gold",
  },
];

const currentAdmin = {
  name: "Admin",
  email: "admin@app.com",
  initials: "AD",
};

export default function AdminScreen() {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [search]);

  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? null;

  if (selectedUser) {
    return (
      <UserDetail
        user={selectedUser}
        onBack={() => setSelectedUserId(null)}
        adminName={currentAdmin.name}
        adminEmail={currentAdmin.email}
        adminInitials={currentAdmin.initials}
      />
    );
  }

  return (
    <div className="admin-screen">
      <aside className="admin-sidebar">
        <div className="admin-brand">Expense Tracker</div>

        <nav className="admin-nav">
          <button className="admin-nav-item admin-nav-item-active" type="button">
            Users
          </button>
        </nav>

        <div className="admin-profile">
          <div className="admin-profile-avatar">{currentAdmin.initials}</div>
          <div className="admin-profile-copy">
            <p className="admin-profile-name">{currentAdmin.name}</p>
            <p className="admin-profile-email">{currentAdmin.email}</p>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-toolbar">
          <h1 className="admin-title">Users</h1>
          <input
            className="admin-search"
            type="text"
            placeholder="Search users..."
            aria-label="Search users"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <section className="admin-table-card">
          <div className="admin-table admin-table-head">
            <div className="admin-user-cell admin-user-cell-head">
              <span className="admin-user-avatar admin-user-avatar-placeholder" />
              <span>Name</span>
            </div>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Total spend</span>
            <span className="admin-table-action-spacer" />
          </div>

          {filteredUsers.map((user) => (
            <button
              className="admin-table admin-row admin-row-button"
              key={user.id}
              type="button"
              onClick={() => setSelectedUserId(user.id)}
            >
              <div className="admin-user-cell">
                <div className={`admin-user-avatar admin-user-avatar-${user.accent}`}>
                  {user.initials}
                </div>
                <span className="admin-user-name">{user.name}</span>
              </div>

              <span className="admin-muted">{user.email}</span>

              <span>
                <span
                  className={
                    user.role === "admin"
                      ? "admin-role-badge admin-role-admin"
                      : "admin-role-badge admin-role-user"
                  }
                >
                  {user.role}
                </span>
              </span>

              <span className="admin-muted">{user.joined}</span>
              <span className="admin-total-spend">{user.totalSpend}</span>
              <button
                className="admin-row-action"
                type="button"
                aria-label={`View ${user.name}`}
              />
            </button>
          ))}
        </section>

        <p className="admin-footnote">
          {filteredUsers.length} users total · click a row to view details
        </p>
      </main>
    </div>
  );
}
