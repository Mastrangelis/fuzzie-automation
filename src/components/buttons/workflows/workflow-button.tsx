"use client";

import Workflowform from "@/components/forms/workflows-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
// import { useBilling } from "@/providers/billing-provider";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";
import React, { ButtonHTMLAttributes, forwardRef, useEffect } from "react";

type WorkflowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  triggerclick?: boolean;
};

const WorkflowButton: React.FC<WorkflowButtonProps> = (props) => {
  const { setOpen, setClose } = useModal();
  //   const { credits } = useBilling();

  const handleClick = () => {
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Workflows are a powerfull that help you automate tasks."
      >
        <Workflowform />
      </CustomModal>
    );
  };

  useEffect(() => {
    if (props?.triggerclick) {
      handleClick();
    }
  }, [props?.triggerclick]);

  return (
    <Button
      {...props}
      id="workflow-create-btn"
      size={"icon"}
      onClick={handleClick}
    >
      <Plus />
    </Button>
  );
};

WorkflowButton.displayName = "WorkflowButton";

export default WorkflowButton;
