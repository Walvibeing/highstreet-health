"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Location } from "@/types/google-business";
import Card from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import BusinessInfoForm from "@/components/business/business-info-form";
import HoursEditor from "@/components/business/hours-editor";

function BusinessContent() {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("location") || "";
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!locationId) return;
    setLoading(true);
    setError("");
    fetch(`/api/google/locations/${locationId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(setLocation)
      .catch(() => setError("Failed to load business info"))
      .finally(() => setLoading(false));
  }, [locationId]);

  if (!locationId) {
    return (
      <div className="text-sm text-gray-500">
        Select a location from the Dashboard first.
      </div>
    );
  }

  if (loading) return <Loading text="Loading business info..." />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!location) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
      <Card>
        <BusinessInfoForm location={location} locationId={locationId} />
      </Card>
      <Card>
        <HoursEditor hours={location.regularHours} locationId={locationId} />
      </Card>
    </div>
  );
}

export default function BusinessPage() {
  return (
    <Suspense fallback={<Loading text="Loading..." />}>
      <BusinessContent />
    </Suspense>
  );
}
