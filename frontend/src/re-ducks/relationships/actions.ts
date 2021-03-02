export const NON_PAYLOAD = 'NON_PAYLOAD';
export const nonPayloadAction = () => {
  return {
    type: 'NON_PAYLOAD',
  };
};

export const CREATE_RELATIONSHIP_CONTAINER = 'CREATE_RELATIONSHIP_CONTAINER';
export const createRelationshipContainerAction = (id: number) => {
  return {
    type: 'CREATE_RELATIONSHIP_CONTAINER',
    payload: {
      followings: {
        id,
        followings: [],
        start: 0,
      },
      followers: {
        id,
        followers: [],
        start: 0,
      },
    },
  };
};
