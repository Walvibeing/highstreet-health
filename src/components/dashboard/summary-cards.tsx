"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/card";
import StarRating from "@/components/ui/star-rating";
import type { Location, ReviewsListResponse } from "@/types/google-business";

export default function SummaryCards({
  accountId,
  locationId,
}: {
  accountId: string;
  locationId: string;
}) {
  const [location, setLocation] = useState<Location | null>(null);
  const [reviews, setReviews] = useState<ReviewsListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/google/locations/${locationId}`).then((r) => r.json()),
      fetch(
        `/api/google/locations/${locationId}/reviews?accountId=${accountId}`
      ).then((r) => r.json()),
    ])
      .then(([loc, rev]) => {
        setLocation(loc);
        setReviews(rev);
      })
      .finally(() => setLoading(false));
  }, [accountId, locationId]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-8 w-16 rounded bg-gray-200" />
          </Card>
        ))}
      </div>
    );
  }

  const address = location?.storefrontAddress;
  const addressStr = address
    ? [
        ...(address.addressLines || []),
        address.locality,
        address.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "N/A";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <p className="text-xs font-medium text-gray-500">Business Name</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {location?.title || "N/A"}
        </p>
      </Card>
      <Card>
        <p className="text-xs font-medium text-gray-500">Address</p>
        <p className="mt-1 text-sm text-gray-900">{addressStr}</p>
      </Card>
      <Card>
        <p className="text-xs font-medium text-gray-500">Average Rating</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {reviews?.averageRating?.toFixed(1) || "—"}
          </span>
          {reviews?.averageRating && (
            <StarRating rating={Math.round(reviews.averageRating)} />
          )}
        </div>
      </Card>
      <Card>
        <p className="text-xs font-medium text-gray-500">Total Reviews</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {reviews?.totalReviewCount ?? "—"}
        </p>
      </Card>
    </div>
  );
}
