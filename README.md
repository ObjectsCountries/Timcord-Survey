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
begin_theming(["Welcome! Please choose a theme."])
writing(["Write a personal message to Vice."])
finish(["Finished!"])
begin_theming --->|Light Mode| writing
begin_theming --->|Dark Mode| writing
writing --->|written_response| finish
```

## Lap 2 Flowchart

```mermaid
---
title: Timcord Survey Lap 2 Flowchart
---
graph 
```

## Debug Flowchart

```mermaid
---
title: Timcord Survey Debug Flowchart
---
graph 
debug_begin_intro(["Welcome! Please choose a color."])
debug_substitution(["You got any DEBUG_substitution_0 DEBUG_substitution_1?"])
debug_branch(["Choose your path."])
debug_path_left(["Left path chosen. Write a message."])
debug_path_right(["Right path chosen. Write a message."])
debug_finish(["Reached end of debug."])
debug_begin_intro --->|Red| debug_substitution
debug_begin_intro --->|Orange| debug_substitution
debug_begin_intro --->|Yellow| debug_substitution
debug_begin_intro --->|Green| debug_substitution
debug_begin_intro --->|Blue| debug_substitution
debug_begin_intro --->|Purple| debug_substitution
debug_substitution --->|YEAAAH we got some DEBUG_substitution_0 DEBUG_substitution_1!| debug_branch
debug_substitution --->|NAWWWW we're outta DEBUG_substitution_0 DEBUG_substitution_1!| debug_substitution
debug_branch --->|Left| debug_path_left
debug_branch --->|Right| debug_path_right
debug_path_left --->|written_response| debug_finish
debug_path_right --->|written_response| debug_finish
```

## Debug Lap 2 Flowchart

```mermaid
---
title: Timcord Survey Debug Lap 2 Flowchart
---
graph 
debug_lap2_begin_intro(["Welcome to Lap 2! You're on a time limit this time, and the questions will be different."])
debug_lap2_writing_copy(["Write a haiku about DEBUG_LAP2_writing_copy_0."])
debug_lap2_finish(["Done! You can now submit."])
debug_lap2_begin_intro --->|intro| debug_lap2_writing_copy
debug_lap2_writing_copy --->|written_response| debug_lap2_finish
```
