"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session && pathname !== "/admin/login") {
          router.replace("/admin/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  async function checkAuth() {
    // LOGIN PAGE MUST REMAIN PUBLIC
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    setChecking(false);
  }

  // Login page does not need the loading screen
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // While checking authentication
  if (checking) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>

          <div
            style={{
              width: "54px",
              height: "54px",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#24549a",
              color: "white",
              borderRadius: "13px",
              fontSize: "30px",
              fontWeight: 800,
              fontStyle: "italic",
            }}
          >
            A
          </div>

          <p
            style={{
              margin: 0,
              color: "#718096",
              fontSize: "13px",
            }}
          >
            Checking authentication...
          </p>

        </div>
      </main>
    );
  }

  return <>{children}</>;
}