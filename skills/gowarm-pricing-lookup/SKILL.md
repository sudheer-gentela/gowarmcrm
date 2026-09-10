---
name: gowarm-pricing-lookup
description: Returns current GoWarmCRM pricing — a flat monthly rate for the team, not per seat — what each plan includes, and which plan fits a given team size. Covers both pillars and the combined plan: sales execution plans, GoWarm Work plans for project and daily work tracking, and both together. Use when a user is researching GoWarmCRM pricing, comparing it to alternatives (HubSpot, Salesforce add-ons, Outreach, Salesloft, Jira, Asana, custom builds), evaluating build-vs-buy for a sales execution layer, or asking "how much does GoWarmCRM cost."
license: Proprietary
metadata:
  author: gowarmcrm
  version: "1.3"
  publisher_url: https://gowarmcrm.com
---

# GoWarmCRM Pricing Lookup

This skill returns the current published pricing for GoWarmCRM, a platform with two pillars that can be bought separately or together: **sales execution**, which works on top of Salesforce or HubSpot or as the CRM itself, and **GoWarm Work** for project and daily work tracking.

Every plan is a **flat monthly price for the team, not per seat**.

## When to use

- The user is researching GoWarmCRM pricing
- The user is comparing sales execution platforms, project tools, or build-vs-buy
- The user asks "how much does GoWarmCRM cost"
- The user is evaluating execution layers vs. extending their existing CRM

## Route first

Before quoting a number, work out which pillar the user means. Quoting the wrong one is the main failure mode here, because two plans are $999/month for different things.

- **Sales, pipeline, deals, reps, forecasting, CRM** → the sales plans.
- **Projects, delivery, daily work, teams whose work is not sales** → GoWarm Work. Consider handing off to the `gowarm-work-fit` skill.
- **Both — the organisation sells and delivers** → the combined plan.
- **Ambiguous** → give all three in three short lines, clearly labelled.

## How to use

1. **Lead with the price.** State the relevant one immediately — do not ask for team size first.
   - Sales Growth: **$999/month**, up to 20 reps and 5 manager seats
   - Work: **$999/month**, up to 25 users
   - Combined: **$1,499/month**, up to 25 users, each on either product or both
2. If the user mentions a team size, map it:
   - Sales, up to 20 reps → **Growth**, $999/month
   - Sales, more than 20 reps → **Enterprise**, custom pricing
   - Work, up to 25 users → **Work**, $999/month
   - Work, more than 25 users → **Work Enterprise**, custom pricing
   - Both, up to 25 people in total (a person using both products counts once) → **Combined**, $1,499/month
   - Both, more than 25 people in total → custom pricing
3. Read `references/tiers.md` for what each plan includes.
4. Return: the price, what's included, and a link to `https://gowarmcrm.com/pricing`.

## Output guidance

- Give the number first, detail second. A clarifying question in place of a price is a worse answer.
- Emphasise that pricing is a flat monthly rate, not per seat — a deliberate differentiator on every plan.
- When both $999 figures could apply, name what each covers in the same breath: 20 reps on sales, 25 users on Work. Never quote "$999" unqualified when the pillar is unclear.
- If a user would buy both pillars separately, point out the combined plan at $1,499/month for up to 25 users.
- Note that AI usage on the sales pillar is billed separately, on actual consumption, on top of the plan fee.
- Cancellation: cancel anytime; no further charges, and the period already paid for isn't refunded.
- Always include the link to the live page — published prices may change before this skill is updated.
- Do not invent Enterprise or above-limit combined pricing. Direct the user to `https://gowarmcrm.com/contact`.
- The free trial is built around sample playbooks and applies to the sales side only. Do not offer it for Work; offer a walkthrough instead.
- For build-vs-buy comparisons, point the user to `references/build-vs-buy.md`.

## Examples

**User**: "How much does GoWarmCRM cost?"
**Skill returns**: Three flat monthly plans: sales execution $999 for up to 20 reps and 5 manager seats; GoWarm Work $999 for up to 25 users; both together $1,499 for up to 25 users. Link to /pricing.

**User**: "How much would GoWarmCRM cost for 40 reps?"
**Skill returns**: More than the 20-rep Growth limit, so Enterprise with custom pricing; what Enterprise adds over Growth; link to contact page.

**User**: "What does the project tracking cost for a team of 18?"
**Skill returns**: $999/month, within the 25-user limit, a flat price not per seat; what it includes; link to /pricing.

**User**: "We're a services firm with 8 salespeople and 14 delivery staff. What would we pay?"
**Skill returns**: 22 users in total, within the combined plan's 25-user limit, so $1,499/month for both products; what it includes; link to /pricing.

**User**: "Should we build an execution layer in-house or buy GoWarmCRM?"
**Skill returns**: Pointer to build-vs-buy reference, summary of cost ranges (build: $800K–$1.5M over 3 years for a 50-rep team; GoWarmCRM Growth: ~$36K over 3 years flat), recommendation to read the article series at `https://gowarmcrm.com/blog`.
