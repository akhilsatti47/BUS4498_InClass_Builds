# Analyze milestone health Task Specification

## Basic Information

- **Task ID:** T6
- **Task name:** Analyze milestone health
- **Task type:** Reason
- **Task owner:** HackTrack

## 1. Task Description

This task evaluates the current health of a project milestone using the complete project update, project context, approved milestone criteria, deadlines, dependencies, reported blockers, and risks. It classifies the milestone as on track, at risk, blocked, or requiring human judgment. The analysis must be based on available evidence and must identify uncertainty rather than invent missing information. This task does not create the next-action plan or apply project changes.

## 2. Inputs

### Input 1

- **Input name:** Project update record
- **Contents and format:** A structured record containing the project identifier, milestone reference, current progress information, reported risks or blockers, source, timestamp, and workflow-run identifier.
- **Source:** T1: Receive project update
- **If a required input is missing or invalid:** Record that milestone health cannot be analyzed and hand the case to the hackathon team lead.

### Input 2

- **Input name:** Project context
- **Contents and format:** A structured project record containing open tasks, task owners, milestone deadlines, dependencies, approved project scope, previous status records, and milestone criteria.
- **Source:** T2: Retrieve project context
- **If a required input is missing or invalid:** Record that milestone health cannot be analyzed and hand the case to the hackathon team lead.

### Input 3

- **Input name:** Completeness assessment
- **Contents and format:** A structured result confirming that the project update contains the required information and identifying any remaining uncertainty.
- **Source:** T3: Check update completeness
- **If a required input is missing or indicates an incomplete update:** Do not analyze milestone health. Return the case to the missing-information path through D1 or hand it to the hackathon team lead if the workflow state is inconsistent.

## 3. Outputs

### Output 1

- **Output name:** Milestone health assessment
- **Contents and format:** A structured assessment containing the project identifier, milestone status, supporting evidence, blockers, risks, dependencies, projected completion date, uncertainty, and rationale for classifying the milestone as on track, at risk, blocked, or requiring human judgment.
- **Next task or recipient:** D2: What response is needed?
- **Complete when:** The available evidence has been evaluated using the approved milestone criteria and the assessment contains one status classification with supporting evidence and clearly identified uncertainty.

## 4. Planned Tools

### Tool 1

- **Tool name:** Analyze milestone health
- **Input:** Project update record, project context, and completeness assessment
- **Output:** Milestone health assessment
- **Implementation Route:** Functions or scripts with an AI model call
- **Integration approach:** Direct integration
- **Role in this task:** Summarize the available evidence, compare progress with approved milestone criteria and deadlines, identify blockers and risks, and classify milestone health using the predefined categories. The tool may interpret evidence but may not approve scope changes or apply project updates.
- **Task timeout:** 3 minutes maximum for one task run.
- **Maximum retries:** 1
- **Retry only when:** The analysis request times out or returns a temporary model, network, or service error. Wait 10 seconds before retrying. Do not retry solely because the evidence is ambiguous or indicates that human judgment is required.
- **On timeout, exhausted retries, or an error that cannot be retried:** Record that milestone health could not be determined and hand the case to the hackathon team lead for human review. Do not continue to D2 as if the analysis succeeded.



