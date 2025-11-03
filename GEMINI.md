# Gemini Project Context

This document summarizes the key conventions and context for the `new-memo` project.

## Project Goal

To develop a Git-based Markdown memo application following a specification-driven development process.

## Core Specifications

Development is guided by the following documents:
- `.kiro/specs/git-memo-app/requirements.md`
- `.kiro/specs/git-memo-app/design.md`
- `.kiro/specs/git-memo-app/tasks.md`

## Key Conventions

- **Package Manager:** `pnpm` is the preferred package manager for this project.

## Technology Stack

- **Build Tool:** Vite
- **Frontend:** React + TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **In-browser Git:** `isomorphic-git`
- **Local Storage:** IndexedDB (using the `idb` library)
