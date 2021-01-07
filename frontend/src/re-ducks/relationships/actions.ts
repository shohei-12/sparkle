export const ADD_FOLLOWINGS_FOLLOWERS = "ADD_FOLLOWINGS_FOLLOWERS";
export const addFollowingsFollowersAction = () => {
  return {
    type: "ADD_FOLLOWINGS_FOLLOWERS",
  };
};

export const CREATE_RELATIONSHIP_CONTAINER = "CREATE_RELATIONSHIP_CONTAINER";
export const createRelationshipContainerAction = (id: number) => {
  return {
    type: "CREATE_RELATIONSHIP_CONTAINER",
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
