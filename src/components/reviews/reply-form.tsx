"use client";

import { useState } from "react";
import type { ReviewReply } from "@/types/google-business";
import Button from "@/components/ui/button";

export default function ReplyForm({
  accountId,
  locationId,
  reviewId,
  onReplied,
}: {
  accountId: string;
  locationId: string;
  reviewId: string;
  onReplied: (reply: ReviewReply) => void;
}) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!comment.trim()) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch(
        `/api/google/locations/${locationId}/reviews/${reviewId}/reply`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment, accountId }),
        }
      );
      if (!res.ok) throw new Error("Failed to send reply");
      const data = await res.json();
      onReplied(data);
    } catch {
      setError("Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your reply..."
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <div className="flex items-center gap-2">
        <Button onClick={handleSubmit} disabled={sending || !comment.trim()}>
          {sending ? "Sending..." : "Send Reply"}
        </Button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}
