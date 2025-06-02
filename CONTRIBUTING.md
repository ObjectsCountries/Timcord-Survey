# Contributing

WHAT

HELP ME

GEGAGEDIGEDAGEDAGO

In all seriousness, please do give ideas for questions by making a pull request that modifies [IDEAS.md](IDEAS.md). If on GitHub, tag yourself under your idea. Literally anything is on the table, think stuff from [this video](https://www.youtube.com/watch?v=WqnXp6Saa8Y). Note that **this is a survey, not a quiz**, so please make sure that your questions don't have an intended correct answer.

## Format

The questions are stored in [src/assets/questions.json](src/assets/questions.json). `DEBUG_questions` are the questions designed for unit tests, whereas `questions` are for the real survey.

In order to randomly generate substitutions, fill in either `DEBUG_substitutions` or `substitutions` with a key representing the string to replace, and an array of strings representing the possible replacements. To add a replacement to a question, fill in the `substitutions` array with the desired keys.

Anything relating to debugging and unit tests in the JSON file should begin with `DEBUG_` for consistency.

Additionally, if you have the know-how, pull requests to help with development would be incredibly appreciated, even if you're not in Timcord.
