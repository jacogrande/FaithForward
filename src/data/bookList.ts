type Book = {
  chapters: number;
  nextBook: string | null;
  prevBook: string | null;
};
const bookList: { [key: string]: Book } = {
  Genesis: {
    chapters: 50,
    nextBook: "Exodus",
    prevBook: null,
  },
  Exodus: {
    chapters: 40,
    nextBook: "Leviticus",
    prevBook: "Genesis",
  },
  Leviticus: {
    chapters: 27,
    nextBook: "Numbers",
    prevBook: "Exodus",
  },
  Numbers: {
    chapters: 36,
    nextBook: "Deuteronomy",
    prevBook: "Leviticus",
  },
  Deuteronomy: {
    chapters: 34,
    nextBook: "Joshua",
    prevBook: "Numbers",
  },
  Joshua: {
    chapters: 24,
    nextBook: "Judges",
    prevBook: "Deuteronomy",
  },
  Judges: {
    chapters: 21,
    nextBook: "Ruth",
    prevBook: "Joshua",
  },
  Ruth: {
    chapters: 4,
    nextBook: "1 Samuel",
    prevBook: "Judges",
  },
  "1 Samuel": {
    chapters: 31,
    nextBook: "2 Samuel",
    prevBook: "Ruth",
  },
  "2 Samuel": {
    chapters: 24,
    nextBook: "1 Kings",
    prevBook: "1 Samuel",
  },
  "1 Kings": {
    chapters: 22,
    nextBook: "2 Kings",
    prevBook: "2 Samuel",
  },
  "2 Kings": {
    chapters: 25,
    nextBook: "1 Chronicles",
    prevBook: "1 Kings",
  },
  "1 Chronicles": {
    chapters: 29,
    nextBook: "2 Chronicles",
    prevBook: "2 Kings",
  },
  "2 Chronicles": {
    chapters: 36,
    nextBook: "Ezra",
    prevBook: "1 Chronicles",
  },
  Ezra: {
    chapters: 10,
    nextBook: "Nehemiah",
    prevBook: "2 Chronicles",
  },
  Nehemiah: {
    chapters: 13,
    nextBook: "Esther",
    prevBook: "Ezra",
  },
  Esther: {
    chapters: 10,
    nextBook: "Job",
    prevBook: "Nehemiah",
  },
  Job: {
    chapters: 42,
    nextBook: "Psalms",
    prevBook: "Esther",
  },
  Psalms: {
    chapters: 150,
    nextBook: "Proverbs",
    prevBook: "Job",
  },
  Proverbs: {
    chapters: 31,
    nextBook: "Ecclesiastes",
    prevBook: "Psalms",
  },
  Ecclesiastes: {
    chapters: 12,
    nextBook: "SongOfSolomon",
    prevBook: "Proverbs",
  },
  SongOfSolomon: {
    chapters: 8,
    nextBook: "Isaiah",
    prevBook: "Ecclesiastes",
  },
  Isaiah: {
    chapters: 66,
    nextBook: "Jeremiah",
    prevBook: "SongOfSolomon",
  },
  Jeremiah: {
    chapters: 52,
    nextBook: "Lamentations",
    prevBook: "Isaiah",
  },
  Lamentations: {
    chapters: 5,
    nextBook: "Ezekiel",
    prevBook: "Jeremiah",
  },
  Ezekiel: {
    chapters: 48,
    nextBook: "Daniel",
    prevBook: "Lamentations",
  },
  Daniel: {
    chapters: 12,
    nextBook: "Hosea",
    prevBook: "Ezekiel",
  },
  Hosea: {
    chapters: 14,
    nextBook: "Joel",
    prevBook: "Daniel",
  },
  Joel: {
    chapters: 3,
    nextBook: "Amos",
    prevBook: "Hosea",
  },
  Amos: {
    chapters: 9,
    nextBook: "Obadiah",
    prevBook: "Joel",
  },
  Obadiah: {
    chapters: 1,
    nextBook: "Jonah",
    prevBook: "Amos",
  },
  Jonah: {
    chapters: 4,
    nextBook: "Micah",
    prevBook: "Obadiah",
  },
  Micah: {
    chapters: 7,
    nextBook: "Nahum",
    prevBook: "Jonah",
  },
  Nahum: {
    chapters: 3,
    nextBook: "Habakkuk",
    prevBook: "Micah",
  },
  Habakkuk: {
    chapters: 3,
    nextBook: "Zephaniah",
    prevBook: "Nahum",
  },
  Zephaniah: {
    chapters: 3,
    nextBook: "Haggai",
    prevBook: "Habakkuk",
  },
  Haggai: {
    chapters: 2,
    nextBook: "Zechariah",
    prevBook: "Zephaniah",
  },
  Zechariah: {
    chapters: 14,
    nextBook: "Malachi",
    prevBook: "Haggai",
  },
  Malachi: {
    chapters: 4,
    nextBook: "Matthew",
    prevBook: "Zechariah",
  },
  Matthew: {
    chapters: 28,
    nextBook: "Mark",
    prevBook: "Malachi",
  },
  Mark: {
    chapters: 16,
    nextBook: "Luke",
    prevBook: "Matthew",
  },
  Luke: {
    chapters: 24,
    nextBook: "John",
    prevBook: "Mark",
  },
  John: {
    chapters: 21,
    nextBook: "Acts",
    prevBook: "Luke",
  },
  Acts: {
    chapters: 28,
    nextBook: "Romans",
    prevBook: "John",
  },
  Romans: {
    chapters: 16,
    nextBook: "1 Corinthians",
    prevBook: "Acts",
  },
  "1 Corinthians": {
    chapters: 16,
    nextBook: "2 Corinthians",
    prevBook: "Romans",
  },
  "2 Corinthians": {
    chapters: 13,
    nextBook: "Galatians",
    prevBook: "1 Corinthians",
  },
  Galatians: {
    chapters: 6,
    nextBook: "Ephesians",
    prevBook: "2Corinthians",
  },
  Ephesians: {
    chapters: 6,
    nextBook: "Philippians",
    prevBook: "Galatians",
  },
  Philippians: {
    chapters: 4,
    nextBook: "Colossians",
    prevBook: "Ephesians",
  },
  Colossians: {
    chapters: 4,
    nextBook: "1 Thessalonians",
    prevBook: "Philippians",
  },
  "1 Thessalonians": {
    chapters: 5,
    nextBook: "2 Thessalonians",
    prevBook: "Colossians",
  },
  "2 Thessalonians": {
    chapters: 3,
    nextBook: "1 Timothy",
    prevBook: "1 Thessalonians",
  },
  "1 Timothy": {
    chapters: 6,
    nextBook: "2 Timothy",
    prevBook: "2 Thessalonians",
  },
  "2 Timothy": {
    chapters: 4,
    nextBook: "Titus",
    prevBook: "1 Timothy",
  },
  Titus: {
    chapters: 3,
    nextBook: "Philemon",
    prevBook: "2 Timothy",
  },
  Philemon: {
    chapters: 1,
    nextBook: "Hebrews",
    prevBook: "Titus",
  },
  Hebrews: {
    chapters: 13,
    nextBook: "James",
    prevBook: "Philemon",
  },
  James: {
    chapters: 5,
    nextBook: "1 Peter",
    prevBook: "Hebrews",
  },
  "1 Peter": {
    chapters: 5,
    nextBook: "2 Peter",
    prevBook: "James",
  },
  "2 Peter": {
    chapters: 3,
    nextBook: "1 John",
    prevBook: "1 Peter",
  },
  "1 John": {
    chapters: 5,
    nextBook: "2 John",
    prevBook: "2 Peter",
  },
  "2 John": {
    chapters: 1,
    nextBook: "3 John",
    prevBook: "1 John",
  },
  "3 John": {
    chapters: 1,
    nextBook: "Jude",
    prevBook: "2 John",
  },
  Jude: {
    chapters: 1,
    nextBook: "Revelation",
    prevBook: "3 John",
  },
  Revelation: {
    chapters: 22,
    nextBook: null,
    prevBook: "Jude",
  },
};

export default bookList;
