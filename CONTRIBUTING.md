
# Contributing Guidelines

Thanks for your interest in contributing!  
Before jumping in, please take a moment to read these short notes to make collaboration smoother for everyone.

---

## 1. Discussion Before Development

**Always open an issue before starting any new feature or change.**

This helps avoid wasted work and ensures that:
- The idea fits within the project's goals.
- The syntax and API design are consistent with existing features.
- We can plan naming, structure, and scope together.

When opening an issue:
- Clearly describe what you want to add or change.
- Include reasoning or examples where possible.
- Wait for a maintainer to approve or discuss the approach before starting implementation.

---

## 2. Development Setup

1. Fork and clone the repository.
2. Create a new branch for your work:  
   ```bash
   git checkout -b feature/your-feature-name

3. Run the project locally as described in the README.

---

## 3. Coding Style

This project uses **TypeScript** conventions that must be followed:

* Avoid unnecessary `any` types.
* Prefer `const` and `let` over `var`.
* Use consistent async/await instead of `.then()` when possible.

**Do not use dynamic imports (`import()`):**
They cause issues with the binary bundler and must be avoided.
Use static imports at the top of files instead.

---

## 4. Commits and Pull Requests

* Use descriptive commit messages (e.g. `feat: add parser for XYZ`).
* Link related issues in your PR description.
* Keep pull requests focused and small.
* If you’re still working on it, open it as a **Draft PR** to get early feedback.

---

## 5. Code Review

All contributions go through review. Maintainers may:

* Suggest minor code or structure changes.
* Ask for clarification or documentation updates.
* Delay merges until the discussion on the related issue is resolved.

---

## 6. Licensing

By submitting a contribution, you agree that your code will be released under the same license as the repository.

---

Thank you for helping make this project better ❤️.

