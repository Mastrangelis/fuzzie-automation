"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { CardContainer } from "@/components/global/3d-card";
import { useToast } from "@/components/ui/use-toast";
import { getGoogleListener } from "@/lib/actions/workflows.actions";
import Loader from "@/components/icons/loader";

const GoogleDriveFiles = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const reqGoogle = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/drive-activity");
      if (response) {
        toast({
          title: "Success",
          description: JSON.stringify(response.data),
          variant: "success",
        });
        setIsListening(true);
      }
      setIsListening(false);
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const onListener = async () => {
    try {
      const listener = await getGoogleListener();
      if (listener?.googleResourceId !== null) {
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    onListener();
  }, []);

  return (
    <div className="flex flex-col gap-3 pb-6">
      {isListening ? (
        <Card className="py-3">
          <CardContainer>
            <CardDescription>Listening...</CardDescription>
          </CardContainer>
        </Card>
      ) : (
        <Button
          variant="outline"
          {...(!loading && {
            onClick: reqGoogle,
          })}
        >
          {loading ? (
            <div className="absolute flex h-full w-full items-center justify-center">
              <Loader />
            </div>
          ) : (
            "Create Listener"
          )}
        </Button>
      )}
    </div>
  );
};

export default GoogleDriveFiles;
