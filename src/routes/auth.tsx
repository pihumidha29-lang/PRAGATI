import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";
import { useEffect } from "react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/" });
      }
    });
  }, [navigate]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <img
            src="/pragati-logo.png"
            alt="PRAGATI"
            className="mx-auto mb-4 h-20 w-20 rounded-full"
          />

          <h1 className="text-3xl font-bold text-primary">
            Welcome to PRAGATI
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Har Vyapar Ki Tarakki
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-xl border bg-background px-4 py-3 font-semibold transition hover:bg-accent"
        >
          <span className="text-lg">G</span>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Sign in to manage your business, finances and opportunities.
        </p>
      </div>
    </div>
  );
}