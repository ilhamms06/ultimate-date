"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/browser";
import { ACTIVITY_CATALOG } from "@/lib/dateConfig";
import { resolveIcon } from "@/lib/iconRegistry";

const ContentCtx = createContext(null);

const FALLBACK = {
  t: (_key, fallback = "") => fallback,
  activities: ACTIVITY_CATALOG,
  ready: false,
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null); // { key: value } | null
  const [dbActivities, setDbActivities] = useState(null);

  useEffect(() => {
    const sb = getBrowserClient();
    if (!sb) return;
    let alive = true;
    (async () => {
      const [contentRes, actRes] = await Promise.all([
        sb.from("content").select("key,value"),
        sb
          .from("activities")
          .select("*")
          .eq("active", true)
          .order("sort_order", { ascending: true }),
      ]);
      if (!alive) return;
      if (contentRes.data) {
        const map = {};
        contentRes.data.forEach((r) => (map[r.key] = r.value));
        setContent(map);
      }
      if (actRes.data && actRes.data.length) setDbActivities(actRes.data);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const activities = useMemo(() => {
    if (dbActivities && dbActivities.length) {
      return dbActivities.map((r) => ({
        id: r.id,
        label: r.label,
        Icon: resolveIcon(r.icon_name),
        img: r.image_url || null,
        bg: r.bg,
      }));
    }
    return ACTIVITY_CATALOG;
  }, [dbActivities]);

  const value = useMemo(
    () => ({
      t: (key, fallback = "") =>
        content && content[key] != null && content[key] !== ""
          ? content[key]
          : fallback,
      activities,
      ready: content !== null,
    }),
    [content, activities]
  );

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

export function useContent() {
  return useContext(ContentCtx) ?? FALLBACK;
}
