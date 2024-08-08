"use client";

import { Workflows } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const WorkflowsRedirect = ({
  workflows,
}: {
  workflows: Workflows[] | undefined;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!workflows || !Array.isArray(workflows) || workflows.length === 0) {
      return router.push("/workflows?create=true");
    }

    return router.push(`/workflows/editor/${workflows[0].id}`);
  }, []);

  return <></>;
};

export default WorkflowsRedirect;
