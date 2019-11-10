export const messageReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_USER':
      return { ...state, [action.username]: [] };
    case 'ADD_MESSAGE':
      state[action.payload.dbName].push(action.payload);
      return { ...state };
    default:
      break;
  }
};
