# 🚀 Ascenvo Centralized GitHub Workflows

A centralized GitHub Actions workflows repository for the **Ascenvo organization**. Provides resilient, reusable CI/CD pipelines with **automatic self-hosted fallback** when GitHub-hosted runners are unavailable or timeout.

> **Proprietary & Private** — Ascenvo Organization Only. All Rights Reserved.

---

## 📋 Overview

This repository (`Ascenvo/.github`) contains:

- **Reusable Workflows** — Shared CI/CD pipelines used by all org repositories
- **GitHub Actions Schemas** — JSON schemas for PR description automation
- **Shared Skills** — LLM prompts for intelligent PR generation
- **CODEOWNERS** — Automatic code review assignment

### Key Features

✅ **GitHub-Hosted + Self-Hosted Fallback** — Try GitHub runners first, fallback to your laptop on timeout  
✅ **Zero GitHub Actions Minutes** — Fallback runs don't consume free tier quota  
✅ **Org-Wide Consistency** — All repos use identical CI/CD logic  
✅ **Easy Maintenance** — Update once, affects all org repositories  
✅ **AI-Powered PR Descriptions** — Auto-generate PR summaries with LLM  
✅ **Branch Policy Enforcement** — Prevent direct pushes to production

---

## 📁 Repository Structure

```
Ascenvo/.github/
├── .github/
│   ├── CODEOWNERS                              # Code review assignment rules
│   ├── workflows/
│   │   ├── ci.yml                             # Lint, Format, Types, Tests, Build (with fallback)
│   │   ├── branch-policy.yml                  # Production branch protection (with fallback)
│   │   └── pr-description.yml                 # AI-generated PR descriptions (with fallback)
│   ├── schemas/
│   │   └── pr-description-body.schema.json    # JSON schema for PR body structure
│   └── skills/
│       └── pr-description-updater/
│           └── SKILL.md                       # LLM prompt for PR generation
├── package.json                                # Node.js configuration
├── README.md                                   # This file
├── tsconfig.json                              # TypeScript configuration
├── eslint.config.js                           # ESLint configuration
└── test/                                       # Test files for workflows
```

---

## 🔧 Workflows

### 1️⃣ **ci.yml** — Status Checks

Comprehensive CI/CD pipeline: lint, format check, type check, tests, and build.

**Triggers:**

- On pull requests to `develop`, `production`, `release/**`
- On push to `develop`, `production`
- Reusable (`workflow_call`)

**Jobs:**

- `lint-github` → `lint-fallback` (Fallback if GitHub times out)
- `format-github` → `format-fallback`
- `types-github` → `types-fallback`
- `tests-github` → `tests-fallback`
- `build` (Runs after all checks pass)

**Usage in your repo:**

```yaml
name: CI
on:
    push:
        branches: [develop, production]
    pull_request:
        branches: [develop, production, release/**]

jobs:
    ci:
        uses: Ascenvo/.github/.github/workflows/ci.yml@main
        secrets: inherit
```

---

### 2️⃣ **branch-policy.yml** — Production Protection

Enforces branch policies: only `develop` or `release/*` branches can merge to `production`.

**Triggers:**

- On pull requests to `production`
- Reusable (`workflow_call`)

**Jobs:**

- `production-source-github` → `production-source-fallback` (Fallback if GitHub times out)

**Usage in your repo:**

```yaml
name: Branch Policy
on:
    pull_request:
        branches: [production]

jobs:
    policy:
        uses: Ascenvo/.github/.github/workflows/branch-policy.yml@main
        secrets: inherit
```

---

### 3️⃣ **pr-description.yml** — AI-Powered PR Descriptions

Automatically generates comprehensive PR descriptions using an LLM (Claude, GPT, etc.).

**Triggers:**

- On PR opened, reopened, or synchronized
- Reusable (`workflow_call`)

**Jobs:**

- `generate-description-github` → `generate-description-fallback` (Fallback if GitHub times out)

**Secrets Required:**

- `API_KEY` — LLM API key (Claude, OpenAI, etc.)
- `API_BASE_URL` — LLM API endpoint
- `MODEL` — Model to use (e.g., `claude-3-sonnet-20240229`)

**Usage in your repo:**

```yaml
name: PR Description
on:
    pull_request:
        types: [opened, reopened, synchronize]

jobs:
    pr-desc:
        uses: Ascenvo/.github/.github/workflows/pr-description.yml@main
        secrets:
            API_KEY: ${{ secrets.API_KEY }}
            API_BASE_URL: ${{ secrets.API_BASE_URL }}
            MODEL: ${{ secrets.MODEL }}
```

---

## 🏃 How to Use in Your Repository

### Step 1: Create Workflow Files

In your repository, create `.github/workflows/ci.yml`:

```bash
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI
on:
  push:
    branches: [develop, production]
  pull_request:
    branches: [develop, production, release/**]

jobs:
  ci:
    uses: Ascenvo/.github/.github/workflows/ci.yml@main
    secrets: inherit
EOF

cat > .github/workflows/branch-policy.yml << 'EOF'
name: Branch Policy
on:
  pull_request:
    branches: [production]

jobs:
  policy:
    uses: Ascenvo/.github/.github/workflows/branch-policy.yml@main
    secrets: inherit
EOF

cat > .github/workflows/pr-description.yml << 'EOF'
name: PR Description
on:
  pull_request:
    types: [opened, reopened, synchronize]

permissions:
  contents: read
  pull-requests: write
  checks: read

jobs:
  pr-desc:
    uses: Ascenvo/.github/.github/workflows/pr-description.yml@main
    secrets:
      API_KEY: ${{ secrets.API_KEY }}
      API_BASE_URL: ${{ secrets.API_BASE_URL }}
      MODEL: ${{ secrets.MODEL }}
EOF
```

### Step 2: Commit & Push

```bash
git add .github/workflows/
git commit -m "ci: use centralized Ascenvo workflows"
git push origin develop
```

### Step 3: Test

Create a test PR and verify all three workflows trigger correctly!

---

## 🤖 Self-Hosted Runner Setup

### Register Organization-Level Runner (One-Time)

This runner works for **ALL** repos in the Ascenvo organization.

```bash
# 1. Get org token
# Go to: GitHub → Ascenvo Org → Settings → Actions → Runners → "New runner"
# Copy the token

# 2. Download & setup
cd /Users/ankitanand/Ransh-Dev/github-runner

curl -o actions-runner-osx-arm64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.320.0/actions-runner-osx-arm64-2.320.0.tar.gz

tar xzf actions-runner-osx-arm64.tar.gz

# 3. Configure with org token
./config.sh --url https://github.com/Ascenvo --token YOUR_ORG_TOKEN --labels macos,self-hosted

# 4. Install & start as service
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

### Verify Runner is Connected

```bash
# In GitHub UI:
# Ascenvo Org → Settings → Actions → Runners
# You should see your runner with a green dot ✅
```

---

## 🔄 Fallback Mechanism

### How It Works

1. **GitHub Job Runs First** (Primary)
    - Tries `ubuntu-latest` (fast, free)
    - Uses `continue-on-error: true` to report success/failure

2. **Fallback Job Checks Output**
    - Only triggers if primary job failed: `if: ${{ needs.{job}.outputs.success != 'true' }}`
    - Runs on `[self-hosted, macos]`

3. **Build Job Runs Last**
    - After either GitHub or fallback succeeds
    - Uses `if: ${{ !failure() }}`

### Cost Impact

| Scenario              | GitHub Minutes Used | Laptop Used |
| --------------------- | ------------------- | ----------- |
| ✅ GitHub available   | Yes (counted)       | ❌ No       |
| ⏱️ GitHub times out   | ❌ No               | ✅ Yes      |
| 🚫 GitHub unavailable | ❌ No               | ✅ Yes      |

**Result:** You save GitHub Actions minutes when fallback activates!

---

## 📊 Workflow Status

Check workflow status in any repository:

- GitHub UI: `Repo → Actions → Latest Run`
- Look for `(GitHub)` vs `(Fallback)` job names
- Green checkmark = Passed (either runner)

---

## 🔐 Security

- **Proprietary** — Ascenvo organization only, no public access
- **Encrypted Secrets** — API keys stored in org-level secrets
- **Branch Protection** — Production requires approved PR + policy checks
- **CODEOWNERS** — Automatic review assignment for critical files

---

## 🛠️ Development & Maintenance

### Update a Workflow

1. Edit the workflow in this repository
2. Commit & push to `main` branch
3. **All repositories automatically use the updated version** ✨

```bash
cd /Users/ankitanand/Riyansh-Dev/ascenvo/.github

git add .github/workflows/
git commit -m "ci: update workflow"
git push origin main
```

### Lint & Format This Repository

```bash
npm run lint
npm run format
npm run typecheck
npm run test
```

---

## 📞 Support

For issues or questions:

- 📧 Email: `dev@ascenvo.internal`
- 🐛 Report bugs via internal issue tracker
- 🔒 Security issues: `security@ascenvo.internal`

---

## 📝 License

**Proprietary & Confidential** — This repository and all workflows are proprietary to Ascenvo Organization. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📋 Changelog

### v1.0.0 (2026-08-06)

- ✨ Initial release with centralized workflows
- ✨ Add self-hosted fallback to all workflows
- ✨ Add PR description automation
- ✨ Add branch policy enforcement
- ✨ Add organization-wide reusable workflows
