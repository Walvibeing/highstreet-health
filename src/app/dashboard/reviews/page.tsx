"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ReviewsListResponse } from "@/types/google-business";
import Card from "@/components/ui/card";
import Loading from "@/components/ui/loading";
import StarRating from "@/components/ui/star-rating";
import ReviewList from "@/components/reviews/review-list";

function ReviewsContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("account") || "";
  const locationId = searchParams.get("location") || "";
  const [data, setData] = useState<ReviewsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!accountId || !locationId) return;
    setLoading(true);
    setError("");
    fetch(
      `/api/google/locations/${locationId}/reviews?accountId=${accountId}`
    )
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("Failed to load reviews"))
      .finally(() => setLoading(false));
  }, [accountId, locationId]);

  if (!accountId || !locationId) {
    return (
      <div className="text-sm text-gray-500">
        Select a location from the Dashboard first.
      </div>
    );
  }

  if (loading) return <Loading text="Loading reviews..." />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {data.averageRating?.toFixed(1) || "—"}
            </span>
            {data.averageRating && (
              <StarRating rating={Math.round(data.averageRating)} size="lg" />
            )}
          </div>
          <span className="text-sm text-gray-500">
            {data.totalReviewCount} reviews
          </span>
        </div>
      </div>
      <Card>
        <ReviewList
          initialReviews={data.reviews || []}
          initialNextPageToken={data.nextPageToken}
          accountId={accountId}
          locationId={locationId}
        />
      </Card>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<Loading text="Loading..." />}>
      <ReviewsContent />
    </Suspense>
  );
}
