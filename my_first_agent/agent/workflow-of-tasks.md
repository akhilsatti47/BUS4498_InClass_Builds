# Workflow of Tasks

## 1. Workflow Overview
### 1.1 Workflow Goal
This workflow supports the system goal defined in `my_first_agent/README.md`.

### 1.2 Workflow Trigger

The workflow begins when a team member submits a project update, HackTrack performs a scheduled milestone review, or missing information is received for a pending review.

### 1.3 Completion Condition at Runtime

The workflow is complete when the milestone status and next actions are recorded. If information is missing, HackTrack sends a request for the missing details and records the project as pending. When the missing information is received, the workflow resumes with a new run.

### 1.4 General Workflow

HackTrack receives a project update and retrieves the project board, milestone deadlines, task assignments, dependencies, and previous status records. It checks whether the update contains enough information to evaluate progress. If information is missing, HackTrack sends a request for the missing details and records the project as pending. When the missing information is received, the workflow resumes with a new run.

If the information is complete, HackTrack analyzes milestone health and classifies the project as on track, at risk, blocked, or requiring human review. If the milestone is on track, HackTrack records the outcome. If it is at risk or blocked, HackTrack drafts recommended next actions with suggested owners and deadlines. A team member reviews the plan and provides approval or feedback. If rejected, the feedback returns the plan to HackTrack for revision. If approved, HackTrack verifies that the plan is within the approved scope and boundaries before applying the coordination updates. Cases outside the approved scope are sent for human review.

### 1.5 Workflow Diagram

```mermaid
flowchart TD
    S(("Start: project update, scheduled review, or missing information received"))
    T1[T1: Retrieve project update]
    T2[T2: Retrieve project context]
    T3[T3: Check update completeness]
    D1{Is the update complete?}
    T4[T4: Send missing information request]
    T5[T5: Record pending status]
    E1((End: waiting for information))
    T6[T6: Analyze milestone health]
    D2{What response is needed?}
    T7[T7: Draft next-action plan]
    T8[T8: Obtain team approval]
    D3{Is the plan approved?}
    T10[T10: Verify scope and boundary compliance]
    D4{Is the plan within approved scope and boundaries?}
    T9[T9: Apply approved coordination updates]
    T11[T11: Record workflow outcome]
    E2((End: outcome recorded))
    E3((End: human review required))

    S --> T1 --> T2 --> T3 --> D1
    D1 -- No --> T4 --> T5 --> E1
    E1 -. "Missing information received" .-> S
    D1 -- Yes --> T6 --> D2
    D2 -- On track --> T11
    D2 -- At risk or blocked --> T7 --> T8 --> D3
    D2 -- Requires judgment --> E3
    D3 -- No: feedback received --> T7
    D3 -- "Yes" --> T10 --> D4
    D4 -- "No" --> E3
    D4 -- "Yes" --> T9 --> T11 --> E2
```
