# KoboSats Frontend TODO List 

##  Features & Integrations
- [ ] **USSDDemo.jsx**: Clean up emulator state management and ensure clear transitions between states.
- [ ] **Send Sats Flow**: Implement the send transaction logic, including recipient address/phone validation and `api.js` hookup.

## Bug Fixes & Refinements
- [ ] **Settings.jsx**: Debug the wallet recovery menu; ensure the "reveal" and "hide" toggle logic works reliably.
- [ ] **UI Fixes (Dashboard & Debts)**:
    - [ ] Restrict "Hide Balance" tooltip to appear *only* on hover.
    - [ ] Restrict "Refresh" button tooltip to appear *only* on hover.
    - [ ] Ensure consistent tooltip behavior across both pages.

##  Polish
- [ ] Audit all API calls to ensure `user` context is passed correctly to every protected route.
- [ ] Verify production build (npm run build) to catch any lingering typescript/linting errors before demo.
