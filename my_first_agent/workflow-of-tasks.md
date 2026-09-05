# Workflow of Tasks

*Replace all bracketed prompts with information specific to your proposed system. Delete instructional text that does not belong in your final specification. Add or remove task sections as needed. Every task shown in the general workflow must have a corresponding task specification below.*

## 1. Workflow Overview
### 1.1 Workflow Goal
This workflow supports the system goal defined in `my_first_agent/README.md`.

### 1.2 Workflow Trigger

[The workflow begins when a team member submits a project update or when HackTrack performs a scheduled milestone review.]

### 1.3 Completion Condition at Runtime

[The workflow is complete when the milestone status and next actions are recorded. If information is missing, the workflow ends with the project marked as pending. If a decision requires human judgment, it ends with a human-review request.

### 1.4 General Workflow

[HackTrack receives a project update and retrieves the project board, milestone deadlines, task assignments, dependencies, and previous status records. It checks whether the update contains enough information to evaluate progress. If information is missing, HackTrack drafts a request for the missing details and records the project as pending.
If the information is complete, HackTrack analyzes milestone health and classifies the project as on track, at risk, blocked, or requiring human review. It drafts recommended next actions with owners and deadlines. A team member must approve the proposed coordination changes before HackTrack applies them. HackTrack then verifies that the approved plan respects the project scope and system boundaries before recording the final outcome.]

### 1.5 Workflow Diagram

[Insert a flowchart showing the tasks in sequence. Label each task with a task number and short name. Show decision branches, loops, review points, and possible stopping conditions. Below is an example of a Mermaid. You can either edit the mermaid below yourself or ask ChatGPT to generate a Mermaid script based on your workflow description above. Give every task a unique ID, such as T1, T2, and T3, and name tasks using a verb and an object in the mermaid.]

```mermaid
```mermaid
flowchart TD
    S((Start: project update received or scheduled review))
    T1[T1: Receive project update]
    T2[T2: Retrieve project context]
    T3[T3: Check update completeness]
    D1{Is the update complete?}
    T4[T4: Draft missing-information request]
    T5[T5: Record pending status]
    E1((End: waiting for information))
    T6[T6: Analyze milestone health]
    D2{What response is needed?}
    T7[T7: Draft next-action plan]
    T8[T8: Obtain team approval]
    D3{Is the plan approved?}
    T9[T9: Apply approved coordination updates]
    T10[T10: Verify scope and boundary compliance]
    T11[T11: Record workflow outcome]
    E2((End: outcome recorded))
    E3((End: human review required))

    S --> T1
    T1 --> T2
    T2 --> T3
    T3 --> D1

    D1 -- No --> T4
    T4 --> T5
    T5 --> E1

    D1 -- Yes --> T6
    T6 --> D2

    D2 -- On track --> T11
    D2 -- At risk or blocked --> T7
    T7 --> T8
    T8 --> D3

    D2 -- Requires judgment --> E3
    D3 -- No --> E3
    D3 -- Yes --> T9
    T9 --> T10
    T10 --> T11
    T11 --> E2
```
```
