import { createStore } from 'redux';

const initialState = {
    song: null,
};

function songReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'change':
      return { 
          ...state,
          song: action.data
       }
    default:
      return state
  }
}

export const Store = createStore(songReducer);