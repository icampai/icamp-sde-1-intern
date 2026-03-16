# Assessment Guidelines

---

## Setup

1. Share your GitHub username with your reviewer — you will be added as a collaborator on the private repository.
2. Clone the repository once access is granted.
3. Run `bun install` before writing any code.
4. Read the entire assessment file for the task before starting.

---

## Rules

- Do not push directly to `main`, it is branch-protected. All changes must go through a PR.
- Do not commit `.env`, include a `.env.example` with all keys present, values blank.
- Do not commit `node_modules`.
- Use only the libraries specified in the task.
- Do not modify starter code function names, export names, or file locations.

---

## Working Through a Task

- Complete parts in order — each part depends on the previous.
- Each part has an **Acceptance** block. Every criterion must pass before moving to the next part.

---

## Submission

Each task is submitted as a separate PR.

**Task 1**
1. Create branch `task-1` from `main`.
2. Complete the task.
3. Open a PR: `task-1` → `main`.
4. Add your write-up in the PR description.
5. Request a review. Do not merge.

**Task 2**
1. Create branch `task-2` from `main`.
2. Complete the task.
3. Open a PR: `task-2` → `main`.
4. Add your write-up in the PR description.
5. Request a review. Do not merge.

---

## Branch Protection

`main` is protected with the following rules:

- Direct pushes are blocked.
- A PR is required to merge into `main`.
- At least 1 approving review is required before merge.
- The reviewer merges after approval, not the candidate.

---