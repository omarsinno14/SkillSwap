import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostForm } from "@/components/post-form";

export default function NewPostPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Create a looking-for post</h1>
          <p className="text-white/60">Share what you need and get matched quickly.</p>
        </CardHeader>
        <CardContent>
          <PostForm />
        </CardContent>
      </Card>
    </AppShell>
  );
}
