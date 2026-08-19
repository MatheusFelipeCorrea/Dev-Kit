---
card_id: EXAMPLE-STORY-001
title: "Login endpoint"
status: Backlog
type: Story
priority: Highest
sprint: null
story_points: 5
reporter: null
parent: EXAMPLE-EPIC-001
due_date: null
categories:
  - Backend
---

# [STORY BACKEND] Login endpoint

## Descrição
As a user, I want to log in with email and password, so that I can access my account.

## Critérios de Aceite

### Cenário 1 — Login válido
**Given** a registered user with email "user@test.com",
**When** POST /api/auth/login is called with valid credentials,
**Then** returns 200 with JWT token and user data.

### Cenário 2 — Credenciais inválidas
**Given** a registered user,
**When** POST /api/auth/login is called with wrong password,
**Then** returns 401 "Invalid credentials".

## Resumo

### CONCLUIDO
- Spec defined

### PENDENTE
- Implementation
- Tests
