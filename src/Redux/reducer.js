import {GET_ARTICLES} from "./actions";
const initialState = {
   rutaPrincipal: "https://back-app-drink.vercel.app/",  /* "http://localhost:3002/" */,
   tragosSelected: [],
   articlesList: [],
};

const reducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case GET_ARTICLES:
            return {...state, articlesList: action.payload};
        default:
            return {...state};    
    }

};

export default reducer;