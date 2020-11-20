import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { UsersReducer } from "../users/reducers";
import { FlashReducer } from "../flash/reducers";

export const createStore = (history: any) => {
  return reduxCreateStore(
    combineReducers({
      router: connectRouter(history),
      users: UsersReducer,
      flash: FlashReducer,
    }),
    composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
  );
};
