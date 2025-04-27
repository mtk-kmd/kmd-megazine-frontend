export interface Magazine {
    id: string;
    title: string;
    openDate: string;
    closeDate: string;
    finalCloseDate: string;
    published: boolean;
  }
  
  export type MagazineFormValues = Omit<Magazine, 'id'>;
  