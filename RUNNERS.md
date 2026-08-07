# 🚀 Ascenvo Isolated Ephemeral Runners Setup & Reference

Complete guide for setting up, running, and maintaining **9 parallel 100% isolated ephemeral self-hosted runners** for the **Ascenvo** organization.

---

<div style="background: linear-gradient(135deg, #1e1e2e 0%, #2d2b55 100%); color: #ffffff; padding: 25px; border-radius: 12px; margin: 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #61afef; font-size: 22px;">⚡ Architecture & Status Dashboard</h2>
        <span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">100% Isolated & Ephemeral</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; text-align: center;">
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 32px; font-weight: bold; color: #98c379;">12</div>
            <div style="font-size: 13px; color: #abb2bf;">Total Parallel Runners</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 32px; font-weight: bold; color: #e5c07b;">0 Host Locks</div>
            <div style="font-size: 13px; color: #abb2bf;">Isolated $HOME per Runner</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 32px; font-weight: bold; color: #61afef;">Auto Token</div>
            <div style="font-size: 13px; color: #abb2bf;">Generated via GitHub CLI</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 32px; font-weight: bold; color: #c678dd;">Auto Clean</div>
            <div style="font-size: 13px; color: #abb2bf;">Auto-Wipes Workspace Per Job</div>
        </div>
    </div>
</div>

---

<div style="background: #f8f9fa; border-left: 5px solid #007bff; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #007bff;">📋 Workload Pools Overview</h3>
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
        <div style="border: 2px solid #28a745; background: #ffffff; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px;">
            <strong style="color: #28a745; font-size: 16px;">🟢 CI Runners (6)</strong><br />
            <code>macos-ci-1</code> .. <code>macos-ci-6</code><br />
            <small style="color: #6c757d;">Label: <code>[self-hosted, macos-ci]</code></small><br />
            <small>↳ Runs Lint, Format, Types, Tests, Build</small>
        </div>
        <div style="border: 2px solid #17a2b8; background: #ffffff; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px;">
            <strong style="color: #17a2b8; font-size: 16px;">🔵 PR Runners (3)</strong><br />
            <code>macos-pr-1</code>, <code>macos-pr-2</code>, <code>macos-pr-3</code><br />
            <small style="color: #6c757d;">Label: <code>[self-hosted, macos-pr]</code></small><br />
            <small>↳ Runs Branch Policy & PR Descriptions</small>
        </div>
        <div style="border: 2px solid #fd7e14; background: #ffffff; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px;">
            <strong style="color: #fd7e14; font-size: 16px;">🟠 Deploy Runners (3)</strong><br />
            <code>macos-deploy-1</code>, <code>macos-deploy-2</code>, <code>macos-deploy-3</code><br />
            <small style="color: #6c757d;">Label: <code>[self-hosted, macos-deploy]</code></small><br />
            <small>↳ Runs Cloudflare Deployments</small>
        </div>
    </div>
</div>

---

## 🛠️ Prerequisites & Requirements

<div style="background: #ffffff; border: 1px solid #e1e4e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #24292e;">System & Tooling Requirements</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
            <tr style="background: #f6f8fa; text-align: left;">
                <th style="padding: 10px; border-bottom: 2px solid #e1e4e8;">Requirement</th>
                <th style="padding: 10px; border-bottom: 2px solid #e1e4e8;">Specification</th>
                <th style="padding: 10px; border-bottom: 2px solid #e1e4e8;">Purpose</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><strong>Host OS</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;">macOS (M1/M2/M3 ARM64 or Intel)</td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;">Host environment for runner daemon loops</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><strong>GitHub CLI</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><code>brew install gh</code></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;">Auto-issues registration tokens via <code>gh api</code></td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><strong>CLI Scopes</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><code>admin:org</code>, <code>repo</code>, <code>workflow</code></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;">Authorizes token creation for Ascenvo org</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><strong>Runner Package</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><code>actions-runner-osx-arm64.tar.gz</code></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;">Official GitHub Actions self-hosted runner binaries</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;"><strong>Docker Engine</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;">Docker Desktop / OrbStack (Optional)</td>
                <td style="padding: 10px; border-bottom: 1px solid #e1e4e8;">Supported if workflows specify <code>container:</code> execution</td>
            </tr>
        </tbody>
    </table>
</div>

---

## 🏗️ Directory Architecture

```text
/Users/ankitanand/Ransh-Dev/ascenvo-runners/
├── runner-ci-1/                ← CI Runner 1
│   ├── home/                   ← Isolated $HOME (prevents host ~/.gitconfig locks)
│   └── .env                    ← HOME=/Users/ankitanand/Ransh-Dev/ascenvo-runners/runner-ci-1/home
├── runner-ci-2/                ← CI Runner 2 (isolated $HOME)
├── runner-ci-3/                ← CI Runner 3 (isolated $HOME)
├── runner-pr-1/                ← PR Runner 1 (isolated $HOME)
├── runner-pr-2/                ← PR Runner 2 (isolated $HOME)
├── runner-pr-3/                ← PR Runner 3 (isolated $HOME)
├── runner-deploy-1/            ← Deploy Runner 1 (isolated $HOME)
├── runner-deploy-2/            ← Deploy Runner 2 (isolated $HOME)
├── runner-deploy-3/            ← Deploy Runner 3 (isolated $HOME)
├── run-ephemeral-loop.sh       ← Ephemeral registration & execution loop
├── start-all.sh                ← Master initialization & startup script
├── stop-all.sh                 ← Graceful teardown script
├── status.sh                   ← Process & log monitoring script
└── logs/                       ← Real-time execution logs for all 9 runners
    ├── macos-ci-1.log
    ├── macos-ci-2.log
    └── ...
```

---

## 🚀 Setup Guide from Scratch

<div style="background: #eef9fd; border-left: 5px solid #0366d6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #0366d6;">Step 1: Install & Authenticate GitHub CLI</h3>
    <p>Ensure <code>gh</code> CLI is installed and authenticated with your organization admin permissions:</p>
</div>

```bash
# Install GitHub CLI via Homebrew
brew install gh

# Authenticate with GitHub
gh auth login

# Verify account and required scopes (admin:org, repo, workflow)
gh auth status
```

<div style="background: #eef9fd; border-left: 5px solid #0366d6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #0366d6;">Step 2: Create Base Runner Directory & Download Binaries</h3>
</div>

```bash
# Create dedicated org runners folder
mkdir -p /Users/ankitanand/Ransh-Dev/ascenvo-runners/logs

# Download runner tarball into cache directory (if not already downloaded)
mkdir -p /Users/ankitanand/Ransh-Dev/github-runner
cd /Users/ankitanand/Ransh-Dev/github-runner
curl -o actions-runner-osx-arm64.tar.gz -L https://github.com/actions/runner/releases/download/v2.336.0/actions-runner-osx-arm64-2.336.0.tar.gz
```

<div style="background: #eef9fd; border-left: 5px solid #0366d6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #0366d6;">Step 3: Create the Ephemeral Runner Loop Script</h3>
    <p>Create <code>/Users/ankitanand/Ransh-Dev/ascenvo-runners/run-ephemeral-loop.sh</code>:</p>
</div>

```bash
cat > /Users/ankitanand/Ransh-Dev/ascenvo-runners/run-ephemeral-loop.sh << 'EOF'
#!/bin/bash
RUNNER_DIR="$1"
RUNNER_NAME="$2"
LABELS="$3"

if [ -z "$RUNNER_DIR" ] || [ -z "$RUNNER_NAME" ] || [ -z "$LABELS" ]; then
    echo "Usage: $0 <runner_dir> <runner_name> <labels>"
    exit 1
fi

mkdir -p "$RUNNER_DIR/home"
cat > "$RUNNER_DIR/.env" <<EOT
HOME=$RUNNER_DIR/home
EOT

echo "🚀 Starting isolated ephemeral loop for $RUNNER_NAME (labels: $LABELS)..."

while true; do
    cd "$RUNNER_DIR" || exit 1

    # Cleanup leftover workspace state from previous job
    rm -rf _work _diag .runner .credentials .credentials_rsaparams 2>/dev/null || true
    mkdir -p home

    # Auto-fetch fresh registration token via gh CLI
    TOKEN=$(gh api -X POST /orgs/Ascenvo/actions/runners/registration-token --jq '.token' 2>/dev/null)
    if [ -z "$TOKEN" ]; then
        echo "[$(date)] ⚠️ Failed to fetch token for $RUNNER_NAME. Retrying in 10s..."
        sleep 10
        continue
    fi

    # Register runner with --ephemeral and --replace flags
    ./config.sh --url https://github.com/Ascenvo \
        --token "$TOKEN" \
        --name "$RUNNER_NAME" \
        --labels "$LABELS" \
        --ephemeral \
        --unattended \
        --replace > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "[$(date)] ✅ Registered $RUNNER_NAME. Listening for job..."
        ./run.sh
        echo "[$(date)] 🔄 Job finished or runner exited for $RUNNER_NAME. Cleaning up for next job..."
    else
        echo "[$(date)] ❌ Registration failed for $RUNNER_NAME. Retrying in 10s..."
        sleep 10
    fi

    sleep 2
done
EOF

chmod +x /Users/ankitanand/Ransh-Dev/ascenvo-runners/run-ephemeral-loop.sh
```

<div style="background: #eef9fd; border-left: 5px solid #0366d6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #0366d6;">Step 4: Create Master Launch Script (`start-all.sh`)</h3>
    <p>Create <code>/Users/ankitanand/Ransh-Dev/ascenvo-runners/start-all.sh</code>:</p>
</div>

```bash
cat > /Users/ankitanand/Ransh-Dev/ascenvo-runners/start-all.sh << 'EOF'
#!/bin/bash
BASE_DIR="/Users/ankitanand/Ransh-Dev/ascenvo-runners"
TARBALL="/Users/ankitanand/Ransh-Dev/github-runner/actions-runner-osx-arm64.tar.gz"

if [ ! -f "$TARBALL" ]; then
    echo "❌ Error: Tarball not found at $TARBALL"
    exit 1
fi

chmod +x "$BASE_DIR/run-ephemeral-loop.sh"
mkdir -p "$BASE_DIR/logs"

declare -a RUNNERS=(
    "runner-ci-1:macos-ci-1:macos-ci"
    "runner-ci-2:macos-ci-2:macos-ci"
    "runner-ci-3:macos-ci-3:macos-ci"
    "runner-pr-1:macos-pr-1:macos-pr"
    "runner-pr-2:macos-pr-2:macos-pr"
    "runner-pr-3:macos-pr-3:macos-pr"
    "runner-deploy-1:macos-deploy-1:macos-deploy"
    "runner-deploy-2:macos-deploy-2:macos-deploy"
    "runner-deploy-3:macos-deploy-3:macos-deploy"
)

echo "🚀 Starting 9 Isolated Ephemeral Runners for Ascenvo..."
echo "========================================================="

for ENTRY in "${RUNNERS[@]}"; do
    IFS=':' read -r DIR_NAME RUNNER_NAME LABELS <<< "$ENTRY"
    RUNNER_DIR="$BASE_DIR/$DIR_NAME"

    mkdir -p "$RUNNER_DIR"
    if [ ! -f "$RUNNER_DIR/config.sh" ]; then
        echo "📦 Extracting binaries for $RUNNER_NAME..."
        tar xzf "$TARBALL" -C "$RUNNER_DIR"
    fi

    mkdir -p "$RUNNER_DIR/home"
    cat > "$RUNNER_DIR/.env" <<EOT
HOME=$RUNNER_DIR/home
EOT

    pkill -f "$RUNNER_DIR/run-ephemeral-loop.sh" 2>/dev/null || true
    nohup "$BASE_DIR/run-ephemeral-loop.sh" "$RUNNER_DIR" "$RUNNER_NAME" "$LABELS" > "$BASE_DIR/logs/$RUNNER_NAME.log" 2>&1 &

    echo "✅ Started background loop for $RUNNER_NAME (labels: $LABELS)"
    sleep 1
done

echo ""
echo "🎉 All 9 isolated runners started!"
EOF

chmod +x /Users/ankitanand/Ransh-Dev/ascenvo-runners/start-all.sh
```

<div style="background: #eef9fd; border-left: 5px solid #0366d6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #0366d6;">Step 5: Create Management Scripts (`stop-all.sh` & `status.sh`)</h3>
</div>

```bash
# Create stop script
cat > /Users/ankitanand/Ransh-Dev/ascenvo-runners/stop-all.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping all Ascenvo runner loops and processes..."
pkill -f "ascenvo-runners/run-ephemeral-loop.sh" 2>/dev/null || true
pkill -f "Runner.Listener" 2>/dev/null || true
echo "✅ All runners stopped."
EOF

# Create status script
cat > /Users/ankitanand/Ransh-Dev/ascenvo-runners/status.sh << 'EOF'
#!/bin/bash
BASE_DIR="/Users/ankitanand/Ransh-Dev/ascenvo-runners"

echo "📊 Ascenvo Self-Hosted Runner Status"
echo "========================================"
echo ""
echo "Active Loop Processes:"
ps aux | grep "run-ephemeral-loop.sh" | grep -v grep
echo ""
echo "Recent Logs Summary:"
tail -n 3 "$BASE_DIR"/logs/*.log 2>/dev/null
EOF

chmod +x /Users/ankitanand/Ransh-Dev/ascenvo-runners/*.sh
```

<div style="background: #eef9fd; border-left: 5px solid #0366d6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
    <h3 style="margin-top: 0; color: #0366d6;">Step 6: Launch Runners</h3>
</div>

```bash
/Users/ankitanand/Ransh-Dev/ascenvo-runners/start-all.sh
```

---

## 📊 Workflow Label Configuration Matrix

<div style="background: #ffffff; border: 1px solid #e1e4e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #24292e; color: #ffffff; text-align: left;">
                <th style="padding: 12px;">Workflow</th>
                <th style="padding: 12px;">File Path</th>
                <th style="padding: 12px;">Required YAML Label</th>
                <th style="padding: 12px;">Assigned Runner Pool</th>
            </tr>
        </thead>
        <tbody>
            <tr style="border-bottom: 1px solid #e1e4e8;">
                <td style="padding: 12px;"><strong>CI Checks</strong></td>
                <td style="padding: 12px;"><code>.github/.github/workflows/ci.yml</code></td>
                <td style="padding: 12px;"><code>runs-on: [self-hosted, macos-ci]</code></td>
                <td style="padding: 12px;"><code>macos-ci-1..3</code></td>
            </tr>
            <tr style="border-bottom: 1px solid #e1e4e8;">
                <td style="padding: 12px;"><strong>Branch Policy</strong></td>
                <td style="padding: 12px;"><code>.github/.github/workflows/branch-policy.yml</code></td>
                <td style="padding: 12px;"><code>runs-on: [self-hosted, macos-pr]</code></td>
                <td style="padding: 12px;"><code>macos-pr-1..3</code></td>
            </tr>
            <tr style="border-bottom: 1px solid #e1e4e8;">
                <td style="padding: 12px;"><strong>PR Description</strong></td>
                <td style="padding: 12px;"><code>.github/.github/workflows/pr-description.yml</code></td>
                <td style="padding: 12px;"><code>runs-on: [self-hosted, macos-pr]</code></td>
                <td style="padding: 12px;"><code>macos-pr-1..3</code></td>
            </tr>
            <tr style="border-bottom: 1px solid #e1e4e8;">
                <td style="padding: 12px;"><strong>Cloudflare Deploy</strong></td>
                <td style="padding: 12px;"><code>atrium/.github/workflows/cloudflare-deployment-production.yml</code></td>
                <td style="padding: 12px;"><code>runs-on: [self-hosted, macos-deploy]</code></td>
                <td style="padding: 12px;"><code>macos-deploy-1..3</code></td>
            </tr>
        </tbody>
    </table>
</div>

---

## ⚡ Quick Management Commands

<div style="background: #f6f8fa; border: 1px solid #d1d5da; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h4 style="margin-top: 0; color: #24292e;">⚡ Terminal Command Cheatsheet</h4>
    <pre style="background: #24292e; color: #f6f8fa; padding: 15px; border-radius: 6px; overflow-x: auto;">
<code># 1. Check local process status
/Users/ankitanand/Ransh-Dev/ascenvo-runners/status.sh

# 2. View live runner logs

tail -f /Users/ankitanand/Ransh-Dev/ascenvo-runners/logs/*.log

# 3. Check registered org runners status via GitHub API

gh api /orgs/Ascenvo/actions/runners --jq '.runners[] | {name, status, labels: [.labels[].name]}'

# 4. Stop all local runners

/Users/ankitanand/Ransh-Dev/ascenvo-runners/stop-all.sh

# 5. Restart all local runners

/Users/ankitanand/Ransh-Dev/ascenvo-runners/start-all.sh</code>
</pre>
</div>
