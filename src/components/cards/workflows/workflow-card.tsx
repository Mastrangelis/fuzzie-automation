"use client";

import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { onWorkflowPublish } from "@/lib/actions/workflows.actions";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  name: string;
  description: string;
  id: string;
  publish: boolean | null;
};

const WorkflowCard = ({ description, id, name, publish }: Props) => {
  const { toast } = useToast();

  const onPublishFlow = async (event: any) => {
    try {
      const response = await onWorkflowPublish(
        id,
        event.target.ariaChecked === "false"
      );

      toast({
        title: "Success",
        description: response.message,
      });
    } catch (e) {
      console.error(e);

      if (e instanceof Error) {
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
        return;
      } else {
        toast({
          title: "Error",
          description: "Something went wrong publishing workflow.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col items-center">
        <Link href={`/workflows/editor/${id}`}>
          <div className="flex flex-row gap-2 mb-3">
            <Image
              src="/googleDrive.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/notion.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <Image
              src="/discord.png"
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
          </div>

          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </Link>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        <Label htmlFor="airplane-mode" className="text-muted-foreground">
          {publish! ? "On" : "Off"}
        </Label>
        <Switch
          id="airplane-mode"
          onClick={onPublishFlow}
          defaultChecked={publish!}
        />
      </div>
    </Card>
  );
};

export default WorkflowCard;
