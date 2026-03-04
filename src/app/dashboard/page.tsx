"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AccountPicker from "@/components/dashboard/account-picker";
import SummaryCards from "@/components/dashboard/summary-cards";
import Loading from "@/components/ui/loading";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accountId, setAccountId] = useState(
    searchParams.get("account") || ""
  );
  const [locationId, setLocationId] = useState(
    searchParams.get("location") || ""
  );

  function handleLocationSelect(accId: string, locId: string) {
    setAccountId(accId);
    setLocationId(locId);
    router.replace(`/dashboard?account=${accId}&location=${locId}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Select your business to get started
        </p>
      </div>

      <AccountPicker
        onLocationSelect={handleLocationSelect}
        selectedAccountId={accountId}
        selectedLocationId={locationId}
      />

      {accountId && locationId && (
        <SummaryCards accountId={accountId} locationId={locationId} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading text="Loading..." />}>
      <DashboardContent />
    </Suspense>
  );
}
