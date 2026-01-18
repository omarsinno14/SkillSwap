import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMatchesAction } from "@/server/actions/match";

export default async function MatchesPage() {
  const result = await getMatchesAction();

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Matches</h1>
          <p className="text-white/60">Personalized suggestions from your tags and intent.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.ok && result.matches.length > 0 ? (
            result.matches.map((match) => (
              <div key={match.post.id} className="rounded-md border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{match.post.title}</h3>
                  <Badge>{match.post.intentType}</Badge>
                </div>
                <p className="text-sm text-white/60">Score {match.score.score}</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-xs text-white/50">
                  {match.score.reasons.map((reason) => (
                    <li key={reason} className="rounded-full border border-white/10 px-2 py-1">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">No matches yet. Create a post to get started.</p>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
