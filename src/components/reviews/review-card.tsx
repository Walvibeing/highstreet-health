"use client";

import { useState } from "react";
import type { Review } from "@/types/google-business";
import StarRating from "@/components/ui/star-rating";
import ReplyForm from "./reply-form";

export default function ReviewCard({
  review,
  accountId,
  locationId,
}: {
  review: Review;
  accountId: string;
  locationId: string;
}) {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState(review.reviewReply);

  return (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {review.reviewer.profilePhotoUrl && (
            <img
              src={review.reviewer.profilePhotoUrl}
              alt=""
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {review.reviewer.isAnonymous
                ? "Anonymous"
                : review.reviewer.displayName}
            </p>
            <div className="flex items-center gap-2">
              <StarRating rating={review.starRating} />
              <span className="text-xs text-gray-400">
                {new Date(review.createTime).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
      )}

      {reply ? (
        <div className="mt-3 rounded-lg bg-blue-50 p-3">
          <p className="text-xs font-medium text-blue-700">Your reply</p>
          <p className="mt-1 text-sm text-blue-900">{reply.comment}</p>
          <p className="mt-1 text-xs text-blue-500">
            {new Date(reply.updateTime).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setShowReply(!showReply)}
          className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
      )}

      {showReply && !reply && (
        <ReplyForm
          accountId={accountId}
          locationId={locationId}
          reviewId={review.reviewId}
          onReplied={(r) => {
            setReply(r);
            setShowReply(false);
          }}
        />
      )}
    </div>
  );
}
