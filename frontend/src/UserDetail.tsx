import { useEffect, useState } from "react";
import "./AdminScreen.css";
import { get_user_detail } from "./config/api";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

type Trend = Record<string, number>;

type UserDetailProps = {
  userId: string;
  onBack: () => void;
  adminName: string;
  adminEmail: string;
  adminInitials: string;
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserDetail({
  userId,
  onBack,
  adminName,
  adminEmail,
  adminInitials,
}: UserDetailProps) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [trend, setTrend] = useState<Trend>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = new Date().getFullYear();

  useEffect(() => {
    setLoading(true);
    setError("");
    get_user_detail(userId, year)
      .then((data) => {
        setUser(data.user);
        setTrend(data.trend ?? {});
      })
      .catch(() => setError("Failed to load user details."))
      .finally(() => setLoading(false));
  }, [userId, year]);

  const trendEntries = Object.entries(trend);
  const trendValues = trendEntries.map(([, v]) => v);
  const totalSpend = trendValues.reduce((a, b) => a + b, 0);
  const monthlyAvg = trendValues.length > 0 ? totalSpend / trendValues.length : 0;
  const maxTrend = Math.max(...trendValues, 1);

  const thisMonthKey = `${year}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const thisMonthSpend = trend[thisMonthKey] ?? 0;

  const sidebar = (
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
  );

  if (loading || error || !user) {
    return (
      <div className="admin-screen">
        {sidebar}
        <main className="admin-main">
          <p className="admin-status-msg">{loading ? "Loading..." : error || "User not found."}</p>
        </main>
      </div>
    );
  }

  const avatarClass =
    user.role === "ADMIN" ? "admin-user-avatar-gold" : "admin-user-avatar-green";

  return (
    <div className="admin-screen">
      {sidebar}

      <main className="admin-main">
        <div className="admin-breadcrumbs">
          <button type="button" className="admin-breadcrumb-link" onClick={onBack}>
            Users
          </button>
          <span className="admin-breadcrumb-sep">/</span>
          <span>{user.name}</span>
        </div>

        <section className="user-detail-hero">
          <div className={`user-detail-avatar ${avatarClass}`}>
            {getInitials(user.name)}
          </div>
          <div>
            <h1 className="user-detail-name">{user.name}</h1>
            <p className="user-detail-meta">
              {user.email}&nbsp;·&nbsp;
              <span
                className={
                  user.role === "ADMIN"
                    ? "admin-role-badge admin-role-admin"
                    : "admin-role-badge admin-role-user"
                }
              >
                {user.role.toLowerCase()}
              </span>
            </p>
          </div>
        </section>

        <section className="user-detail-summary-grid">
          <article className="user-detail-card">
            <p className="user-detail-label">Total spend</p>
            <h2 className="user-detail-value">${totalSpend.toFixed(2)}</h2>
            <p className="user-detail-caption">{year}</p>
          </article>
          <article className="user-detail-card">
            <p className="user-detail-label">This month</p>
            <h2 className="user-detail-value">${thisMonthSpend.toFixed(2)}</h2>
          </article>
          <article className="user-detail-card">
            <p className="user-detail-label">Active months</p>
            <h2 className="user-detail-value">{trendValues.length}</h2>
            <p className="user-detail-caption">with expenses</p>
          </article>
          <article className="user-detail-card">
            <p className="user-detail-label">Monthly avg</p>
            <h2 className="user-detail-value">${monthlyAvg.toFixed(2)}</h2>
            <p className="user-detail-caption">active months only</p>
          </article>
        </section>

        <section className="user-detail-panel">
          <h3 className="user-detail-panel-title">Monthly spending — {year}</h3>
          {trendEntries.length === 0 ? (
            <div className="user-detail-empty">No spending data for {year}</div>
          ) : (
            <div className="user-detail-bar-grid">
              {trendEntries.map(([key, value]) => {
                const monthIdx = parseInt(key.split("-")[1] ?? "1") - 1;
                const pct = (value / maxTrend) * 100;
                return (
                  <div key={key} className="user-detail-bar-col">
                    <span className="user-detail-bar-value">${value.toFixed(0)}</span>
                    <div className="user-detail-bar-track">
                      <div
                        className="user-detail-bar-fill"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="user-detail-bar-month">
                      {MONTH_LABELS[monthIdx]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
