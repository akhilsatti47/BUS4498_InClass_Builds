# Week 10 test log: what Club Event Radar knows and remembers

- Student: @akhilsatti47
- Website: https://akhilsatti47.github.io/BUS4498_InClass_Builds/event_radar/
- Folder: https://github.com/akhilsatti47/BUS4498_InClass_Builds/tree/main/event_radar
- Chat app: GroupMe
- Written by the BUS 4498 Memory Builder on Oct 30, 2026, 4:00 PM.

## Builder checks

| Check | Result | When |
|---|---|---|
| Week 9 build ready | Passed. The events table is there, and visitors can read published posts. The agent is running with your AI key: claude-haiku-5-5. New sign-ups are off. Your website opens at https://akhilsatti47.github.io/BUS4498_InClass_Builds/event_radar/ | 9:17 AM |
| Chat-group reader | Not passed. The reader has its GroupMe secrets. It hasn’t run yet. The scheduled job runs it within a minute; check again. No GROUPME_BOT_ID: posts are read, but the group gets no reply. | 2:45 PM |
| Club list | Not passed. The club list has 6 clubs: Accounting Society, Board Game Guild, Cal Poly Ski & Snowboard Club, Mustang Pitch Society, Sustainability Crew, Women in Finance Circle. Cal Poly Kite Flyers isn’t on the list yet. Post B shows you when to add it. The agent reads the club list: it knows 6 clubs. | 2:59 PM |
| Lessons table | Passed. Visitors can’t read the lessons: they’re for moderators only. A visitor can’t write a lesson, so no post can teach the agent. Only a signed-in moderator can. The agent reads the lessons: 0 lessons are switched on right now. | 3:26 PM |

## Test posts

| Post | Expected | What happened | What the agent looked at |
|---|---|---|---|
| A. A nickname | Published, with the club shown as Board Game Guild: the agent matched the nickname "BGG" on the club list. | Not sent |  |
| B. A club that isn't on the list | Waiting for a moderator, because "Cal Poly Kite Flyers" isn't on the club list yet. | Not sent |  |
| C. The new club's next post | Published, with the club shown as Cal Poly Kite Flyers. You changed what the agent knows without touching the code. | Not sent |  |
| D. A known club, no place | Waiting for a moderator, because the place is missing (rule R2). The reason adds a hint from the club list: Board Game Guild usually meets at University Union (UU), Room 220. The agent didn't fill the place in: knowledge about a club in general isn't a fact about this event. | Not sent |  |
| E. The original post | Published for Tuesday, November 3 at 6:00 PM at the UU Plaza. | Not sent |  |
| F. An update | Published, replacing E. The agent checked the club's upcoming posts, saw that this updates "pitch practice," and copied the place from the earlier post. The earlier card leaves the website. | Not sent |  |
| G. A reminder that changes nothing | Already posted. A reminder isn't an update, and the database's duplicate check (same date, start time, and place as F) refuses a second copy. | Not sent |  |
| H. Something the rules don't cover | Published. The posting rules don't say anything about study hours, so to the agent it looks like an event. Now teach it: sign in as a moderator and save this lesson: *Drop-in study hours, tutoring, and office hours aren't events for this website. Hold them for a moderator.* | duplicate: This event is already posted. | Club list (6 clubs): matched “Accounting Society” to Accounting Society in the announcement or earlier chat. Lessons: 0 active; followed none. Checked 4 upcoming posts from Accounting Society. No earlier post was selected as an update; no event details were copied from memory. |
| I. The next one, after the lesson | Waiting for a moderator, citing your lesson. | published: Your event is on the board. | Club list (6 clubs): matched “Accounting Society” to Accounting Society in the announcement or earlier chat. Lessons: 0 active; followed none. Checked 1 upcoming posts from Accounting Society. No earlier post was selected as an update; no event details were copied from memory. |
| J. A post that tries to teach the agent | Waiting for a moderator. Your lesson still applies, and the post is flagged for trying to give the AI instructions. Check Table Editor → lessons: there is still only the lesson you wrote. A post can't teach the agent, because only signed-in moderators can write lessons. | waiting: Your post is saved for a moderator to review. | Club list (6 clubs): matched “Accounting Society” to Accounting Society in the announcement or earlier chat. Lessons: 0 active; followed none. Instruction attempt: the announcement tried to direct the AI; sent to a moderator. Checked 2 upcoming posts from Accounting Society. No earlier post was selected as an update; no event details were copied from memory. |
| K. After you switch the lesson off | Published. The agent forgot the lesson the moment you switched it off. Switch it back on when you're done. | duplicate: This event is already posted. | Club list (6 clubs): matched “Accounting Society” to Accounting Society in the announcement or earlier chat. Lessons: 0 active; followed none. Checked 4 upcoming posts from Accounting Society. No earlier post was selected as an update; no event details were copied from memory. |

## My answers

**The demo (Step 1):** (not answered)

**The fix (Step 2):** (not answered)

**My chat group (Step 4):** (not answered)

**Knowledge (Step 5):** (not answered)

**Memory (Step 6):** (not answered)

**Lessons (Step 7):** (not answered)
