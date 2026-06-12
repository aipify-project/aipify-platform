# Curiosity & Discovery Engine — FAQ

## What is the Curiosity & Discovery Engine?

The Curiosity & Discovery Engine (Phase A.87) inspires exploration, learning, and innovation through discovery prompts and question-led culture. It helps organizations stay curious when successful.

## How is this different from the Learning Engine?

**Learning Engine** (`/app/learning`) stores customer learning memory with approval workflows. **Curiosity & Discovery A.87** offers exploration prompts and discovery signals — questions that open possibilities, not learning storage.

## How is this different from Innovation & Impact Engine (A.28)?

**Innovation & Impact A.28** (`/app/innovation-impact-engine`) tracks innovation case studies and baselines. **Curiosity & Discovery A.87** gently prompts "what if?" questions across five discovery categories.

## How is this different from Innovation Experimentation phases?

Innovation Experimentation phases govern formal experiments with approval workflows. **Curiosity & Discovery A.87** encourages healthy experimentation culture through prompts — not formal experiment governance.

## How is this different from Growth & Evolution Engine (A.81)?

**Growth & Evolution A.81** orchestrates growth recommendations and evolution paths. **Curiosity & Discovery A.87** fuels that evolution with beginner's mindset prompts — it integrates but does not replace growth orchestration.

## What are discovery categories?

Five categories: **Operational**, **Customer**, **Knowledge**, **Innovation**, and **Human** — each with example questions and metadata-only discovery signals.

## What are discovery prompts?

Records with category, prompt, context_summary, and status (`pending`, `explored`, `dismissed`). Explore via `explore_discovery_prompt(p_prompt_id)` or dismiss via `dismiss_discovery_prompt(p_prompt_id)`.

## What are discovery signals?

Metadata-only records with category, summary, and confidence (low/moderate/high). No raw customer content or PII.

## What questions does Aipify ask?

Examples: "What if we simplified this process?", "What would a new customer notice first?", "What would we try with a beginner's mindset?" — see question_examples on the dashboard.

## What is Self Love connection?

Reflection, healthy experimentation, and psychological safety — learn without fear. Success should not close curiosity.

## Who can explore or dismiss prompts?

`curiosity_discovery.prompts.explore` is required. Owners, administrators, managers, and employees have this by default.

## What integrations does Curiosity & Discovery use?

Learning Engine, Innovation & Impact A.28, Growth & Evolution A.81, Continuous Improvement, and Legacy Engine A.86. See integration links on the dashboard.

## Is psychological safety supported?

Yes — trust note emphasizes that questions are welcomed, ideas respected, and mistakes become lessons without fear.
