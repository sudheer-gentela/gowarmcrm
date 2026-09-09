# GoWarm Platform Overview

> Thirteen modules across two products on one platform. GoWarm CRM handles sales execution above your CRM; GoWarm Work handles projects and daily work. Modules are enabled per organisation, so nothing you have not bought is switched on.

## GoWarm CRM — sales execution

- **Actions (Core)** — the nightly diagnostic engine and the prioritised action queue every rep opens each morning.
- **Deals** — pipeline with stage diagnostics, stall detection and deal-level risk.
- **Accounts & Contacts** — the relationship graph behind the deals, including signal history.
- **Playbooks** — 35 stages and 147 plays, chained, surfaced at the moment of the stage transition rather than sitting in a document.
- **Contracts (CLM)** — contract action queues, renewals and commitment tracking.
- **Handovers** — sales-to-CS handover with commitments carried across and go-live tracking.
- **Service** — cases and commitments after the handover.
- **Prospecting** — outbound sequences, sender accounts, prospect inbox and hurdle scores.
- **Agent Inbox** — the agent-facing surface for the above.

## GoWarm Work — projects and daily work

- **Projects** — stages with gates, task dependencies checked for circularity at creation, a baseline frozen when the plan is committed, plan-versus-actual drift, evidence required before a task closes, and Bill of Quantities with an append-only spend ledger, procurement and variations. Timeboxed and standing work are tracked as separate modes.
- **Daily Work** — one line a day written by the person doing the work and stored once, read on their own day, against the project task, and in the manager rollup. Controlled activity vocabulary with a manager merge queue. Compliance measured against working days and a holiday calendar rather than generated tasks. Manager rollup and per-person timeline.

## How the two relate

They join at the task: an update posted on a project task *is* the person's daily work entry, not a copy of it. Beyond that they are independent. Either product runs with the other switched off, and either can be added later without migrating anything.

## What is deliberately absent

No timers, screenshots, idle detection, keystroke logging or productivity scores anywhere in the platform. On the delivery side the measure is whether work was recorded on a working day and what it was.

## Related reading
- Platform root: https://gowarmcrm.com/index.md
- GoWarm CRM: https://gowarmcrm.com/sales.md
- GoWarm Work: https://gowarmcrm.com/work.md
- Pricing: https://gowarmcrm.com/pricing.md
