"use client";

import { useState } from "react";
import type { Location } from "@/types/google-business";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function BusinessInfoForm({
  location,
  locationId,
}: {
  location: Location;
  locationId: string;
}) {
  const [title, setTitle] = useState(location.title || "");
  const [description, setDescription] = useState(
    location.profile?.description || ""
  );
  const [phone, setPhone] = useState(
    location.phoneNumbers?.primaryPhone || ""
  );
  const [website, setWebsite] = useState(location.websiteUri || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const updates: Partial<Location> = {};
    const masks: string[] = [];

    if (title !== location.title) {
      updates.title = title;
      masks.push("title");
    }
    if (description !== (location.profile?.description || "")) {
      updates.profile = { description };
      masks.push("profile.description");
    }
    if (phone !== (location.phoneNumbers?.primaryPhone || "")) {
      updates.phoneNumbers = { primaryPhone: phone };
      masks.push("phoneNumbers.primaryPhone");
    }
    if (website !== (location.websiteUri || "")) {
      updates.websiteUri = website;
      masks.push("websiteUri");
    }

    if (masks.length === 0) {
      setMessage("No changes to save");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/google/locations/${locationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates, updateMask: masks.join(",") }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setMessage("Saved successfully");
    } catch {
      setMessage("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <Input
        label="Business Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <Input
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        label="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {message && (
          <span
            className={`text-sm ${message.includes("Failed") ? "text-red-500" : "text-green-600"}`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
