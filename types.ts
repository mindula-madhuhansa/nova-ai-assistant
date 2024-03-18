export type Message = {
  sender: string;
  response: string;
  id: string;
};

export type State = {
  sender: string;
  response: string | null | undefined;
};
