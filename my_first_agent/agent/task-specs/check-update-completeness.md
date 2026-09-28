# Check update completeness Task Specification

## Basic Information

- **Task ID:** T3
- **Task name:** Check update completeness
- **Task type:** Decide
- **Task owner:** HackTrack

## 1. Task Description

This task checks whether the received project update contains the information required to evaluate milestone progress. It compares the update with the required fields and project context, including the project identifier, milestone reference, current progress, risks, blockers, dependencies, and projected completion information. It produces a complete or incomplete result and identifies any missing or invalid fields.

## 2. Inputs

### Input 1

- **Input name:** Project update record
- **Contents and format:** A structured record containing the project identifier, milestone reference when available, submitted progress information, reported risks or blockers, source, timestamp, and workflow-run identifier.
- **Source:** T1: Receive project update
- **If a required input is missing or invalid:** Record that the update cannot be evaluated and hand the case to the hackathon team lead. Do not classify the update as complete.

### Input 2

- **Input name:** Project context
- **Contents and format:** A structured project record containing the project identifier, milestone reference, required reporting fields, current tasks, deadlines, dependencies, and previous status records.
- **Source:** T2: Retrieve project context
- **If a required input is missing or invalid:** Record that completeness cannot be checked and hand the case to the hackathon team lead.

## 3. Outputs

### Output 1

- **Output name:** Completeness assessment
- **Contents and format:** A structured result stating whether the update is complete, listing missing or invalid fields when applicable, and explaining the checks performed.
- **Next task or recipient:** D1: Is the update complete?
- **Complete when:** Every required field has been checked and the result clearly states complete or incomplete with supporting reasons.

## 4. Planned Tools

### Tool 1

- **Tool name:** Check update completeness
- **Input:** Project update record and project context
- **Output:** Completeness assessment
- **Implementation Route:** Functions or scripts
- **Integration approach:** Direct integration
- **Role in this task:** Compare the received project update with the required fields and project context, then return a complete or incomplete assessment with any missing or invalid fields.
- **Task timeout:** 2 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** The validation operation times out or returns a temporary system error. Wait 10 seconds before retrying. Do not retry solely because information is missing from the project update.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record that completeness could not be determined and hand the case to the hackathon team lead. Do not continue to D1 as if the validation succeeded.



