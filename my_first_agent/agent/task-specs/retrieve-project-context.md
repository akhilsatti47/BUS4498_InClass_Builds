# Retrieve project context Task Specification

## Basic Information

- **Task ID:** T2
- **Task name:** Retrieve project context
- **Task type:** Retrieve
- **Task owner:** HackTrack

## 1. Task Description

This task retrieves the current project information needed to evaluate milestone progress. It uses the project update to locate the correct project records and returns the project board, open tasks, task owners, deadlines, dependencies, approved project scope, and previous status records. The task uses read-only lookups and does not change project records.

## 2. Inputs

### Input 1

- **Input name:** Project update
- **Contents and format:** A structured project update containing the project identifier, reporting period, milestone reference, current progress information, and any reported risks or blockers.
- **Source:** T1: Receive project update
- **If a required input is missing or invalid:** Record that the project context cannot be retrieved and send the case to the hackathon team lead for clarification.

## 3. Outputs

### Output 1

- **Output name:** Project context
- **Contents and format:** A structured project record containing open tasks, task owners, milestone deadlines, dependencies, approved project scope, and previous status records.
- **Next task or recipient:** T3: Check update completeness
- **Complete when:** The context record is retrieved for the correct project and contains all available required fields, or the unavailable fields are clearly identified.

## 4. Planned Tools

### Tool 1

- **Tool name:** Retrieve project context
- **Input:** Project update
- **Output:** Project context
- **Implementation Route:** Database queries
- **Integration approach:** Direct integration
- **Role in this task:** Retrieve read-only project, milestone, task, deadline, dependency, scope, and status records associated with the project update.
- **Task timeout:** 2 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** The query times out or returns a temporary database or network error. Wait 10 seconds before retrying. Do not retry when the project identifier is missing or invalid.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record the context-retrieval failure and hand the case to the hackathon team lead. Do not continue as if the project context was successfully retrieved.
