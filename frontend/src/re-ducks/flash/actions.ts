import { FlashState } from './types';

export const FLASH = 'FLASH';
export const flashAction = (flashState: FlashState) => {
  return {
    type: 'FLASH',
    payload: {
      ...flashState,
    },
  };
};
