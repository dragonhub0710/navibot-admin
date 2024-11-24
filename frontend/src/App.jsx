import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import routes from "@/routes";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import { SIGN_OUT } from "./actions/types";

function App() {
  const pages = useRoutes(routes);
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
      store.dispatch(loadUser());
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) store.dispatch({ type: SIGN_OUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <div className="w-full">{pages}</div>
    </Provider>
  );
}

export default App;
