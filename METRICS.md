# Metrics

The North Star metric for SpendLens should be **qualified audits completed**. I would define that as an audit where the user selects at least two tools, enters enough spend or plan detail for the engine to produce a meaningful result, and reaches the result page. That is a better early-stage metric than raw visitors or generic signups because it measures actual value delivery. If the product is doing its job, users should complete an audit before they ever become a lead.

The three input metrics I would watch first are:

1. **Landing page to audit-start rate** — this tells me whether the promise is strong enough to earn intent.
2. **Audit-start to audit-complete rate** — this tells me whether the form is too long, confusing, or low-trust.
3. **Qualified audit to email-capture rate** — this tells me whether the result feels valuable enough to justify a follow-up.

The first instrumentation I would add is event tracking for:

- landing page CTA clicked
- tool selected
- audit generated
- result page viewed
- share link copied
- email submitted
- high-savings consultation CTA clicked

I would also tag each audit with simple dimensions like team size band, number of tools selected, use case, and savings bucket. That would let me see whether the product works better for engineering-heavy teams, mixed teams, or only a narrow slice of users.

The number that would trigger a pivot is **audit completion under 25% of audit starts after the first 100 starts**. If people are curious enough to start but not motivated enough to finish, the product is probably asking for the wrong inputs or not promising enough value. A second pivot trigger would be **email capture under 10% for audits showing more than $500/month in savings**. If even clearly high-value results do not convert into follow-up intent, then either the trust is weak, the copy is wrong, or the product is surfacing savings that users do not believe.
