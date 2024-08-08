import WorkflowButton from "@/components/buttons/workflows/workflow-button";
import MoreCreditsCard from "@/components/cards/workflows/more-credits-card";
import WorkflowCard from "@/components/cards/workflows/workflow-card";
import { onGetWorkflows } from "@/lib/actions/workflows.actions";
import { SearchParamsProps } from "@/lib/types";
import React, { useRef } from "react";

type Props = SearchParamsProps;

const WorkflowsPage = async ({ searchParams }: Props) => {
  const workflows = await onGetWorkflows();

  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b justify-between">
        Workflows
        <WorkflowButton triggerClick={Boolean(searchParams?.create)} />
      </h1>

      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col m-2 gap-6">
          <MoreCreditsCard />
          {workflows?.length && workflows.length > 0 ? (
            workflows.map((workflow) => (
              <WorkflowCard key={workflow.id} {...workflow} />
            ))
          ) : (
            <div className="mt-28 flex text-muted-foreground items-center justify-center">
              No Workflows
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default WorkflowsPage;
