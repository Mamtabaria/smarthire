import { useEffect, useState } from "react";
import { Building2, Globe, House, Mail, MapPin, Phone, Plus, Settings2 } from "lucide-react";
import api from "../services/api";

function UserAvatar({ name }) {
  const initials = (name || "Client User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-[#dce7ff] text-lg font-semibold text-[#1e3a8a] shadow">
      {initials}
    </div>
  );
}

function SectionCard({ title, action = "Edit", onAction, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-[#1e2c61]">{title}</h3>
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
        >
          <Plus size={13} />
          {action}
        </button>
      </div>
      {children}
    </div>
  );
}

function ClientProfile() {
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [profile, setProfile] = useState(localUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({
    name: localUser?.name || "",
    email: localUser?.email || "",
    phone: localUser?.phone || "",
    company: localUser?.company || "",
    address: localUser?.address || "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (!data?.user) return;
        setProfile(data.user);
        setForm({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          company: data.user.company || "",
          address: data.user.address || "",
        });
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (_error) {
        // Keep local data when profile API is unavailable.
      }
    };

    loadProfile();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback("");
    try {
      const { data } = await api.patch("/auth/me", form);
      setProfile(data.user);
      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        company: data.user.company || "",
        address: data.user.address || "",
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsEditing(false);
      setFeedback("Profile updated successfully.");
    } catch (error) {
      setFeedback(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const joinedYear = profile?.createdAt ? new Date(profile.createdAt).getFullYear() : new Date().getFullYear();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      {feedback && (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.includes("success")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback}
        </p>
      )}

      {isEditing && (
        <form onSubmit={onSave} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Name"
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#2f58c6]"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#2f58c6]"
            required
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone"
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#2f58c6]"
          />
          <input
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
            placeholder="Company"
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#2f58c6]"
          />
          <input
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Address"
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#2f58c6] md:col-span-2"
          />
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#1e3a8a] px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setForm({
                  name: profile?.name || "",
                  email: profile?.email || "",
                  phone: profile?.phone || "",
                  company: profile?.company || "",
                  address: profile?.address || "",
                });
              }}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex h-28 items-start justify-between bg-[#2344ad] p-4 text-white">
              <p className="text-xs font-medium">Profile</p>
              <p className="text-xs font-medium text-blue-100">Joined in {joinedYear}</p>
            </div>
            <div className="px-5 pb-5">
              <div className="-mt-8 mb-3">
                <UserAvatar name={profile?.name} />
              </div>
              <p className="text-3xl font-semibold text-[#1e2c61]">{profile?.name || "Client User"}</p>
              <p className="mt-1 text-sm text-slate-500">{profile?.email || "no-email@smarthire.com"}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-[#f3f6ff] px-3 py-2 text-[#2b4db7]"
                >
                  Change Name
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-[#f3f6ff] px-3 py-2 text-[#2b4db7]"
                >
                  Manage
                </button>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-3xl font-semibold text-[#1e2c61]">Client Info</h3>
            <div className="mt-3 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Building2 size={16} className="mt-0.5 text-[#2b4db7]" />
                <p>{profile?.company || "Company not added"}</p>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 text-[#2b4db7]" />
                <p>{profile?.phone || "Phone not added"}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-[#2b4db7]" />
                <p>{profile?.address || "Address not added"}</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-3xl font-semibold text-[#1e2c61]">Account Options</h3>
            <div className="mt-3 space-y-2">
              <label className="block text-xs font-medium text-slate-500">Language</label>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <span>English</span>
                <Globe size={16} className="text-slate-500" />
              </div>

              <label className="mt-3 block text-xs font-medium text-slate-500">Role</label>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                <span className="capitalize">{profile?.role || "client"}</span>
                <Settings2 size={16} className="text-slate-500" />
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-4">
          <SectionCard title="Emails" action="Edit" onAction={() => setIsEditing(true)}>
            <div className="rounded-xl border border-slate-100 bg-[#f8faff] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Mail size={16} className="mt-0.5 text-[#2b4db7]" />
                  <div>
                    <p className="mb-1 inline-flex rounded-full bg-[#eaf0ff] px-2 py-0.5 text-[11px] font-medium text-[#2b4db7]">
                      Primary
                    </p>
                    <p className="text-sm font-medium text-slate-700">{profile?.email || "no-email@smarthire.com"}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditing(true)} className="text-xs font-medium text-[#2b4db7]">
                  Edit
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Phone Numbers" action="Add" onAction={() => setIsEditing(true)}>
            <div className="rounded-xl border border-slate-100 bg-[#f8faff] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Phone size={16} className="mt-0.5 text-[#2b4db7]" />
                  <div>
                    <p className="mb-1 inline-flex rounded-full bg-[#eaf0ff] px-2 py-0.5 text-[11px] font-medium text-[#2b4db7]">
                      Primary
                    </p>
                    <p className="text-sm font-medium text-slate-700">{profile?.phone || "Not added"}</p>
                    <p className="text-xs text-slate-500">Mobile</p>
                  </div>
                </div>
                <button onClick={() => setIsEditing(true)} className="text-xs font-medium text-[#2b4db7]">
                  Change
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Addresses" action="Add" onAction={() => setIsEditing(true)}>
            <div className="rounded-xl border border-slate-100 bg-[#f8faff] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <House size={16} className="mt-0.5 text-[#2b4db7]" />
                  <div>
                    <p className="mb-1 inline-flex rounded-full bg-[#eaf0ff] px-2 py-0.5 text-[11px] font-medium text-[#2b4db7]">
                      Primary
                    </p>
                    <p className="text-sm font-medium text-slate-700">{profile?.address || "Address not added yet"}</p>
                  </div>
                </div>
                <button onClick={() => setIsEditing(true)} className="text-xs font-medium text-[#2b4db7]">
                  Edit
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
