"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { FocusGoal } from "../../lib/goals";

const HUB_KEY = "become_member";
const JoinFlow = dynamic(() => import("../JoinFlow"), { ssr: false });

export default function HabitsLanding() {
  const [hubData, setHubData] = useState<{ firstName: string; focus: FocusGoal[] } | null>(null);
  const [joinInitial, setJoinInitial] = useState<{ step: "done"; focus: FocusGoal[]; firstName: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HUB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.focus) setHubData(parsed);
      }
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  return (
    <main style={{ backgroundColor: "#0C0C11", minHeight: "100vh" }}>
      {ready && (
        <JoinFlow
          mountBg
          onClose={() => { window.location.href = "/"; }}
          initialStep={joinInitial?.step}
          initialFocus={joinInitial?.focus ?? hubData?.focus}
          initialFirstName={joinInitial?.firstName ?? hubData?.firstName}
        />
      )}
    </main>
  );
}
