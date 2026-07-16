"use client";

import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Save, Plus, Trash2, Upload, RefreshCw } from "lucide-react";
import Button from "@/components/Button";
import { ICON_NAMES, resolveIcon } from "@/lib/iconRegistry";

const TABS = [
  { id: "wording", label: "Wording" },
  { id: "activities", label: "Aktivitas" },
  { id: "users", label: "Pengguna" },
];

const BG_PRESETS = [
  "bg-linear-to-br from-amber-100 via-orange-50 to-rose-100",
  "bg-linear-to-br from-violet-100 via-purple-50 to-fuchsia-100",
  "bg-linear-to-br from-lime-100 via-green-50 to-emerald-100",
  "bg-linear-to-br from-sky-100 via-indigo-50 to-violet-100",
  "bg-linear-to-br from-amber-200 via-orange-50 to-rose-100",
  "bg-linear-to-br from-pink-100 via-white to-rose-100",
];

function useApi() {
  const router = useRouter();
  return useCallback(
    async (url, opts) => {
      const res = await fetch(url, opts);
      if (res.status === 401) {
        router.replace("/admin/login");
        throw new Error("unauthorized");
      }
      return res;
    },
    [router]
  );
}

/* ---------------- Wording ---------------- */
function WordingTab() {
  const api = useApi();
  const [rows, setRows] = useState(null);
  const [dirty, setDirty] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api("/api/admin/content")
      .then((r) => r.json())
      .then((j) => setRows(j.content ?? []))
      .catch(() => {});
  }, [api]);

  const groups = useMemo(() => {
    const g = {};
    (rows ?? []).forEach((r) => {
      const prefix = r.key.split(".")[0];
      (g[prefix] ??= []).push(r);
    });
    return g;
  }, [rows]);

  function edit(key, value) {
    setDirty((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  async function save() {
    if (!Object.keys(dirty).length) return;
    setSaving(true);
    try {
      await api("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: dirty }),
      });
      setRows((rs) =>
        rs.map((r) => (r.key in dirty ? { ...r, value: dirty[r.key] } : r))
      );
      setDirty({});
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!rows) return <Loading />;

  return (
    <div className="space-y-5 pb-24">
      {Object.entries(groups).map(([prefix, items]) => (
        <section key={prefix} className="rounded-2xl border border-white/60 bg-white/40 p-4">
          <h3 className="mb-3 font-display text-sm font-extrabold uppercase tracking-wide text-pink-500">
            {prefix}
          </h3>
          <div className="space-y-3">
            {items.map((r) => {
              const val = r.key in dirty ? dirty[r.key] : r.value;
              return (
                <label key={r.key} className="block">
                  <span className="mb-1 block text-[0.7rem] font-bold text-ink-soft">
                    {r.key}
                  </span>
                  <textarea
                    value={val}
                    onChange={(e) => edit(r.key, e.target.value)}
                    rows={val.length > 48 ? 2 : 1}
                    className="w-full resize-y rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm font-semibold text-ink focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300/40"
                  />
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/60 bg-white/70 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-xs font-bold text-ink-soft">
            {Object.keys(dirty).length
              ? `${Object.keys(dirty).length} perubahan belum disimpan`
              : saved
              ? "Tersimpan ✓"
              : "Tidak ada perubahan"}
          </span>
          <Button
            onClick={save}
            disabled={saving || !Object.keys(dirty).length}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Activities ---------------- */
function ActivityRow({ row, onSaved, onDeleted }) {
  const api = useApi();
  const [draft, setDraft] = useState(row);
  const [busy, setBusy] = useState(false);

  function set(patch) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  async function uploadImage(file) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api("/api/admin/activities/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j.url) set({ image_url: j.url });
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    try {
      const method = draft._new ? "POST" : "PUT";
      const res = await api("/api/admin/activities", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const j = await res.json();
      if (j.activity) onSaved(j.activity, row);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (draft._new) return onDeleted(row);
    if (!confirm(`Hapus aktivitas "${draft.label}"?`)) return;
    setBusy(true);
    try {
      await api(`/api/admin/activities?id=${encodeURIComponent(draft.id)}`, {
        method: "DELETE",
      });
      onDeleted(row);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/60 bg-white/45 p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/60 bg-white/60">
          {draft.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.image_url} alt="" className="h-full w-full object-contain" />
          ) : (
            createElement(resolveIcon(draft.icon_name), {
              className: "h-6 w-6 text-pink-500",
            })
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            value={draft.label}
            onChange={(e) => set({ label: e.target.value })}
            placeholder="Label aktivitas"
            className="w-full rounded-lg border border-white/70 bg-white/70 px-2.5 py-1.5 text-sm font-bold text-ink focus:border-pink-300 focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={draft.icon_name}
              onChange={(e) => set({ icon_name: e.target.value })}
              className="rounded-lg border border-white/70 bg-white/70 px-2 py-1.5 text-xs font-semibold text-ink"
            >
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <select
              value={draft.bg}
              onChange={(e) => set({ bg: e.target.value })}
              className="max-w-40 rounded-lg border border-white/70 bg-white/70 px-2 py-1.5 text-xs font-semibold text-ink"
            >
              {BG_PRESETS.map((b, i) => (
                <option key={b} value={b}>
                  Warna {i + 1}
                </option>
              ))}
              {!BG_PRESETS.includes(draft.bg) && <option value={draft.bg}>Custom</option>}
            </select>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/70 bg-white/70 px-2 py-1.5 text-xs font-bold text-pink-500">
              <Upload className="h-3.5 w-3.5" />
              Gambar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              />
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => set({ active: e.target.checked })}
              />
              Aktif
            </label>
            <input
              type="number"
              value={draft.sort_order}
              onChange={(e) => set({ sort_order: Number(e.target.value) })}
              className="w-14 rounded-lg border border-white/70 bg-white/70 px-2 py-1.5 text-xs font-semibold text-ink"
              title="Urutan"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button
          onClick={remove}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-ink-soft hover:text-pink-500 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Hapus
        </button>
        <Button onClick={save} disabled={busy || !draft.label} className="px-4 py-1.5 text-sm">
          <Save className="h-4 w-4" />
          {busy ? "…" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}

function ActivitiesTab() {
  const api = useApi();
  const [rows, setRows] = useState(null);

  const load = useCallback(() => {
    api("/api/admin/activities")
      .then((r) => r.json())
      .then((j) => setRows((j.activities ?? []).map((a) => ({ ...a, _key: a.id }))))
      .catch(() => {});
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  function addDraft() {
    setRows((rs) => [
      ...rs,
      {
        _key: `new-${Date.now()}`,
        _new: true,
        id: "",
        label: "",
        icon_name: "Heart",
        image_url: null,
        bg: BG_PRESETS[0],
        sort_order: (rs?.length ?? 0) + 1,
        active: true,
      },
    ]);
  }

  function onSaved() {
    load();
  }
  function onDeleted(row) {
    setRows((rs) => rs.filter((r) => r._key !== row._key));
  }

  if (!rows) return <Loading />;

  return (
    <div className="space-y-3 pb-10">
      {rows.map((r) => (
        <ActivityRow key={r._key} row={r} onSaved={onSaved} onDeleted={onDeleted} />
      ))}
      <button
        onClick={addDraft}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-pink-300 bg-white/40 px-4 py-2 text-sm font-bold text-pink-500 hover:bg-white/70"
      >
        <Plus className="h-4 w-4" />
        Tambah aktivitas
      </button>
    </div>
  );
}

/* ---------------- Users ---------------- */
function Badge({ on, children }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
        on ? "bg-pink-400 text-white" : "bg-white/60 text-ink-soft"
      }`}
    >
      {children}
    </span>
  );
}

function UsersTab() {
  const api = useApi();
  const [users, setUsers] = useState(null);

  const load = useCallback(() => {
    api("/api/admin/users")
      .then((r) => r.json())
      .then((j) => setUsers(j.users ?? []))
      .catch(() => {});
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  if (!users) return <Loading />;

  if (!users.length)
    return (
      <p className="rounded-2xl border border-white/60 bg-white/40 p-6 text-center text-sm font-semibold text-ink-soft">
        Belum ada yang membuat undangan.
      </p>
    );

  const fmt = (s) => (s ? new Date(s).toLocaleString("id-ID") : "—");

  return (
    <div className="space-y-3 pb-10">
      <button
        onClick={load}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-pink-500"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Muat ulang
      </button>
      {users.map((u) => (
        <div key={u.id} className="rounded-2xl border border-white/60 bg-white/45 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-base font-extrabold text-ink">
              {u.to_name || "(tanpa nama)"}
            </span>
            <div className="flex gap-1.5">
              <Badge on={u.opened}>{u.opened ? `Dibuka ${u.open_count}×` : "Belum dibuka"}</Badge>
              <Badge on={u.answered}>{u.answered ? "Menjawab YA" : "Belum jawab"}</Badge>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-semibold text-ink-soft">
            <span>Dibuat: {fmt(u.created_at)}</span>
            <span>Dibuka: {fmt(u.opened_at)}</span>
            <span>Dijawab: {fmt(u.answered_at)}</span>
            <span>
              Aktivitas: {u.config?.acts?.join(", ") || "—"}
            </span>
          </div>
          {u.answer && (
            <div className="mt-2 rounded-xl bg-pink-100/60 px-3 py-2 text-xs font-bold text-ink">
              Pilihan dia → aktivitas: {u.answer.activityId ?? "—"}, lokasi:{" "}
              {u.answer.locationId ?? "—"}, {u.answer.date ?? "—"} {u.answer.time ?? ""}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Loading() {
  return (
    <p className="py-10 text-center text-sm font-semibold text-ink-soft">Memuat…</p>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("wording");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-dvh w-full px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold text-ink">
            Admin <span className="italic text-pink-500">CMS</span>
          </h1>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 px-3 py-1.5 text-xs font-bold text-ink-soft hover:text-pink-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </header>

        <div className="mb-5 flex gap-2">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                tab === tb.id
                  ? "bg-[linear-gradient(160deg,#ff9bc8_0%,#ff5ba0_100%)] text-white shadow-[0_8px_18px_-8px_rgba(255,91,160,0.7)]"
                  : "border border-white/60 bg-white/40 text-ink-soft"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {tab === "wording" && <WordingTab />}
        {tab === "activities" && <ActivitiesTab />}
        {tab === "users" && <UsersTab />}
      </div>
    </main>
  );
}
