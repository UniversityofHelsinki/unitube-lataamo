
const initialState = {
  redirect401: null
};

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'STATUS_401_API_CALL':
      return {
        ...state,
        redirect401: new Date()
      };
    case "FAILURE_API_CALL":
      return {
        ...state,
        apiError: action.msg
      };
    default:
      return state;
  }
};

export default statusReducer;