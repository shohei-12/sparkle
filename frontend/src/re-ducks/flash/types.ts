export type FlashState = {
  type: '' | 'success' | 'error';
  msg: string;
};

export type FlashAction = {
  type: string;
  payload: FlashState;
};
