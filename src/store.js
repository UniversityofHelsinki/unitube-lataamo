import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import { loadTranslations, setLocale, syncTranslationWithStore } from 'react-redux-i18n';
import translationsObject from "./translations";

const store = createStore(rootReducer, applyMiddleware(thunk));

syncTranslationWithStore(store)
store.dispatch(loadTranslations(translationsObject));

export default store;