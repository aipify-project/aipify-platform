# Unified Task & Follow-Up Engine FAQ

## FAQ 1

**Question:** Can Aipify assign tasks automatically?

**Answer:** Yes. Approved workflows may automatically create and assign tasks via `create_task_from_source()`. Workflow triggers require human approval — Aipify prepares tasks; humans confirm ownership and execution.

## FAQ 2

**Question:** Can Aipify remind users about unfinished work?

**Answer:** Yes. Reminders and follow-up notifications can be configured through `schedule_task_reminder()`. Reminder metadata is stored in `organization_task_reminders` — no raw message content or PII.

## FAQ 3

**Question:** Can tasks appear in calendars?

**Answer:** Yes. Supported calendar integrations can synchronize deadlines and reminders via `sync_task_calendar_hook()`. This is a scaffold that links to Google Calendar, Microsoft Outlook, Apple Calendar, and the Aipify internal calendar — Context Engine orchestrates external calendars; Aipify never replaces them.

## FAQ 4

**Question:** Are task activities audited?

**Answer:** Yes. Significant task activities are recorded through `_utfe_log()` and `_ala_should_audit()` action types including creation, assignment, status changes, escalations, reminders, calendar sync requests, and completions.
