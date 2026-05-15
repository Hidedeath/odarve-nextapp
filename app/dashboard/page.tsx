import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getUserById } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/");
  }

  const payload = await verifySessionToken(token);

  if (!payload) {
    redirect("/");
  }

  const userId = Number(payload.sub);

  if (!Number.isInteger(userId)) {
    redirect("/");
  }

  const user = await getUserById(userId);

  if (!user) {
    redirect("/");
  }

  const createdDate = new Date(user.createdAt);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card reveal">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Welcome back, {user.name}</h1>
            <p className="auth-copy">You are now authenticated using MySQL + JWT cookies.</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="ghost-button" type="submit">
              Logout
            </button>
          </form>
        </div>

        <div className="dashboard-grid">
          <article>
            <h2>Email</h2>
            <p>{user.email}</p>
          </article>
          <article>
            <h2>User ID</h2>
            <p>#{user.id}</p>
          </article>
          <article>
            <h2>Joined</h2>
            <p>{createdDate.toLocaleString()}</p>
          </article>
          <article>
            <h2>Session Type</h2>
            <p>HTTP-only cookie</p>
          </article>
        </div>
      </section>
    </main>
  );
}
