# 📝 GIT COMMIT GUIDELINES

> Standardized commit message format for clean, readable, and professional Git history.

---

## 📋 Commit Message Format

```
<type>(scope): short description

[optional body]
[optional footer]
```

### Structure:
| Part | Required | Description |
|------|----------|-------------|
| `type` | ✅ Yes | Category of change |
| `scope` | ✅ Yes | Component/folder affected |
| `description` | ✅ Yes | Brief summary (present tense) |
| `body` | ❌ Optional | Detailed explanation |
| `footer` | ❌ Optional | Breaking changes, issue refs |

---

## 🏷️ Commit Types

| Type | Emoji | Description | Example |
|------|-------|-------------|---------|
| `feat` | ✨ | New feature | `feat(auth): add login functionality` |
| `fix` | 🐛 | Bug fix | `fix(api): resolve null pointer exception` |
| `style` | 💄 | UI/styling changes (no logic change) | `style(button): update primary color` |
| `refactor` | ♻️ | Code restructuring (no feature/fix) | `refactor(service): simplify validation logic` |
| `docs` | 📚 | Documentation only | `docs(readme): update installation steps` |
| `chore` | 🔧 | Maintenance tasks | `chore(deps): update laravel to v11` |
| `perf` | ⚡ | Performance improvement | `perf(query): optimize database queries` |
| `test` | 🧪 | Adding/updating tests | `test(api): add unit tests for auth` |
| `build` | 📦 | Build system changes | `build(vite): update config for production` |
| `ci` | 🔄 | CI/CD changes | `ci(github): add deployment workflow` |

---

## ✅ Commit Rules

### 1. Message Format Rules
- [ ] Use **present tense** ("add" not "added")
- [ ] Use **lowercase** for type and scope
- [ ] Keep subject line **under 72 characters**
- [ ] **No period** at the end of subject line
- [ ] Scope should match **folder/component name**

### 2. Grouping Rules
| Scenario | Action |
|----------|--------|
| Multiple changes in **same component** | Combine into ONE commit |
| Changes in **different components** | Create SEPARATE commits |
| Related changes across files | Group by **feature/purpose** |

### 3. Approval Workflow
```
1. Make changes
2. Stage files: git add .
3. Create commit(s) following rules
4. Show commits to team lead
5. Wait for approval ⏳
6. Push only after approval: git push
```

> ⚠️ **NEVER push without approval from team lead!**

---

## 📝 Examples

### ✅ Good Commit Messages

```bash
# Feature
feat(customers): add customer management CRUD operations
feat(auth): implement password reset functionality
feat(dashboard): add sales analytics chart

# Bug Fix
fix(orders): resolve calculation error in total price
fix(login): handle session timeout correctly
fix(api): prevent duplicate form submissions

# Styling
style(sidebar): update active menu highlight color
style(table): improve responsive layout for mobile
style(loader): add shimmer effect to skeleton

# Refactor
refactor(services): extract validation to separate method
refactor(controllers): simplify error handling logic
refactor(models): rename relationships for clarity

# Documentation
docs(api): add endpoint documentation
docs(readme): update setup instructions
docs(rules): add backend coding guidelines

# Chore
chore(deps): update spatie/permission to v6
chore(config): update app timezone to Asia/Manila
chore(env): add new environment variables

# Performance
perf(queries): add eager loading to reduce N+1
perf(cache): implement response caching
perf(images): optimize image compression
```

### ❌ Bad Commit Messages

```bash
# Too vague
update files
fix bug
changes
wip
test
asdf

# Missing type/scope
add new feature
fixed the issue
updated styles

# Past tense (should be present)
added login page
fixed validation error
updated dependencies

# Too long
feat(auth): add user authentication with login, logout, registration, password reset, email verification, and remember me functionality
```

---

## 🔀 Branch Naming Convention

### Format:
```
<type>/<short-description>
```

### Examples:
```bash
feat/customer-management
fix/order-calculation
style/dashboard-redesign
refactor/auth-service
docs/api-documentation
chore/dependency-updates
```

### Rules:
- [ ] Use **lowercase** only
- [ ] Use **hyphens** to separate words (not underscores)
- [ ] Keep it **short but descriptive**
- [ ] Match the **type** with commit types

---

## 🚀 Common Git Commands

### Daily Workflow
```bash
# Check status
git status

# Stage all changes
git add .

# Stage specific file
git add path/to/file.php

# Commit with message
git commit -m "feat(scope): description"

# Push to remote (after approval)
git push origin branch-name
```

### Branch Operations
```bash
# Create and switch to new branch
git checkout -b feat/new-feature

# Switch to existing branch
git checkout main

# Pull latest changes
git pull origin main

# Merge branch
git merge feat/new-feature
```

### Undo Operations
```bash
# Unstage files
git reset HEAD

# Discard changes in file
git checkout -- path/to/file.php

# Amend last commit (before push)
git commit --amend -m "new message"

# Reset to previous commit (careful!)
git reset --hard HEAD~1
```

---

## 📊 Quick Reference

### Commit Type Cheat Sheet
| When you... | Use type |
|-------------|----------|
| Add new functionality | `feat` |
| Fix something broken | `fix` |
| Change appearance only | `style` |
| Improve code structure | `refactor` |
| Update documentation | `docs` |
| Update dependencies | `chore` |
| Improve speed/performance | `perf` |
| Add/update tests | `test` |

### Scope Examples
| Scope | Meaning |
|-------|---------|
| `auth` | Authentication module |
| `api` | API endpoints |
| `models` | Database models |
| `services` | Service classes |
| `controllers` | Controller logic |
| `middleware` | Middleware |
| `config` | Configuration files |
| `deps` | Dependencies |

---

## ⚠️ Important Reminders

1. **Always pull before starting work**
   ```bash
   git pull origin main
   ```

2. **Review your commits before pushing**
   ```bash
   git log --oneline -5
   ```

3. **Never commit sensitive data**
   - API keys
   - Passwords
   - `.env` files

4. **Use `.gitignore` properly**
   - `vendor/`
   - `node_modules/`
   - `.env`
   - `storage/logs/`

---

## 📋 Pre-Push Checklist

Before requesting approval to push:

- [ ] Commits follow conventional format
- [ ] Each commit has proper type and scope
- [ ] Messages are clear and descriptive
- [ ] No "wip" or vague commit messages
- [ ] Sensitive data is NOT committed
- [ ] Code has been tested locally
- [ ] No unnecessary files are staged

---

> 💡 **Remember:** A clean Git history makes debugging, reviewing, and collaboration much easier!
