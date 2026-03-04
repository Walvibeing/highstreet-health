"use client";

import { useState } from "react";
import type { Review } from "@/types/google-business";
import ReviewCard from "./review-card";
import Button from "@/components/ui/button";

export default function ReviewList({
  initialReviews,
  initialNextPageToken,
  accountId,
  locationId,
}: {
  initialReviews: Review[];
  initialNextPageToken?: string;
  accountId: string;
  locationId: string;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [nextPageToken, setNextPageToken] = useState(initialNextPageToken);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadMore() {
    if (!nextPageToken) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/google/locations/${locationId}/reviews?accountId=${accountId}&pageToken=${nextPageToken}`
      );
      const data = await res.json();
      setReviews([...reviews, ...(data.reviews || [])]);
      setNextPageToken(data.nextPageToken);
    } finally {
      setLoadingMore(false);
    }
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet.</p>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard
          key={review.reviewId}
          review={review}
          accountId={accountId}
          locationId={locationId}
        />
      ))}
      {nextPageToken && (
        <div className="pt-4 text-center">
          <Button
            variant="secondary"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
