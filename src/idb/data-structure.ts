export type NoteId = number;
export type Note = {
  id: NoteId;
  name: string;
  chapters: ChapterId[];
  options: {
    textFlow: 'utd' | 'ltr';
  };
};

export type ChapterId = number;
export type Chapter = {
  id: ChapterId;
  noteId: NoteId;
  name: string;
  pages: PageId[];
};

export type PageId = number;
export type Page = {
  id: PageId;
  chapterId: ChapterId;
  headline: string;
  content: {
    items: Item[];
    detail: string;
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
  iterate: number; // if `speed` is defined, iterate a page this times. otherwise, make each pages blink at least this times.
  repeat: number;
};
export type CurriculumId = number;
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
    }[]
  }[];
  options: {
    textFlow: 'utd' | 'ltr';
  };
}

export type OmitId<T extends { id: any }> = Omit<T, 'id'>;
