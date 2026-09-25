---
name: "sports-bet-analyzer"
description: "Analyze sports games, player props, spreads, totals, moneylines, and parlays using current statistics, injuries, matchup context, and betting odds. Use when the user asks whether a sports bet or bet-slip is reasonable, who is likely to perform well, how confident to be in a betting line, or for current betting-related statistics and injury information. Provide evidence-based analysis and risk factors without presenting any bet as guaranteed."
---

# sports-bet-analyzer

## User inputs
- Sport and league
- Game or player being analyzed
- Bet type: moneyline, spread, total, player prop, or parlay
- Exact selection and betting line
- Odds and sportsbook, if available
- Game date, if it is not the next scheduled game
- Bet-slip screenshot, if applicable
- Preferred answer length or level of detail, if specified
- If an essential game, player, or betting line is missing, ask one focused clarification question before analyzing the bet

## Procedure
1. Read the user's bet and identify the sport, league, teams, player, bet type, betting line, odds, sportsbook, and event date.

2. Resolve missing information by asking one focused question if the game, player, line, or date is unclear. If the missing detail is nonessential, state the assumption being used.

3. Collect current information using available web-search or sports-data tools. Prioritize official league and team sources for schedules, statistics, starting status, and injury reports, then use reputable sports news sources for expected playing time, workload, and recent developments.

4. Evaluate the selection using season performance, recent performance, usage, hit rate, opponent matchup, injuries, venue, rest, weather when relevant, and likely game script.

5. Evaluate the offered betting line and odds. Compare the line with the player's or team's recent and season-level performance and consider the implied break-even probability when odds are available.

6. For parlays, analyze every leg separately, identify important correlations between legs, and identify the leg carrying the most uncertainty.

7. Assign a confidence rating from 1 to 10 based on the strength and consistency of the evidence. Treat the rating as confidence in the analysis rather than a guarantee that the wager will win.

8. Present the analysis in a concise structured format showing the selection, confidence rating, supporting evidence, matchup or injury context, and the main risk.

9. Perform a final quality and safety check. Do not call a wager guaranteed, safe, a lock, or free money, and do not encourage chasing losses or increasing bets to recover previous losses.

## Output
- Bet or selection being analyzed
- Confidence rating from 1–10
- Two or three concrete reasons supporting the analysis
- Relevant injury, matchup, or recent-performance information
- Main risk or uncertainty
- For parlays, a short analysis of each leg and identification of the leg with the most uncertainty
- Sources or dates for current information when available

## Boundaries
- Do not guarantee that a wager will win.
- Do not describe bets as locks, safe money, guaranteed money, or risk-free.
- Distinguish current verified information from assumptions.
- If current statistics, injuries, or schedules cannot be verified, say so rather than inventing information.
- Ask for clarification when the exact player, game, or betting line cannot be determined.
- Do not place wagers for the user.
- Do not encourage chasing losses or increasing wager size to recover previous losses.
- Treat confidence ratings as an assessment of available evidence, not as a predicted certainty of winning.
