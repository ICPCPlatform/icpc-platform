# 🏆 ICPC Platform

A full-stack web platform for managing ICPC-style programming competitions, training programs, and user profiles. Built with modern technologies and designed for scalability, security, and ease of use.

---

## ⚙️ Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: 
- **ORM & Migrations**: Drizzle ORM
- **Authentication**:  custom JWT.
- **CI/CD**: GitHub Actions
- **Deployment**: 
---

## 📁 Project Structure

- 📂 `.github`
  - 📂 `workflows`
    - 📄 `deploy.yaml`
    - 📄 `development-deploy.yaml`

- 📂 `doc`
  - 📄 `ERD 3`
  - 📄 `ERD 3.1.txt`
  - 📄 `ERD 3.2.txt`
  - 📄 `ERD3.1.svg`
  - 📄 `ERD3.2.svg`
  - 📄 `ERDv3.0.svg`
  - 📄 `ERDv2.1.svg`
  - 📄 `ERDv2.1.txt`

- 📂 `drizzle`
  - 📂 `meta`
    - 📄 `0000_snapshot.json`
    - 📄 `_journal.json`
    - 📄 `0000_blushing_tempest.sql`
    - 📄 `0000_confused_ser_duncan.sql`

- 📂 `public`
  - 📄 `favicon.jpeg`
  - 📄 `file.svg`
  - 📄 `globe.svg`
  - 📄 `google.svg`
  - 📄 `icon.png`
  - 📄 `next.svg`
  - 📄 `vercel.svg`
  - 📄 `window.svg`

- 📂 `src`
  - 📂 `actions`
    - 📄 `getTrainingFullData.ts`
    - 📄 `getUserFullData.ts`
  - 📂 `app`
    - 📂 `about`
      - 📄 `page.tsx`
    - 📂 `admin-only`
    - 📂 `api`
      - 📂 `auth`
        - 📂 `__tests__`
          - 📄 `auth.rest`
        - 📂 `access-control`
          - 📄 `route.ts`
        - 📂 `login`
          - 📄 `route.ts`
        - 📂 `register`
          - 📄 `route.ts`
        - 📂 `reset-password`
          - 📄 `route.ts`
        - 📂 `verify`
          - 📄 `route.ts`
      - 📂 `create-training`
        - 📄 `_expectedBody.ts`
        - 📄 `_route.ts`
      - 📂 `training`
        - 📂 `__tests__`
          - 📄 `training.rest`
        - 📄 `route.ts`
    - 📂 `change-password-reset`
      - 📄 `_ResetPasswordAction.ts`
      - 📄 `_ResetPasswordForm.tsx`
      - 📄 `page.tsx`
    - 📂 `login`
      - 📄 `page.tsx`
    - 📂 `privacy-policy`
      - 📄 `page.tsx`
    - 📂 `profile`
      - 📂 `[username]`
        - 📄 `page.tsx`
    - 📂 `protected`
      - 📂 `api`
        - 📂 `edit-profile`
          - 📄 `route.ts`
        - 📂 `logout`
          - 📄 `route.ts`
      - 📂 `edit-profile`
        - 📄 `_academicForm.tsx`
        - 📄 `_handlesForm.tsx`
        - 📄 `_page.tsx`
        - 📄 `_personalForm.tsx`
        - 📄 `_socialForm.tsx`
        - 📄 `page.module.css`
        - 📄 `page.tsx`
      - 📂 `join-training`
        - 📄 `_trainingComp.tsx`
        - 📄 `page.tsx`
      - 📂 `profile`
        - 📄 `page.tsx`
    - 📂 `trainings`
      - 📂 `[trainingId]`
        - 📂 `contests`
          - 📂 `[contestId]`
            - 📄 `standing/page.tsx`
    - 📂 `register`
      - 📄 `page.tsx`
    - 📂 `reset-password`
      - 📄 `page.tsx`
    - 📄 `favicon.ico`
    - 📄 `globals.css`
    - 📄 `layout.tsx`
    - 📄 `not-found.tsx`
    - 📄 `page.module.css`
    - 📄 `page.tsx`
  - 📂 `components`
    - 📂 `profile`
      - 📄 `_Profile.tsx`
      - 📄 `_Sidebar.tsx`
    - 📂 `ui`
      - 📄 `NavBar.tsx`
  - 📂 `hooks`
  - 📂 `lib`
    - 📂 `cf`
      - 📄 `codeforcesStanding.ts`
      - 📄 `getStandingFromCodeforces.ts`
    - 📄 `helper.ts`
  - 📂 `const`
    - 📄 `communities.ts`
    - 📄 `countries.ts`
    - 📄 `departments.ts`
    - 📄 `error-messages.ts`
    - 📄 `faculties.ts`
    - 📄 `governorateCodes.ts`
    - 📄 `index.ts`
    - 📄 `universities.ts`
  - 📂 `db`
    - 📂 `schema`
      - 📂 `training`
        - 📄 `Blocks.ts`
        - 📄 `Contests.ts`
        - 📄 `MentorTraineeHistory.ts`
        - 📄 `Staff.ts`
        - 📄 `Trainees.ts`
        - 📄 `Trainings.ts`
      - 📂 `user`
        - 📄 `Cities.ts`
        - 📄 `Communities.ts`
        - 📄 `Countries.ts`
        - 📄 `Departments.ts`
        - 📄 `EmailAuth.ts`
        - 📄 `Faculties.ts`
        - 📄 `Institutes.ts`
        - 📄 `ResetPassword.ts`
        - 📄 `Users.ts`
        - 📄 `UsersFullData.ts`
        - 📄 `index.ts`
      - 📄 `util.ts`
  - 📂 `email`
    - 📄 `sendEmail.ts`
  - 📂 `permissions`
    - 📄 `getUserTrainingPermissions.ts`
  - 📂 `types`
    - 📄 `DefaultResponse.d.ts`
    - 📄 `training.ts`
    - 📄 `userProfileType.ts`
  - 📂 `validation`
    - 📄 `resetPassword.ts`
    - 📄 `userFulldataValidations.ts`
    - 📄 `userLogin.ts`
    - 📄 `userValidations.ts`
    - 📄 `userValidationsServer.ts`
    - 📄 `util.ts`
  - 📄 `session.ts`
  - 📄 `utils.ts`
  - 📂 `middelwares`
    - 📄 `adminOnly.ts`
    - 📄 `authOnly.ts`
    - 📄 `index.ts`
    - 📄 `viewTraining.ts`

- 📂 `providers`
  - 📄 `training.tsx`
  - 📄 `user.tsx`

- 📂 `styles`
  - 📂 `base`
    - 📄 `base.css`
    - 📄 `variables.css`
  - 📂 `components`
  - 📂 `auth`
    - 📄 `auth.css`
  - 📂 `profile`
    - 📄 `profile-edit.css`
    - 📄 `profile-form.css`
    - 📄 `profile-view.css`
  - 📂 `shared`
    - 📄 `buttons.css`

- 📂 `tests-examples`
- 📂 `tests`

- 📄 `.eslintrc.json`
- 📄 `.gitignore`
- 📄 `README.md`
- 📄 `components.json`
- 📄 `dockerfile`
- 📄 `drizzle-dev.config.ts`
- 📄 `eslint.config.mjs`
- 📄 `eslint.config.mts`
- 📄 `next.config.ts`
- 📄 `package-lock.json`
- 📄 `package.json`
- 📄 `playwright.config.ts`
- 📄 `postcss.config.js`
- 📄 `postcss.config.mjs`
- 📄 `prettier.config.ts`
- 📄 `tailwind.config.js`
- 📄 `tailwind.config.ts`
- 📄 `todo.md`
- 📄 `tsconfig.json`


## 🗂️ Key Directories Explained

### 📁 `src/app` – Application Core (Next.js App Router)

Handles routing, backend APIs, and page rendering.

- 🛣️ **Routes**: Folder-based routing system (`/login`, `/register`, `/profile`, etc.)
- 🔗 **API**: Route handlers for features like authentication, training creation, etc.
- 🧪 **Tests**: REST client test files (`*.rest`) and testing logic under `__tests__`

---

### 🧩 `src/components` – Reusable UI Components

Encapsulated, styled components used throughout the app.

- 🖼️ **UI**: Navbar, form elements, buttons
- 👤 **Profile**: Sidebar and profile view/edit layouts

---

### 🛢️ `src/db` – Database Schema (Drizzle ORM)

Defines the relational schema for users, trainings, contests, and more.

- 📦 `training/`: Trainings, contests, blocks, mentor assignments
- 🧑‍🎓 `user/`: User profile data – cities, faculties, departments
- 🧰 `util.ts`: Shared database helpers

---

### ⚙️ `src/lib` – Core Utilities & External Integrations

Business logic and Codeforces API handlers.

- 🌐 `cf/`: Fetch and parse Codeforces standings
- 🧠 `helper.ts`: Common utility functions

---

### 🏃 `src/actions` – Server Actions

Server-side logic for fetching or processing data asynchronously.

- 🧑‍💼 `getUserFullData.ts`
- 🏋️ `getTrainingFullData.ts`

---

### 📬 `src/email` – Email Utilities

- ✉️ `sendEmail.ts`: Password reset and verification email logic

---

### 🔐 `src/permissions` – Access Control Logic

- 🧾 `getUserTrainingPermissions.ts`: Validates access to training content

---

### 📏 `src/validation` – Input Validation (Zod)

Form validation schemas for both frontend and server-side.

- 🔎 `userLogin.ts`, `userValidations.ts`
- 🔁 `resetPassword.ts`

---

### 🧠 `src/types` – Global TypeScript Types

Centralized types used across the app.

- 🧑 `userProfileType.ts`
- 🏋️ `training.ts`

---

### 🛡️ `src/middelwares` – Route Protection

Middleware logic for guarding access.

- 🚧 `adminOnly.ts`, `authOnly.ts`, `viewTraining.ts`

---

### 🌍 `src/providers` – Global React Providers

State providers using context for user and training data.

- 👥 `user.tsx`, 🏋️ `training.tsx`

---

### 🎨 `src/styles` – Styling System

CSS Modules and base/global styles.

- 🌐 `base/`: Theme variables and base CSS
- 👤 `profile/`, 🔐 `auth/`, 🧱 `shared/`: Feature-specific styling

---

### 🧮 `drizzle/` – Schema Snapshots & Migrations

Drizzle ORM migration journal and snapshots.

- 📜 SQL-based migrations with version tracking

---

### 🖼️ `public/` – Static Assets

Favicons, logos, SVGs, and icons for UI.

---

## File Naming Conventions

- `page.tsx`: Next.js page components
- `layout.tsx`: Layout components
- `route.ts`: API route handlers
- `*.module.css`: CSS Modules for styling
- `index.ts`: Barrel exports

## Getting Started

[Add setup instructions here]

## Development Workflow

[Add development workflow instructions here] 
