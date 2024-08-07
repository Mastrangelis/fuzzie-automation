import React from "react";
import ProfileForm from "@/components/forms/profile-form";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserByClerkId,
  removeProfileImage,
  updateUserInfo,
  uploadProfileImage,
} from "@/lib/actions/settings.actions";
import ProfilePicture from "./_components/profile-picture";

const Settings = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const user = await getUserByClerkId(clerkUser.id);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or update your information
          </p>
        </div>
        <ProfilePicture
          userClerkId={user?.clerkId || ""}
          onDelete={removeProfileImage}
          userImage={user?.profileImage || ""}
          onUpload={uploadProfileImage}
        />
        <ProfileForm
          user={{
            name: user?.name || "",
            email: user?.email || "",
            clerkId: user?.clerkId || "",
          }}
          onUpdate={updateUserInfo}
        />
      </div>
    </div>
  );
};

export default Settings;
