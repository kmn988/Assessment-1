export type DetailUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  joined: string;
  initials: string;
  accent: "green" | "blue" | "gold";
  totalSpend: string;
};

type UserDetailProps = {
  user: DetailUser;
  onBack: () => void;
  adminName: string;
  adminEmail: string;
  adminInitials: string;
};

const avatarClassMap = {
  green: "admin-user-avatar-green",
  blue: "admin-user-avatar-blue",
  gold: "admin-user-avatar-gold",
};

export default function UserDetail({
  user,
  onBack,
  adminName,
  adminEmail,
  adminInitials,
}: UserDetailProps) {
  return (
    <div className="admin-screen">
      <aside className="admin-sidebar">
        <div className="admin-brand">Expense Tracker</div>

        <nav className="admin-nav">
          <button
            className="admin-nav-item admin-nav-item-active"
            type="button"
            onClick={onBack}
          >
            Users
          </button>
        </nav>

        <div className="admin-profile">
          <div className="admin-profile-avatar">{adminInitials}</div>
          <div className="admin-profile-copy">
            <p className="admin-profile-name">{adminName}</p>
            <p className="admin-profile-email">{adminEmail}</p>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-breadcrumbs">
          <button type="button" className="admin-breadcrumb-link" onClick={onBack}>
            Users
          </button>
          <span className="admin-breadcrumb-sep">/</span>
          <span>{user.name}</span>
        </div>

        <section className="user-detail-hero">
          <div
            className={`user-detail-avatar ${avatarClassMap[user.accent]}`}
          >
            {user.initials}
          </div>
          <div>
            <h1 className="user-detail-name">User Detail</h1>
            <p className="user-detail-meta">User overview</p>
          </div>
        </section>

        <section className="user-detail-summary-grid">
          <article className="user-detail-card">
            <p className="user-detail-label">Total spend</p>
            <h2 className="user-detail-value">-</h2>
            <p className="user-detail-caption">&nbsp;</p>
          </article>

          <article className="user-detail-card">
            <p className="user-detail-label">This month</p>
            <h2 className="user-detail-value">-</h2>
          </article>

          <article className="user-detail-card">
            <p className="user-detail-label">Top category</p>
            <h2 className="user-detail-value">-</h2>
            <p className="user-detail-caption">&nbsp;</p>
          </article>

          <article className="user-detail-card">
            <p className="user-detail-label">Monthly avg</p>
            <h2 className="user-detail-value">-</h2>
            <p className="user-detail-caption">&nbsp;</p>
          </article>
        </section>

        <section className="user-detail-panel">
          <h3 className="user-detail-panel-title">Monthly spending — 2026</h3>
          <div className="user-detail-empty">Monthly chart content</div>
        </section>

        <section className="user-detail-panel">
          <h3 className="user-detail-panel-title">Spend by category</h3>
          <div className="user-detail-empty">Category breakdown content</div>
        </section>
      </main>
    </div>
  );
}
