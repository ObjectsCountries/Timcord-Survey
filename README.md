# Timcord Survey

![Unit Test Status](https://img.shields.io/github/actions/workflow/status/ObjectsCountries/Timcord-Survey/npm.yml?logo=nodedotjs&label=Unit%20Tests)

[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/timotainment)

## Information

This is a survey meant for the members of Timcord, inspired by the analysis work of W\[DATA EXPUNGED]k (those who know). It is currently in alpha.

## Flowchart

```mermaid
---
title: Timcord Survey Flowchart
---
graph 
theming["theming"]
writing["writing"]
finish["finish"]
theming --->|theming_light| writing
theming --->|theming_dark| writing
writing --->|written_response| finish
```

## Debug Flowchart

```mermaid
---
title: Timcord Survey Debug Flowchart
---
graph 
debug_intro["DEBUG_intro"]
debug_substitution["DEBUG_substitution"]
debug_branch["DEBUG_branch"]
debug_path_left["DEBUG_path_left"]
debug_path_right["DEBUG_path_right"]
debug_finish["DEBUG_finish"]
debug_intro --->|DEBUG_intro_red| debug_substitution
debug_intro --->|DEBUG_intro_orange| debug_substitution
debug_intro --->|DEBUG_intro_yellow| debug_substitution
debug_intro --->|DEBUG_intro_green| debug_substitution
debug_intro --->|DEBUG_intro_blue| debug_substitution
debug_intro --->|DEBUG_intro_purple| debug_substitution
debug_substitution --->|DEBUG_substitution_yes| debug_branch
debug_substitution --->|DEBUG_substitution_no| debug_substitution
debug_branch --->|DEBUG_branch_left| debug_path_left
debug_branch --->|DEBUG_branch_right| debug_path_right
debug_path_left --->|written_response| debug_finish
debug_path_right --->|written_response| debug_finish
```

