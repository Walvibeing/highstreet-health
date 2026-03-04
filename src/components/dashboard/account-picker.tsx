"use client";

import { useState, useEffect } from "react";
import type { Account, Location } from "@/types/google-business";

interface AccountPickerProps {
  onLocationSelect: (accountId: string, locationId: string) => void;
  selectedAccountId?: string;
  selectedLocationId?: string;
}

export default function AccountPicker({
  onLocationSelect,
  selectedAccountId,
  selectedLocationId,
}: AccountPickerProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [accountId, setAccountId] = useState(selectedAccountId || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/google/accounts")
      .then((r) => r.json())
      .then((data) => {
        setAccounts(data.accounts || []);
        if (data.accounts?.length === 1 && !accountId) {
          const id = data.accounts[0].name.split("/").pop()!;
          setAccountId(id);
        }
      })
      .catch(() => setError("Failed to load accounts"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!accountId) return;
    setLocations([]);
    fetch(`/api/google/locations?accountId=${accountId}`)
      .then((r) => r.json())
      .then((data) => {
        const locs = data.locations || [];
        setLocations(locs);
        if (locs.length === 1 && !selectedLocationId) {
          const locId = locs[0].name.split("/").pop()!;
          onLocationSelect(accountId, locId);
        }
      })
      .catch(() => setError("Failed to load locations"));
  }, [accountId]);

  if (loading) return <p className="text-sm text-gray-500">Loading accounts...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          Account
        </label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Select account</option>
          {accounts.map((a) => {
            const id = a.name.split("/").pop()!;
            return (
              <option key={id} value={id}>
                {a.accountName}
              </option>
            );
          })}
        </select>
      </div>
      {locations.length > 0 && (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Location
          </label>
          <select
            value={selectedLocationId || ""}
            onChange={(e) => onLocationSelect(accountId, e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Select location</option>
            {locations.map((l) => {
              const id = l.name.split("/").pop()!;
              return (
                <option key={id} value={id}>
                  {l.title}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
}
