# SPIC prototype architecture

## Hosted prototype

GitHub Pages serves `index.html` directly from the root of `main`. The prototype also opens locally in a browser. Styles and fictional data are embedded in the HTML. Navigation uses section links, and the reward example opens with the browser’s native disclosure control. The shared `prototype.js` script simulates waste classification and shows the manually selected demo bin location. Scan points are illustrative and do not change the sample balance. The prototype needs no build step, API calls, device location, or stored user data.

The separate `design-language.html` directory loads the prototype’s styles, SVG symbols, and component markup from `index.html` and runs previews with `prototype.js`. Open it through GitHub Pages or a local HTTP server so it can fetch the prototype markup.

| Section | Demonstrates |
| --- | --- |
| Bin scanner | Demo branch location, simulated material classification, and sample earnings |
| Resident dashboard | Accepted deposit, review hold, disposal history, and points balance |
| Rewards | Points by waste type, reward costs, eligibility, and a worked redemption example |
| Barangay report | Aggregate participation, classified deposits, and pending reviews |
| SMS and assisted access | Sample notification and barangay desk support |

## Proposed pilot system

1. The resident identifies their account at a smart bin. The bin captures sensor readings and sends a deposit event with a unique event ID, device ID, resident reference, and timestamp to a cloud service.
2. The service verifies the device and checks the event for duplicates, uncertain classifications, and suspicious patterns. Uncertain events enter a review queue. Accepted events become disposal records in the appropriate waste category.
3. Eligible accepted deposits create points credits. The service records credits and debits in a ledger and uses the event ID to prevent duplicate credits after retries.
4. Residents see their disposal history and balance. A reward claim checks the balance and reward availability, then records the claim and points debit together. The barangay desk can verify pickup and help residents check balances or claim rewards.
5. The service can send SMS notifications after confirmed changes. Authorized barangay staff can review flagged deposits and see aggregate reports without exposing household-level records in public views.

## Open pilot decisions

- Select sensors and supported waste categories based on classification accuracy, maintenance cost, and pilot conditions.
- Decide how residents identify themselves at the bin and how the bin handles connectivity outages.
- Define points eligibility, reward values, stock, review thresholds, and how staff resolve disputes.
- Confirm reward partners, SMS costs and consent, and who can access or retain resident records.
- Define pilot evaluation criteria for classification accuracy, reliability, usability, and acceptance.

Waste hauling and final processing are outside the study scope. The hosted page illustrates the flow using sample values. Pilot testing will determine whether the proposed design meets the study objectives.
