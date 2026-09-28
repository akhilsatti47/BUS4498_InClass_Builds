# Send missing-information request Task Specification

## Basic Information

- **Task ID:** T4
- **Task name:** Send missing-information request
- **Task type:** Act
- **Task owner:** HackTrack

## 1. Task Description

This task sends a clear request for the information required to evaluate an incomplete project update. It identifies the missing fields, explains what information is needed, identifies the project and milestone, and sends the request to the appropriate project team member. It does not evaluate the milestone or continue the workflow without the missing information.

## 2. Inputs

### Input 1

- **Input name:** Completeness assessment
- **Contents and format:** A structured assessment identifying the missing or invalid fields in the project update and explaining why they are needed.
- **Source:** T3: Check update completeness
- **If a required input is missing or invalid:** Record the unresolved input and hand the case to the hackathon team lead. Do not send an incomplete or inaccurate request.

### Input 2

- **Input name:** Project context
- **Contents and format:** A structured project record containing the project identifier, milestone reference, responsible team member or team contact, and approved communication channel.
- **Source:** T2: Retrieve project context
- **If a required input is missing or invalid:** Record that the recipient or communication channel cannot be determined and hand the case to the hackathon team lead.

## 3. Outputs

### Output 1

- **Output name:** Missing-information request confirmation
- **Contents and format:** A structured record containing the project identifier, missing-information list, recipient, communication channel, request content, request timestamp, delivery status, and message identifier.
- **Next task or recipient:** T5: Record pending status
- **Complete when:** The request is confirmed as sent through the approved communication channel and has a message identifier or delivery confirmation.

## 4. Planned Tools

### Tool 1

- **Tool name:** Send missing-information request
- **Input:** Completeness assessment and project context
- **Output:** Missing-information request confirmation
- **Implementation Route:** Web API call
- **Integration approach:** Direct integration
- **Role in this task:** Create and send a request containing the missing information and project details to the designated project team member through the approved communication channel.
- **Task timeout:** 2 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** The send request times out or returns a temporary network or service error. Wait 10 seconds before retrying. Use the project identifier and workflow-run identifier as an idempotency key so a retry cannot send a duplicate request. If the first attempt has an uncertain result, check the message or delivery status before retrying.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record that the request was not confirmed as sent and hand the case to the hackathon team lead. Do not continue to T5 as if the request succeeded.
