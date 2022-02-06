export type NoteId = number & { __ghost_note_id: never };
export type Note = {
  id: NoteId;
  name: string;
  chapters: ChapterId[];
};

export type ChapterId = number & { __ghost_chapter_id: never };
export type Chapter = {
  id: ChapterId;
  noteId: NoteId;
  name: string;
  pages: PageId[];
};

export type PageId = number & { __ghost_page_id: never };
export type Page = {
  id: PageId;
  chapterId: ChapterId;
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
}

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
export type CurriculumId = number & { __ghost_curriculum_id: never };
export type Curriculum = {
  id: CurriculumId;
  name: string;
  mode: CurriculumMode;
  noteId: NoteId;
  lastAccess: PageId | undefined;
};

export type RawNote = {
  name: string
  chapters: {
    name: string
    pages: {
      headline: string;
      content: {
        items: Item[];
        detail: string;
      };
      options: {
        textFlow: 'utd' | 'ltr';
      };
    }[]
  }[]
}

export type OmitId<T extends { id: any }> = Omit<T, 'id'>;
