export type BookID = number & { __ghost_book_id: never };
export type Book = {
  id: BookID;
  name: string;
  chapters: ChapterID[];
};

export type ChapterID = number & { __ghost_chapter_id: never };
export type Chapter = {
  id: ChapterID;
  bookID: BookID;
  name: string;
  pages: PageID[];
};

export type PageID = number & { __ghost_page_id: never };
export type Page = {
  id: PageID;
  chapterID: ChapterID;
  headline: string;
  content: {
    items: Item[];
    detail: string;
  };
  options: {
    textFlow: 'utd' | 'ltr';
  };
};

export type Item = {
  type: 'text';
  text: string;
} | {
  type: 'image';
  file: ImageData;
};

export type CurriculumMode = {
  type: 'detailed';
  speed: number | undefined;
  repeat: number;
} | {
  type: 'blink';
  speed: number | undefined;
  moment: number;
  iterate: number; // if `speed` is defined, iterate a page this times. otherwise, at least this times.
  repeat: number;
};
export type CurriculumID = number & { __ghost_curriculum_id: never };
export type Curriculum = {
  id: CurriculumID;
  name: string;
  mode: CurriculumMode;
  bookID: BookID;
  lastAccess: PageID | undefined;
};

export type OmitID<T extends { id: any }> = Omit<T, 'id'>;
