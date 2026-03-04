import type {
  AccountsListResponse,
  LocationsListResponse,
  Location,
  ReviewsListResponse,
  ReviewReply,
} from "@/types/google-business";

const ACCOUNT_MGMT_BASE =
  "https://mybusinessaccountmanagement.googleapis.com/v1";
const BUSINESS_INFO_BASE =
  "https://mybusinessbusinessinformation.googleapis.com/v1";
const MYBUSINESS_BASE = "https://mybusiness.googleapis.com/v4";

async function googleFetch<T>(
  url: string,
  accessToken: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      `Google API error ${res.status}: ${JSON.stringify(error)}`
    );
  }
  return res.json();
}

export async function listAccounts(
  accessToken: string
): Promise<AccountsListResponse> {
  return googleFetch<AccountsListResponse>(
    `${ACCOUNT_MGMT_BASE}/accounts`,
    accessToken
  );
}

export async function listLocations(
  accessToken: string,
  accountId: string,
  readMask = "name,title,storefrontAddress,phoneNumbers,categories,regularHours,specialHours,websiteUri,profile"
): Promise<LocationsListResponse> {
  return googleFetch<LocationsListResponse>(
    `${BUSINESS_INFO_BASE}/accounts/${accountId}/locations?readMask=${encodeURIComponent(readMask)}`,
    accessToken
  );
}

export async function getLocation(
  accessToken: string,
  locationId: string,
  readMask = "name,title,storefrontAddress,phoneNumbers,categories,regularHours,specialHours,websiteUri,profile"
): Promise<Location> {
  return googleFetch<Location>(
    `${BUSINESS_INFO_BASE}/locations/${locationId}?readMask=${encodeURIComponent(readMask)}`,
    accessToken
  );
}

export async function updateLocation(
  accessToken: string,
  locationId: string,
  updates: Partial<Location>,
  updateMask: string
): Promise<Location> {
  return googleFetch<Location>(
    `${BUSINESS_INFO_BASE}/locations/${locationId}?updateMask=${encodeURIComponent(updateMask)}`,
    accessToken,
    { method: "PATCH", body: JSON.stringify(updates) }
  );
}

export async function listReviews(
  accessToken: string,
  accountId: string,
  locationId: string,
  pageSize = 50,
  pageToken?: string
): Promise<ReviewsListResponse> {
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  if (pageToken) params.set("pageToken", pageToken);
  return googleFetch<ReviewsListResponse>(
    `${MYBUSINESS_BASE}/accounts/${accountId}/locations/${locationId}/reviews?${params}`,
    accessToken
  );
}

export async function replyToReview(
  accessToken: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  comment: string
): Promise<ReviewReply> {
  return googleFetch<ReviewReply>(
    `${MYBUSINESS_BASE}/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
    accessToken,
    { method: "PUT", body: JSON.stringify({ comment }) }
  );
}
