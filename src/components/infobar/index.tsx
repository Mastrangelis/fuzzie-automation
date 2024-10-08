"use client";
import React from "react";
import { Book, Headphones, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserButton } from "@clerk/nextjs";

const InfoBar = () => {
  return (
    <div className="flex flex-row justify-end gap-3 md:gap-6 items-center px-4 py-4 w-full dark:bg-black ">
      <span className="flex items-center rounded-full bg-muted px-2 md:px-4">
        <Search />
        <Input
          placeholder="Quick Search"
          className="border-none bg-transparent !ring-0 !ring-offset-0"
        />
      </span>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Headphones />
          </TooltipTrigger>
          <TooltipContent>
            <p>Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <Book />
          </TooltipTrigger>
          <TooltipContent>
            <p>Guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UserButton />
    </div>
  );
};

export default InfoBar;
