import { onGetWorkflows } from "@/lib/actions/workflows.actions";
import WorkflowsRedirect from "./_components/workflows-redirect";

const WorkflowEditorPage = async () => {
  const userWorkflows = await onGetWorkflows();

  return <WorkflowsRedirect workflows={userWorkflows} />;
};

export default WorkflowEditorPage;
