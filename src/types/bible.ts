export interface BibleBook {
  abbrev: {
    pt: string;
    en: string;
  };
  author: string;
  chapters: number;
  group: string;
  name: string;
  testament: string;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  number: number;
  verses: number;
}

export interface BibleBookInfo {
  abbrev: {
    pt: string;
    en: string;
  };
  name: string;
  author: string;
  group: string;
  version: string;
}

export interface BibleChapterResponse {
  book: BibleBookInfo;
  chapter: BibleChapter;
  verses: BibleVerse[];
}

export interface RandomVerseResponse {
  book: BibleBookInfo;
  chapter: number;
  number: number;
  text: string;
}

export interface BibleVersion {
  version: string;
  verses: number;
}

export interface SearchResult {
  book: BibleBookInfo & {
    chapters: number;
    testament: string;
  };
  chapter: number;
  number: number;
  text: string;
}

export interface SearchResponse {
  occurrence: number;
  version: string;
  verses: SearchResult[];
}
