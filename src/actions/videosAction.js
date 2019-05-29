// asynchronous action creator

export const fetchVideos = () => {

  // server from .env variable
  const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
  const PATH = '/api/events';

  return async (dispatch) => {
    try {
      let response = await fetch(`${VIDEO_SERVER_API}${PATH}`);
      if(response.status === 200) {
        let responseJSON = await response.json();
        dispatch(apiGetVideosSuccessCall(responseJSON));
      } else {
        dispatch(api401FailureCall(new Date()));
      }
    } catch(err) {
      dispatch(apiFailureCall('Unable to fetch data'));
    }
  };
};

export const apiGetVideosSuccessCall = data => ({
  type: 'SUCCESS_API_GET_VIDEOS',
  payload: data
});

export const api401FailureCall = failureTime => ({
  type: 'STATUS_401_API_CALL',
  payload : failureTime
});


export const apiFailureCall = msg => ({
  type: 'FAILURE_API_CALL',
  payload: msg
});
