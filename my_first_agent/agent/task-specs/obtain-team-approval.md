# Obtain team approval Task Specification

## Basic Information

- **Task ID:** T8
- **Task name:** Obtain team approval
- **Task type:** Decide
- **Task owner:** Designated hackathon team member

## 1. Task Description

This task requires a human team member to review the proposed next-action plan and either approve it or provide feedback for revision. The reviewer checks whether the plan addresses the milestone’s blockers, uses reasonable suggested owners and deadlines, and remains consistent with the project’s approved scope. The reviewer does not apply coordination updates or approve changes to project scope.

## 2. Inputs

### Input 1

- **Input name:** Proposed next-action plan
- **Contents and format:** A structured plan containing prioritized next actions, suggested owners, deadlines, dependencies, rationale, supporting evidence, and unresolved issues.
- **Source:** T7: Draft next-action plan
- **If a required input is missing or invalid:** Record that the plan cannot be reviewed and hand the case to the hackathon team lead. Do not treat the plan as approved.

## 3. Outputs

### Output 1

- **Output name:** Approved next-action plan
- **Contents and format:** The proposed plan with the reviewer’s approval, approval timestamp, reviewer identity, and any conditions or comments.
- **Next task or recipient:** T10: Verify scope and boundary compliance
- **Complete when:** The designated team member explicitly approves the plan and the approval is recorded.

### Output 2

- **Output name:** Plan revision feedback
- **Contents and format:** A structured response identifying the changes, questions, or concerns that must be addressed before approval.
- **Next task or recipient:** T7: Draft next-action plan
- **Complete when:** The reviewer provides specific feedback and the plan is marked not approved for revision.

## 4. Planned Tools

### Tool 1

- **Tool name:** Not applicable — manual task.
- **Input:** Proposed next-action plan
- **Output:** Approved next-action plan or plan revision feedback
- **Implementation Route:** Not applicable — manual task.
- **Integration approach:** Not applicable — manual task.
- **Role in this task:** A designated hackathon team member reviews the plan and records approval or feedback. The human makes the decision; software does not approve the plan.
- **Task timeout:** Human response deadline of 1 business day after assignment.
- **Maximum retries:** Not applicable — manual task.
- **Retry only when:** Not applicable — manual task.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record that no approval was received and hand the case to the hackathon team lead or designated backup reviewer. A missed deadline is not approval.
