# My Coding Journey — VLD

A privacy-conscious, static portfolio for documenting a year of independent coding study. It is built with plain HTML, CSS, and JavaScript and published with GitHub Pages.

Live site: https://abiel-tsai.github.io/vld-coding-journey/

The design includes light and dark themes, responsive navigation, self-hosted fonts, an editorial layout, and accessible keyboard focus states.

## Add a reflection

1. Open `write.html` on the live site, or select **Write a reflection** in the journal.
2. Fill in the fields. Use **Absent / missed session** for an absence note; the challenge, response, and self-check fields become optional. Record the missed session's date and an honest next step.
3. Optionally attach up to three PNG, JPG, or WebP images (12 MB input limit each), with one short caption per image. The caption also supplies its accessibility description. Add sources or acknowledge help when applicable. Images are resized to at most 2000 pixels on the long side and compressed to about 220 KB or less each. Check the previews for readable code and text.
4. Select **Prepare to publish**, then **Download entry file**. The JSON file contains both text and images. **Download backup** can also save an unfinished draft.
5. Select **Open GitHub upload**, sign in as **Abiel-Tsai**, and upload the downloaded JSON file into `_data/reflections`. Keep its filename unchanged. Commit directly to `main`.
6. Wait for GitHub Pages to rebuild, then check the journal. Images also appear on the Evidence page with links to their reflections.

Published entries are public. The writing form itself is public, but it has no publishing credentials: GitHub enforces repository write permission. Visitors cannot commit to this repository. A visitor's fork or proposed pull request does not publish to this site.

Draft text and attached images stay in browser localStorage and are not synced. If storage is full or blocked, the editor warns you to download a backup. Existing text-only drafts and published entries remain compatible. Downloading is not publishing. Clear the draft after publishing to start a new entry. Uploading a file with an existing filename replaces that entry, so do so only when you intend to update it. For text edits, edit the existing JSON in GitHub. The site escapes entry text and only renders embedded PNG/JPEG/WebP image data.

## Before publishing

1. Keep the approved learning plan in `course-log.html` current.
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
