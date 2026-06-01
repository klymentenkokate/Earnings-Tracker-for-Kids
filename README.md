💰 Kids Earnings Tracker
A fun, motivating app to pay your kids for educational activities like coding, reading, or anything you choose. They earn real money, watch it grow with compound interest, and redeem it from you in cash.
Live demo: klymentenkokate.github.io/Earnings-Tracker-for-Kids
---
✨ Features
⏱️ Live timer — start/stop for each activity, earnings tick up in real time
✏️ Manual entry — log time retroactively if the timer wasn't running
💶 Custom activities — up to 5 activities with custom name, emoji, color, and hourly rate
📅 Activity calendar — each day shows a pie chart of time spent per activity
📊 Earnings chart — daily, monthly, yearly views with activity filter and breakdown
📈 Revenue projections — trend-based and best-case forecasts for end of month and end of year
🏦 Compound interest — auto-applied monthly at a rate you set (default 0.7%)
💸 Redeem earnings — kid requests cash, amount deducts from balance
🏅 Badge system — 7 levels from Apprentice to Wizard based on total hours
🔥 Streak counter — consecutive days with at least one session logged
✏️ Edit/delete sessions — fix any mistake from the log or calendar
☁️ Cloud sync — optional Supabase integration to share data across two households
💾 Backup/restore — export and import JSON backup at any time
🌍 20 currencies — EUR, USD, GBP, PLN, JPY and more
👤 Kid's name — personalises all app messaging
---
🚀 Quick Start (local, no sync)
Download `index.html`
Open it in any browser
Tap ⚙️ → enter your kid's name, currency, interest rate, and activities
Start logging sessions!
Use Save Backup regularly to keep a copy of the data
That's it — no server, no account, no cost.
---
☁️ Set Up Cloud Sync (two households)
Cloud sync lets two devices (e.g. mum's phone and dad's phone) share the same data in real time. It uses a free Supabase database.
Step 1 — Create a Supabase project
Go to supabase.com and create a free account
Click New Project, give it a name, choose a region, click Create
Wait ~2 minutes for it to provision
Step 2 — Create the database table
In the left sidebar click SQL Editor
Paste and run:
```sql
create table tracker_state (
  id text primary key default 'main',
  state jsonb,
  updated_at timestamptz default now()
);

insert into tracker_state (id, state) values ('main', '{}');
```
Click Run without RLS if prompted
Then run this to allow access from the browser:
```sql
ALTER TABLE tracker_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow all" ON tracker_state
  FOR ALL USING (true) WITH CHECK (true);
```
Step 3 — Get your credentials
Go to Settings → General — your Project URL is in the browser address bar:
`https://YOUR-PROJECT-ID.supabase.co`
Go to Settings → API Keys → Legacy anon, service_role API keys
Copy the anon key (starts with `eyJ...`)
Step 4 — Connect the app
Open the app — a Set Up Cloud Sync screen appears on first load
Enter your Project URL (must start with `https://`) and Anon Key
Tap Connect & Sync
Repeat on the second household's device with the same credentials
Both devices now share live data. Any session logged on one appears on the other within seconds.

---
⚙️ Parent Settings
Tap the ⚙️ gear icon (top right) to configure:
Setting	Description
Kid's name	Personalises all app text
Currency	20 currencies supported
Monthly interest %	Applied automatically each month (default 0.7%)
Activities	Up to 5 — set name, emoji, color, hourly rate
---
🏅 Badge Levels
Badge	Total Hours
🌱 Apprentice	0
🧭 Explorer	25

🔨 Builder	50
🎨 Creator	100

⭐ Expert	250
🏆 Master	500
🧙 Wizard	1,000
---
💡 Tips
Interest rate — 0.7%/month ≈ 10% annually, matching long-term stock market returns. Good for teaching about investing.
Redeem flow — when the kid taps Redeem and shows you the confirmation, hand them the cash and it deducts automatically.
Streak — glows orange 🔥 after 3 consecutive days. Great motivation to keep going.
Projections — the "If Daily" best case shows what they'd earn if they logged every day, useful as a motivational goal.
Backup — tap Save Backup after each session if not using cloud sync. Takes 2 seconds and protects all data.
---
🛠️ Tech Stack
Pure HTML/CSS/JS — single file, no framework, no build step. Supabase for optional cloud sync. Chart.js for charts. Fonts from Google Fonts.
---
📄 License
Free to use and share. Built with ❤️ for Edvard.
