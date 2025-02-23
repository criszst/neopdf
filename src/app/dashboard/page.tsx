'use client'

import { useEffect, useState } from "react";
import SignoutButton from "@/components/login/SignoutButton";
import { User } from "@/backend/user/User";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("Erro ao buscar sessão");
        const data = await res.json();
        setUser(data?.user || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading, user]);

  if (loading) {
    return <p className="text-center text-lg">Carregando...</p>;
  }

  return (
    <>
      <header className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold underline">Dashboard</h1>
        <span className="text-sm text-muted-foreground">{user?.id}</span>

        <SignoutButton />
      </header>

      <main className="flex flex-col items-center justify-center gap-4">
        {user && (
          <p className="text-sm text-muted-foreground">
            Signed in as {user.name} <br />
            {user.email}
          </p>
        )}
      </main>
    </>
  );
}
