import * as React from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Auth from "./components/Auth";
import Counter from "./components/Counter";
import Feed from "./components/Feed";
import "./scss/style.scss";
import { auth } from "./firebase";

const container = document.getElementById("root")!;
const root = createRoot(container);

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => {
      unSub();
    };
  }, [dispatch]);

  return <>{user.uid ? <Feed /> : <Auth />}</>;
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
