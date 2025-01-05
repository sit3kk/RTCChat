export type Contact = {
  id: string;
  name: string;
  avatar: string;
};

export type ContactSectionsType = {
  title: string;
  index: number;
  key: string;
  data: Contact[];
};
