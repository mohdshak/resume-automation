"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/onboarding/UploadDropzone";
import { ProfileVerification } from "@/components/onboarding/ProfileVerification";
import { ResumeData } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [parsedProfile, setParsedProfile] = useState<ResumeData | null>(null);

  const handleParsed = (profile: ResumeData) => {
    setParsedProfile(profile);
    setStep(2);
  };

  const handleConfirmed = () => {
    router.push("/tailor");
  };

  return (
    <div className="py-8 flex flex-col items-center justify-center min-h-[75vh]">
      {step === 1 && <UploadDropzone onParsed={handleParsed} />}
      {step === 2 && parsedProfile && (
        <ProfileVerification initialProfile={parsedProfile} onConfirmed={handleConfirmed} />
      )}
    </div>
  );
}
