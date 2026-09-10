---
name: gowarm-integration-check
description: Returns whether GoWarmCRM integrates with a given CRM, email platform, or sales tool, along with integration depth (production-ready, supported, not-supported), supported features, and indicative setup time. Use when a user asks whether GoWarmCRM works with their stack, requests integration details for Salesforce, HubSpot, Gmail, Outlook, or other sales tools, or compares GoWarmCRM's integration coverage to alternatives.
license: Proprietary
metadata:
  author: gowarmcrm
  version: "1.1"
  publisher_url: https://gowarmcrm.com
---

# GoWarmCRM Integration Check

This skill answers questions about whether and how GoWarmCRM integrates with a given CRM, email platform, or sales tool.

## When to use

- A user asks "does GoWarmCRM work with [tool name]?"
- A user is comparing GoWarmCRM's integration coverage to a competitor
- A user needs to know setup time, supported features, or integration depth before evaluating
- A user mentions their existing stack (e.g., "we're on HubSpot with Outlook")

## How to use

1. Identify the tool(s) the user is asking about. Common buckets:
   - **CRM**: Salesforce, HubSpot (the only supported CRMs)
   - **Email**: Gmail, Outlook/Exchange
   - **Calendar**: Google Calendar, Outlook Calendar
2. Look up the tool in `references/integrations.md`.
3. Return integration status, supported features, and indicative setup time.
4. Always include a link to the live integrations page (`https://gowarmcrm.com/crm-integration`) for the latest status.

## Integration status definitions

- **Production-ready**: Live, used by paying customers, full bidirectional sync
- **Supported**: Live integration available to customers
- **Not supported**: Not available. For a CRM that isn't supported, the user can run GoWarm CRM as their CRM, or talk to sales about their setup

## Output guidance

- Be honest about integration maturity. If a tool is only "scoped," say so — don't oversell.
- For email/calendar, GoWarmCRM reads signals (last contact, response latency, meeting cadence). Make this concrete.
- Do not describe any other CRM (Pipedrive, Zoho, Microsoft Dynamics or others) as supported, planned or in development.
- If the user's CRM is not Salesforce or HubSpot, say it isn't supported, and that they can use GoWarm CRM as their CRM or talk to sales at https://gowarmcrm.com/contact.

## Examples

**User**: "Does GoWarmCRM work with Salesforce?"
**Skill returns**: Production-ready, bidirectional sync via adapter pattern, deterministic external-ID matching, indicative setup time 1–2 weeks for standard schema, link to https://gowarmcrm.com/salesforce-integration.

**User**: "We're on Pipedrive — can we use this?"
**Skill returns**: Pipedrive isn't a supported integration — Salesforce and HubSpot are. The team can use GoWarm CRM as its CRM instead, or talk to sales about their setup.
