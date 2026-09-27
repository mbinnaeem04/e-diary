const DAY = 86_400_000;
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString();

// Resting rotations (degrees) so the cards feel hand-placed
export const TILTS = [-1, 0.8, -0.6, 1.2];

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// Newest first. `color` is an index into the 3 card colours.
export const SEED_NOTES = [
  {
    id: 'n1',
    title: 'Things to learn',
    body: 'Closures, promises, and the event loop.\nBuild one small project after each topic.\nWrite what I learned here at night.',
    date: daysAgo(0),
    pinned: true,
    color: 0,
    tilt: -1,
  },
  {
    id: 'n2',
    title: 'Sunday reset',
    body: 'Slow morning and chai.\nClean the desk.\nPlan the week before dinner.',
    date: daysAgo(1),
    pinned: false,
    color: 1,
    tilt: 0.8,
  },
  {
    id: 'n3',
    title: 'Grocery run',
    body: 'Milk, eggs, oranges, bread, coriander, green chillies, and something sweet.',
    date: daysAgo(2),
    pinned: false,
    color: 2,
    tilt: -0.6,
  },
  {
    id: 'n4',
    title: 'Book list',
    body: 'Atomic Habits (halfway through).\nNext up: Deep Work.\nGoal: 20 pages a day, no phone.',
    date: daysAgo(4),
    pinned: false,
    color: 0,
    tilt: 1.2,
  },
  {
    id: 'n5',
    title: 'Good things today',
    body: 'Slept well. Sunny window seat. Long call with an old friend.',
    date: daysAgo(6),
    pinned: false,
    color: 1,
    tilt: -1,
  },
  {
    id: 'n6',
    title: 'Odd dream',
    body: 'I was walking through a library where every book was written in my handwriting.',
    date: daysAgo(9),
    pinned: false,
    color: 2,
    tilt: 0.8,
  },
];
