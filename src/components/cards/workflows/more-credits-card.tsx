"use client";

import React from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

const MoreCreditsCard = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <CardDescription>You are out of credits</CardDescription>
      </CardContent>
    </Card>
  );
};

export default MoreCreditsCard;
