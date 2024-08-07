"use client";

import React from "react";
import {
  FileUploaderRegular,
  OutputCollectionState,
  OutputCollectionStatus,
} from "@uploadcare/react-uploader";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import "@uploadcare/react-uploader/core.css";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  onUpload: (e: string) => Promise<User>;
};

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleUpload = async (
    e: OutputCollectionState<OutputCollectionStatus, "maybe-has-group">
  ) => {
    try {
      const cdnUrl = e.allEntries[0].cdnUrl;

      if (!cdnUrl) {
        throw Error("Something went wrong uploading file.");
      }

      const file = await onUpload(cdnUrl);

      toast({
        title: "Success",
        description: "Profile image uploaded successfully!",
        variant: "success",
      });

      if (file) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Something went wrong uploading file.",
        variant: "destructive",
      });
    }
  };

  return (
    <FileUploaderRegular
      onDoneClick={handleUpload}
      pubkey="e727835e7c24c38b42d7"
    />
  );
};

export default UploadCareButton;
