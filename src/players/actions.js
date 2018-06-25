import { CHANGE_PAYER_PROPS } from "./actionsTypes"

export function actionChangePlayerProps(props){
  return dispatch => {
    dispatch({
      type: CHANGE_PAYER_PROPS, 
      props: props
    });
  }
}

export function actionFetchPlayersData(){
  return dispatch => {
    let type = CHANGE_PAYER_PROPS;
    let props = {isLoading: true}
    dispatch({type, props});
    fetchPlayersData()
    .then(data => {
        props = {
            isLoading: false,
            data: data,
            errors: ''
        }
        dispatch({type, props});
    })
    .catch(error => {
        props = {
            isLoading: false,
            errors: error.toString()
        }
        dispatch({type, props});
    })
  }
}

function fetchPlayersData(){
  return new Promise((resolve, reject) => {
    const url = "https://football-players-b31f2.firebaseio.com/players.json";
    fetch(url)
    .then( response => {
        if (!response.ok) {
            reject(response.statusText);
        }
        return response;
    })
    .then(response => response.json())
    .then(data => resolve(data))
    .catch(error => reject(error));
  })
}