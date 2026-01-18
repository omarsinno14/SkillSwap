import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { banUserAction, deleteListingAction, deletePostAction, suspendUserAction } from "@/server/actions/admin";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return (
      <AppShell>
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">Admin</h1>
          </CardHeader>
          <CardContent>
            <p className="text-white/60">You do not have access to this area.</p>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  const listings = await prisma.listing.findMany({ orderBy: { createdAt: "desc" }, take: 5 });

  return (
    <AppShell>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold">Admin dashboard</h1>
            <p className="text-white/60">Manage users, posts, and listings.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold">Users</h2>
              <ul className="mt-2 space-y-2 text-sm text-white/70">
                {users.map((user) => (
                  <li key={user.id} className="flex items-center justify-between">
                    <span>{user.profile?.displayName ?? user.email} · {user.status}</span>
                    <div className="flex gap-2">
                      <form action={suspendUserAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <Button variant="outline" size="sm" type="submit">Suspend</Button>
                      </form>
                      <form action={banUserAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <Button variant="outline" size="sm" type="submit">Ban</Button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Moderation</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Recent posts</h3>
              <ul className="mt-2 space-y-2 text-sm text-white/70">
                {posts.map((post) => (
                  <li key={post.id} className="flex items-center justify-between">
                    <span>{post.title}</span>
                    <form action={deletePostAction}>
                      <input type="hidden" name="postId" value={post.id} />
                      <Button variant="outline" size="sm" type="submit">Remove</Button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Recent listings</h3>
              <ul className="mt-2 space-y-2 text-sm text-white/70">
                {listings.map((listing) => (
                  <li key={listing.id} className="flex items-center justify-between">
                    <span>{listing.title}</span>
                    <form action={deleteListingAction}>
                      <input type="hidden" name="listingId" value={listing.id} />
                      <Button variant="outline" size="sm" type="submit">Remove</Button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
