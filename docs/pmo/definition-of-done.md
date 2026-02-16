# Definition of Done (DoD)

A User Story or task is considered **Done** only when all of the following criteria are met:

## Code & Development

- [ ] Code is written and committed to the feature branch.
- [ ] Code adheres to the established coding standards and style guides.
- [ ] All code is peer-reviewed and approved by at least one other developer.
- [ ] The Pull Request has been successfully merged into the `develop` branch.

## Testing & Quality

- [ ] Unit tests are written and passing with required code coverage (≥ 80%).
- [ ] Integration tests are written and passing.
- [ ] All acceptance criteria for the user story have been met and verified.
- [ ] The feature has been successfully tested by the QA team in the Staging environment.
- [ ] No new P1 (Blocker) or P2 (Critical) bugs have been introduced.
- [ ] E2E tests for the feature are passing.

## CI/CD & Deployment

- [ ] The CI pipeline for the merged code is green (all build, test, and scan stages passed).
- [ ] The feature has been successfully deployed to the Staging environment.

## Documentation

- [ ] API documentation (OpenAPI) is updated for any new or changed endpoints.
- [ ] Technical documentation (e.g., LLD, ADRs) is updated if the change impacts architecture or design.
- [ ] User-facing documentation or release notes are updated as needed.

## Product Owner Acceptance

- [ ] The Product Owner has reviewed the feature in the Staging environment and formally accepted it as meeting the requirements.
