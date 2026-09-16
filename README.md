# My Coding Journey — VLD

A privacy-conscious, static portfolio for documenting a year of independent coding study. It is built with plain HTML, CSS, and JavaScript and published with GitHub Pages.

Live site: https://abiel-tsai.github.io/vld-coding-journey/

The design includes light and dark themes, responsive navigation, self-hosted fonts, an editorial layout, and accessible keyboard focus states.

## Add a reflection

1. Open `write.html` on the live site, or select **Write a reflection** in the journal.
2. Fill in the fields. The draft saves in this browser; **Download backup** also saves a JSON copy.
3. Select **Prepare to publish**. The entry is copied to your clipboard (or shown for manual copying if clipboard access is unavailable).
4. Select **Continue to GitHub** and sign in as **Abiel-Tsai**. Paste the text into the empty file editor. Keep the prefilled `_data/reflections/DATE-ID.json` filename.
5. Select **Commit changes**, then commit directly to `main`. GitHub Pages rebuilds the journal automatically.

Published entries are public. The writing form itself is public, but it has no publishing credentials: GitHub enforces repository write permission. Visitors cannot commit to this repository. A visitor's fork or proposed pull request does not publish to this site.

Drafts stay in this browser and are not synced. Clear the draft after publishing to start a new entry. For an existing entry, edit its JSON file under `_data/reflections` in GitHub and commit the change. The journal escapes entry text before rendering it.

## Before publishing

1. Replace the bracketed placeholders in `course-log.html`.
2. Check the learner bio and rewrite it in your own voice.
3. Add one dated reflection after every VLD session.
4. Never publish personal contact details, student IDs, exact schedules, or information about other students.

## Preview locally

The journal uses GitHub Pages' Jekyll data processing. For a complete local preview, install Jekyll 3.10 and run:

```sh
jekyll serve --port 8000
```

Then visit `http://localhost:8000`.

A plain static server can preview the other pages and the editor, but cannot render the journal's Liquid template.

## Publish with GitHub Pages

After creating and pushing a GitHub repository, open **Settings → Pages** in the repository. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
