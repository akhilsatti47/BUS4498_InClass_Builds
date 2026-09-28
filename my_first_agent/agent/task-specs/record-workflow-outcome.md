# Record workflow outcome Task Specification

## Basic Information

- **Task ID:** T11
- **Task name:** Record workflow outcome
- **Task type:** Remember
- **Task owner:** HackTrack

## 1. Task Description

This task creates a durable record of the completed workflow run. It records the milestone status, supporting evidence, approved next actions, suggested owners, deadlines, dependencies, approval result, and scope-verification result. If the milestone is on track, it records that status and any required next actions. The task writes only the outcome of the current workflow run and does not change project scope or apply coordination updates.

## 2. Inputs

### Input 1

- **Input name:** Milestone health result
- **Contents and format:** A structured milestone assessment containing the project status, supporting evidence, blockers, risks, dependencies, and projected completion date.
- **Source:** T6: Analyze milestone health
- **If a required input is missing or invalid:** Record the missing input and hand the case to the hackathon team lead. Do not record the workflow as successfully completed.

### Input 2

- **Input name:** Final coordination result
- **Contents and format:** A structured result showing the approved next-action plan, suggested owners, deadlines, applied coordination updates, and scope-verification result. This input is required when coordination updates were applied.
- **Source:** T9: Apply approved coordination updates
- **If a required input is missing or invalid:** Record the unresolved status and hand the case to the hackathon team lead. Do not record the workflow as successfully completed.

## 3. Outputs

### Output 1

- **Output name:** Workflow outcome record
- **Contents and format:** A durable structured record containing the project identifier, milestone status, supporting evidence, next actions, suggested owners, deadlines, dependencies, approval status, scope-verification result, unresolved issues, and workflow completion status.
- **Next task or recipient:** Project status record and the hackathon team lead
- **Complete when:** The outcome record is saved successfully, can be retrieved using the project and workflow-run identifiers, and contains all required status and outcome fields.

## 4. Planned Tools

### Tool 1

- **Tool name:** Record workflow outcome
- **Input:** Milestone health result and final coordination result
- **Output:** Workflow outcome record
- **Implementation Route:** Database write
- **Integration approach:** Direct integration
- **Role in this task:** Save the final status, evidence, approved next actions, coordination result, and unresolved issues in the project status record.
- **Task timeout:** 2 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** The write times out or returns a temporary database or network error. Wait 10 seconds before retrying. Use the project identifier and workflow-run identifier as an idempotency key so a retry cannot create a duplicate outcome record. If the result of the first write is uncertain, check whether the record already exists before retrying.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record the unresolved write status and hand the case to the hackathon team lead. Do not report the workflow as complete unless the outcome record is confirmed.
