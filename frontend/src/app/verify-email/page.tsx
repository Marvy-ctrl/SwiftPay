import React, { Suspense } from "react";
import VerifyPage from "@/components/verify";

export default function VerifyEmailPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyPage />;
      </Suspense>
    </main>
  );
}
