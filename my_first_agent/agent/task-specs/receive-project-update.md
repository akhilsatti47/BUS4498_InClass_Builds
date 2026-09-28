# Receive project update Task Specification

## Basic Information

- **Task ID:** T1
- **Task name:** Receive project update
- **Task type:** Retrieve
- **Task owner:** HackTrack

## 1. Task Description

This task receives a project update or scheduled milestone-review event that starts the workflow. It captures the project identifier, milestone reference, submitted progress information, reported risks or blockers, source, and timestamp in a standard structured format. It accepts incomplete updates so that T3 can check their completeness, but it rejects messages that cannot be associated with a project.

## 2. Inputs

### Input 1

- **Input name:** Project update event
- **Contents and format:** A submitted project update, scheduled-review event, or missing-information response containing the project identifier, milestone reference when available, progress information, reported risks or blockers, source, and timestamp.
- **Source:** Team member, scheduled review system, or team member responding to a missing-information request
- **If a required input is missing or invalid:** If the event has no usable project identifier or cannot be read, record the intake failure and hand the case to the hackathon team lead. Do not create a project update record from an unidentifiable event.

## 3. Outputs

### Output 1

- **Output name:** Project update record
- **Contents and format:** A structured record containing the project identifier, milestone reference when available, submitted progress information, reported risks or blockers, event type, source, timestamp, and workflow-run identifier.
- **Next task or recipient:** T2: Retrieve project context
- **Complete when:** The event is stored or passed forward in the standard format, has a usable project identifier, and receives a unique workflow-run identifier.

## 4. Planned Tools

### Tool 1

- **Tool name:** Receive project update
- **Input:** Project update event
- **Output:** Project update record
- **Implementation Route:** Web API call
- **Integration approach:** Direct integration
- **Role in this task:** Accept the incoming update or scheduled-review event, validate its event envelope and project identifier, assign a workflow-run identifier, and store the normalized project update record.
- **Task timeout:** 2 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** The intake request times out or returns a temporary network or service error. Wait 10 seconds before retrying. Use the event identifier as an idempotency key so a retry cannot create a duplicate project update record. If the first attempt has an uncertain result, check whether the event was already recorded before retrying.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record the intake failure and hand the case to the hackathon team lead. Do not continue to T2 as if the update was received.



