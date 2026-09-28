# Draft next-action plan Task Specification

```yaml
# BASIC INFORMATION
task_id: "T7"
task_name: "Draft next-action plan"
task_owner: "Hackathon team lead"

# Agent Inference Configuration
Provider: Groq
Model: "llama-3.3-70b-versatile"
Role: Inspect blockers, analyze dependency impact, and propose next actions within approved project scope
Maximum inference requests per task run: 6
On inference failure or exhausted limits: Record the unresolved status and hand the case to the hackathon team lead.
```

## 1. Task Goal

- **Objective:** Produce a prioritized set of next actions with suggested owners that addresses the milestone’s most important blockers and supports completion by its deadline, without changing the approved project scope or taking unapproved external actions.

## 2. Inbound Inputs

T7 receives the milestone health assessment from T6 and the project context from T2 so it can create a prioritized next-action plan based on current blockers, dependencies, deadlines, task owners, and approved project scope.

### Input 1

- Input name: Milestone health assessment
- What it contains: The current milestone status, supporting evidence, identified blockers, risks, dependencies, and projected completion date.
- Source: T6: Analyze milestone health

### Input 2 
- Input name: Project context
- What it contains: Open tasks, task owners, deadlines, dependencies, approved project scope, and previous status records.
- Source: T2: Retrieve project context

## 3. Tool Permissions and Boundaries

### Task-Wide Limits

- **Total task timeout:** 10 minutes, including inference requests, tool calls, retries, and waiting.
- **Maximum tool calls:** 6 total calls during one task run.

### Tool 1

- **Tool name:** `retrieve_project_records`
- **Input:** Project context and milestone health assessment
- **Output:** Current project evidence for next-action planning
- **Implementation Route:** Database queries
- **Integration approach:** Direct integration
- **Role in this task:** Supports inspecting blocker evidence, analyzing dependency impact, and proposing next actions.
- **Allowed use:** Read approved project-board, milestone, task, deadline, dependency, and status records already supplied by T2 and T6.
- **Prohibited use:** Do not change tasks, reassign work, change project scope, submit work, send messages, or access unapproved records.
- **Approval required:** None for read-only access; team-lead approval is required before any proposed changes are applied.
- **Task timeout:** 10 minutes maximum for the task run.
- **Maximum retries:** 1
- **Retry only when:** A read-only query times out or returns a temporary system error. Wait 10 seconds before retrying. Do not retry solely because required information is missing.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record the unresolved status and hand the case to the hackathon team lead. Do not continue as if the tool succeeded.

## 4. How the Agent Should Reason

### Permitted Subtask 1

- Subtask name: Inspect blocker evidence
- Subtask description: Examine the milestone health assessment, task statuses, blocker notes, deadlines, and dependencies to identify the most important supported blocker or uncertainty.
- Subtask boundary: Use only the project context supplied by T2 and the assessment supplied by T6. The agent may interpret records but may not change tasks, deadlines, project scope, or contact anyone.
- Retry limits: Attempt at most two additional times when the available evidence is unclear or contradictory. If required information is absent, do not repeat this subtask solely to search for it; select another permitted subtask or hand the case to the hackathon team lead.

### Permitted Subtask 2

- Subtask name: Analyze dependency impact
- Subtask description: Examine relationships among open tasks, owners, deadlines, and dependencies to determine which work is most likely to delay the milestone.
- Subtask boundary: The agent may compare records and estimate schedule impact within the approved project scope. It may not alter dependencies, reassign work, or approve scope changes.
- Retry limits: Attempt at most one additional time. If the dependency impact cannot be determined reliably, hand the case to the hackathon team lead.

### Permitted Subtask 3

- Subtask name: Propose next actions
- Subtask description: Use the available findings to produce a prioritized set of next actions with suggested owners, deadlines, dependencies, and supporting rationale. Rank actions by urgency, impact on the milestone deadline, ability to unblock dependent work, and fit within the approved project scope.
- Subtask boundary: The agent may draft recommendations within the approved project scope. It may not change scope, submit work, send external communications, or apply task-board changes without team approval.
- Retry limits: Attempt at most two additional times. If the recommendations remain unsupported or would require an out-of-scope action, hand the case to the hackathon team lead.

- **Decision guidance:** After each subtask, use its findings to select the permitted subtask most likely to resolve the most important remaining uncertainty. Do not follow a fixed sequence. If no permitted subtask can make useful progress, stop and hand the case to a person.

## 5. When to Stop or Hand Off to a Human

- Stop successfully when the agent has produced a prioritized next-action plan with supported recommendations, suggested owners, deadlines, dependencies, and evidence showing that the plan remains within the approved project scope.
- Hand off early when required project information is missing or contradictory, no useful next action can be identified within the permitted limits, the recommendation would change project scope, an external action is required, or the agent cannot support its recommendation with sufficient evidence.
- Hand off to: Hackathon team lead.

Stop at the first applicable budget limit or handoff condition. While awaiting review, take no further autonomous action.

## 6. Outbound Deliverable

- Status: Completed or escalated to human.
- Result or recommendation: A prioritized next-action plan listing recommended actions, suggested owners, deadlines, dependencies, and supporting rationale.
- Evidence summary: The project records and milestone findings that support the recommended plan.
- Subtasks performed: The permitted subtasks completed, including any repeated attempts.
- Unresolved issues: Remaining uncertainties, missing information, or conflicting evidence.
- Handoff note: The reason for escalation and the specific decision or information needed from the hackathon team lead; write “Not applicable” for a completed task.
- Next task or recipient: T8: Obtain team approval. Unresolved cases go to the hackathon team lead.
