# Education timeline

A single static page listing every course Ben Collier has taken, newest first, from the last PhD dissertation term at Carnegie Mellon (fall 2012) back to his first semester of college at UW–Whitewater (fall 2000). There is also a short section of online courses at the end.

- **Timeline view:** courses grouped by degree, then by semester, on a vertical pen line. Each course is a one-line slip (subject icon, code, title, instructor) that swells like a dock icon as it passes a reading line 40% down the screen or sits under the mouse. On wide screens the slip under focus drops its full index card into a sticky panel beside the list: the term, the instructor, a one-paragraph description and a **My materials** link to the course folder in Ben's Google Drive. On narrower screens, tap a slip to unfold its card in place. Reduced-motion settings turn the magnification off.
- **Table view:** the same data as a compact table (term, school, code, title, instructor, materials link).
- **Filters:** search, school chips, subject chips and a "Has my materials" toggle. All of them apply to both views.

The **My materials** links point into Ben's private Drive. They only work for him; the page says so once, at the top.

## Running it

There's no build step. Serve the folder with any static file server:

```sh
python3 -m http.server 8000
# open http://localhost:8000/
```

The page loads `data/courses.json` with `fetch`, so opening `index.html` straight from disk (`file://`) won't work. GitHub Pages serves it from `main`.

## Files

```
index.html            page shell
css/timeline.css      field-notebook styling (tokens borrowed from ben.collier.phd)
js/icons.js           inline SVG subject icons, one per subject family
js/app.js             renders the degree strip, timeline, table and filters
data/courses.json     all of the data
assets/logos/         school logos from Wikimedia Commons (see CREDITS.md)
assets/favicon.svg
```

## Data schema (`data/courses.json`)

```jsonc
{
  "meta":     { "owner", "updated", "first_term", "materials_notice", "sources": [] },
  "schools":  { "<id>": { "name", "short", "unit", "logo", "wordmark"?, "color" } },
  "degrees":  [ { "id", "label", "title", "school", "year", "field", "span", "note" } ],
  "subjects": { "<subject id>": "<label>" },
  "courses":  [ <course> ],
  "loose_folders": [ { "title", "url", "note" } ]
}
```

Each course:

| field | meaning |
| --- | --- |
| `id` | stable slug (`school-code-term`), also the card's HTML anchor |
| `degree` | `phd`, `ms`, `mba`, `bba` or `online` |
| `school` | key into `schools` (`cmu`, `pitt`, `uwm`, `uww`, `uwo`, `matc`, `jhu`) |
| `platform`, `series` | online courses only: where it ran (`Coursera`) and the program it belongs to; the card leads with the university and puts these in small print |
| `term` | e.g. `Fall 2010`; transfer credit uses `Transfer credit, posted Fall 2000`; online courses use a year or `Undated` |
| `term_sort` | year × 10 + season (spring 1, summer 2, fall 3); used for ordering |
| `code` | course code as on the transcript (empty for online courses) |
| `title` | readable title; `transcript_title` keeps the transcript's abbreviated form |
| `subject` | key into `subjects`; picks the icon and the subject chip |
| `kind` | `course`, `research`, `transfer` or `online` |
| `instructor` | only when a document Ben has names them; otherwise empty |
| `instructor_source` | where the name came from: `syllabus`, `course schedule`, `lecture slides`, `course memo`, `project documents`, `essay title pages`, `certificate` |
| `description` | one paragraph, no em dashes |
| `description_source` | `syllabus` (written from the syllabus), `materials` (from Ben's course files), `transcript`, or `general` (a catalog-style summary of what a course with that title usually covers) |
| `materials_url` | Drive folder (or main file) for the course; empty when none was found |
| `materials_note` | anything worth knowing about the match (duplicates, misnamed folders, best guesses) |

## Sources

- **Transcripts** (Drive folder "Transcripts - College"): UW–Whitewater, UW–Madison and Carnegie Mellon. Used **only** for course codes, titles and terms. They are never linked from the page.
- **Course folders:** "Old College Stuff" (undergraduate), "Archive/MBA" by semester (a duplicate MBA copy also sits under "Education - Ben/MBA"; the Archive copy is the one linked), and "PhD - Courses" for Carnegie Mellon and the Pitt cross-registrations.
- **Syllabi** found inside those folders give most instructor names and syllabus-based descriptions.
- **Online courses** come from "Online Courses and Certifications"; only courses with quizzes or certificates are listed.

Choices worth knowing about:

- The MS was earned along the way in the Tepper PhD program, so CMU terms from fall 2007 to spring 2009 sit under the MS and later terms under the PhD.
- Research units (47-900, "Tepper PhD") appear every term from spring 2008. They are shown once, as a single dissertation card in fall 2012.
- Credit by exam and placement waivers on the UW–Whitewater transcript are not listed; transfer courses from MATC and UW Oshkosh are.
- Folders that couldn't be tied to one transcript line are listed under **Loose papers** at the bottom of the page.

## Privacy rules

These are strict, and apply to the data, the page, commit messages and anything else in this repo:

- **No grades.** No letter grades, GPA, quality points, class rank, honors that come from GPA, student ID numbers, Social Security numbers, birth dates or addresses.
- **Instructors** are listed only when a document names them, with the source in `instructor_source`. Never guessed. Classmates, teammates, clients and other people in course materials are never listed.
- **Descriptions** come from syllabi or course materials where possible. Otherwise they're short, catalog-style summaries marked `general`, with no invented books, projects or professors.
- **Drive links** go to course folders or files only, never to transcripts.
- **Logos** are used only to identify each school.

Before committing, a quick check:

```sh
grep -rnE 'GPA|[0-9]{7}|transcript.*drive.google|"grade"' --include='*.json' --include='*.html' --include='*.js' .
```

## Moving it into ben.collier.phd/projects

The page is self-contained so it can drop into the site later:

1. Copy `index.html`, `css/timeline.css`, `js/`, `data/` and `assets/logos/` into a folder such as `ben.collier.phd/projects/education/`. All paths are relative, so nothing else needs changing.
2. Wrap the `<main class="sheet">` in the site's header, tab navigation and footer. `timeline.css` repeats the site's tokens (`--paper`, `--pen`, `--red`, the fonts) and the `.sheet` styles; once it's inside the site, delete the `:root`, `body`, `.sheet`, `.sheet-head`, `.stamp`, `.sticky` and `.tape` blocks from `timeline.css` and let `css/site.css` provide them.
3. Add a project card for it on the projects page and an entry in the sitemap.
4. Keep `data/courses.json` as the single source of truth; the page reads it at load time.
