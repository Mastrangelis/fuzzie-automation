"use client";
import React from "react";
import UploadCareButton from "./uploadcare-button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { User } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  userClerkId: string;
  userImage: string | null;
  onDelete?: (clerkId: string) => Promise<User>;
  onUpload: (clerkId: string, image: string) => Promise<User>;
};

const ProfilePicture = ({
  userImage,
  userClerkId,
  onDelete,
  onUpload,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const onRemoveProfileImage = async () => {
    try {
      if (!onDelete) {
        toast({
          title: "Error",
          description: "Internal Server Error.",
          variant: "destructive",
        });
        return;
      }

      const response = await onDelete(userClerkId);

      toast({
        title: "Success",
        description: "Profile image removed successfully!",
        variant: "success",
      });

      if (response) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Something went wrong removing profile image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-lg dark:text-white"> Profile Picture</p>
      <div className="flex min-h-[20vh] md:min-h-[30vh] flex-col items-center justify-center">
        {userImage ? (
          <div className="flex flex-col items-center gap-4 w-full justify-center pt-10">
            <Image
              src={userImage}
              alt="profile img"
              width={250}
              height={250}
              className="aspect-square rounded-lg size-44 sm:size-64 lg:size-80"
            />

            <Button
              onClick={onRemoveProfileImage}
              className="bg-transparent text-black hover:bg-black hover:text-white flex items-center gap-1 dark:text-white/70 dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              <X className="size-5" /> Remove Logo
            </Button>
          </div>
        ) : (
          <UploadCareButton onUpload={(e) => onUpload(userClerkId, e)} />
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
