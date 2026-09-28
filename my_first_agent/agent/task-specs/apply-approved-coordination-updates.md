# Apply approved coordination updates Task Specification

## Basic Information

- **Task ID:** T9
- **Task name:** Apply approved coordination updates
- **Task type:** Act
- **Task owner:** HackTrack

## 1. Task Description

This task applies only the coordination updates that were explicitly approved by a team member and verified as within the approved project scope and system boundaries. It may update approved internal project records, such as task status, documented next actions, or coordination notes. It does not change project scope, submit work, contact external parties, or reassign work without explicit approval.

## 2. Inputs

### Input 1

- **Input name:** Approved next-action plan
- **Contents and format:** A structured plan containing the approved next actions, suggested owners, deadlines, dependencies, approval status, reviewer identity, and approval timestamp.
- **Source:** T8: Obtain team approval
- **If a required input is missing or invalid:** Record that the plan cannot be applied and hand the case to the hackathon team lead. Do not make any coordination changes.

### Input 2

- **Input name:** Scope compliance verdict
- **Contents and format:** A structured verdict confirming that the approved plan is within the approved project scope and system boundaries, including supporting evidence and any restrictions.
- **Source:** T10: Verify scope and boundary compliance
- **If a required input is missing or invalid:** Record that scope compliance was not confirmed and hand the case to the hackathon team lead. Do not make any coordination changes.

## 3. Outputs

### Output 1

- **Output name:** Applied coordination update result
- **Contents and format:** A structured result listing each approved update, its application status, affected project record, timestamp, workflow-run identifier, and any unresolved errors or partially completed actions.
- **Next task or recipient:** T11: Record workflow outcome
- **Complete when:** Every approved and compliant coordination update is either applied successfully or clearly recorded as unresolved, and the result is available for T11.

## 4. Planned Tools

### Tool 1

- **Tool name:** Apply approved coordination updates
- **Input:** Approved next-action plan and scope compliance verdict
- **Output:** Applied coordination update result
- **Implementation Route:** Database queries and web API calls
- **Integration approach:** Direct integration
- **Role in this task:** Apply only the approved and verified coordination updates to internal project records. Use the workflow-run identifier and action identifier to prevent duplicate changes.
- **Task timeout:** 5 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** An update request times out or returns a temporary database, network, or service error. Wait 10 seconds before retrying. Before retrying, check whether the specific update was already applied. Use an idempotency key based on the workflow-run identifier and action identifier so a retry cannot duplicate a state change.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record the failed or uncertain update, identify any partial changes, and hand the case to the hackathon team lead. Do not continue as if all approved updates were applied successfully.



