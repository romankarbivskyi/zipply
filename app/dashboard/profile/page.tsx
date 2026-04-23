import Heading from "@/components/dashboard/heading";

import { Suspense } from "react";
import UserInfoCard from "@/components/dashboard/profile/user-info-card";
import { UserInfoSkeleton } from "@/components/dashboard/profile/profile-skeletons";
import { DeleteAccountForm } from "@/components/dashboard/profile/delete-account-form";
import ChangePasswordForm from "@/components/dashboard/profile/change-password-form";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <Heading title="Profile" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4">
        <Suspense fallback={<UserInfoSkeleton />}>
          <UserInfoCard />
        </Suspense>

        <ChangePasswordForm />
        <DeleteAccountForm />
      </div>
    </div>
  );
}
