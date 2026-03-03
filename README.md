# Prove

A local-first startup idea validator. Runs a structured AI conversation that pressure-tests your idea across five stages and produces a clear verdict.

## Quick start

```bash
npx validate-idea
```

On first run a setup wizard picks your AI provider and API key — then a local web UI opens at `http://localhost:8674`.

## How it works

Submit your idea in one sentence. The AI guides you through five stages:

| Stage | What it examines |
|---|---|
| **Clarity** | Is the idea specific and well-defined? |
| **Pain & Urgency** | Is the problem real, frequent, and urgent? |
| **Differentiation** | What exists already, and why does yours differ? |
| **MVP & Validation** | What's the smallest testable experiment? |
| **Decision** | Build, pivot, or drop — with reasoning |

All project data is stored locally under `~/.prove/`.

## Providers

| Provider | Env var |
|---|---|
| OpenAI | `OPENAI_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |

Config is saved to `~/.prove/config.json` after first setup.

## Optional: demand research

Set a [Tavily](https://tavily.com) API key to enable web research mode — the agent searches forums and discussion threads for real demand signals.

```bash
export TAVILY_API_KEY=your_key
```

## CLI commands

```
prove              Start the server (runs setup on first launch)
prove reset        Clear saved config and re-run setup
prove whoami       Show current provider and model
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8674` | Server port |
| `AI_MODEL` | _(from config)_ | Override the model |
| `SEARCH_PROVIDER` | `none` | Set to `tavily` to enable research |
| `TAVILY_API_KEY` | — | Required when `SEARCH_PROVIDER=tavily` |

## Development

```bash
bun install
bun dev          # starts API + web in watch mode
bun build:cli    # produces a self-contained dist/
```

Requires [Bun](https://bun.sh) ≥ 1.3.
