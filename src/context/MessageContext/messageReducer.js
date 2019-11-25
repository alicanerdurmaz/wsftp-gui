export const messageReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_USER':
      return { ...state, [action.username]: [] };
    case 'ADD_MESSAGE':
      state[action.payload.dbName].push(action.payload);
      return { ...state };
    case 'STATUS_CHANGED':
      state[action.payload.dbName].map(element => {
        if (element.uuid === action.payload.uuid) {
          element.accepted = action.payload.status;
        }
      });
      return { ...state };
    default:
      break;
  }
};
