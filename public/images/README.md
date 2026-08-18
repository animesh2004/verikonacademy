# Images

Drop photo files in here and reference them from `lib/workshop.ts`. Paths are relative
to `public/`, so `public/images/venues/mmmut-1.jpg` is written as
`/images/venues/mmmut-1.jpg`.

```
venues/         workshop photos, grouped by campus — venues[].photos
testimonials/   headshots of the people quoted — testimonials[].photo
team/           instructor headshots — instructors[].photo
```

Any entry left as `null` or `[]` renders a labelled placeholder instead of a broken
image, so the site is safe to deploy before the photos arrive.

**Format tips:** landscape JPEGs around 1600px wide are plenty — they are rendered in a
4:3 box. Headshots can be square and small (256px is enough at the size they display).
Next.js optimises them at build time; you do not need to compress them first.
