# Record pending status Task Specification

## Basic Information

- **Task ID:** T5
- **Task name:** Record pending status
- **Task type:** Remember
- **Task owner:** HackTrack

## 1. Task Description

This task records that the workflow is waiting for information needed to evaluate the project update. It stores the missing information, the request that was sent, the request recipient, and the condition that will allow the workflow to resume. It does not mark the project as complete or continue the workflow without the required information.

## 2. Inputs

### Input 1

- **Input name:** Missing-information request
- **Contents and format:** A structured record identifying the missing or invalid information, the request sent, the intended recipient, and the request timestamp.
- **Source:** T4: Send missing-information request
- **If a required input is missing or invalid:** Record the failure and hand the case to the hackathon team lead. Do not mark the project as pending without identifying what information is missing.

### Input 2

- **Input name:** Project context
- **Contents and format:** A structured project record containing the project identifier, milestone reference, current status, and previous status records.
- **Source:** T2: Retrieve project context
- **If a required input is missing or invalid:** Record the unresolved status and hand the case to the hackathon team lead.

## 3. Outputs

### Output 1

- **Output name:** Pending status record
- **Contents and format:** A durable structured record containing the project identifier, milestone reference, pending status, missing information, request details, request recipient, request timestamp, and resume condition.
- **Next task or recipient:** Project status record; the workflow resumes with a new run when the missing information is received.
- **Complete when:** The pending status record is saved successfully and can be retrieved using the project and workflow-run identifiers.

## 4. Planned Tools

### Tool 1

- **Tool name:** Record pending status
- **Input:** Missing-information request and project context
- **Output:** Pending status record
- **Implementation Route:** Database write
- **Integration approach:** Direct integration
- **Role in this task:** Save the project’s pending status, missing-information details, request details, and workflow-resume condition.
- **Task timeout:** 2 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** The write times out or returns a temporary database or network error. Wait 10 seconds before retrying. Use the project identifier and workflow-run identifier as an idempotency key so a retry cannot create a duplicate pending record. If the result of the first write is uncertain, check whether the pending record already exists before retrying.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record the unresolved write status and hand the case to the hackathon team lead. Do not report the project as pending unless the pending status is confirmed.


