import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Modal,
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
  makeStyles,
} from "@mui/material/";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AccountCircle, Send } from "@mui/icons-material";

/* モーダルを中心に表示させる */
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    backgroundColor: "#ffffff",
    Position: "absolute",
    width: "400",
    borderRadius: "10",
  };
}

const theme = createTheme();

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const dispatch = useDispatch();

  /* パスワードをリセットする処理 */
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail) //authオブジェクトのパスワードをリセットするための関数
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };

  /* サインインされた時の処理 */
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  /* ユーザーがアバター画像を格納した時の処理 */
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = ""; //連続して同じファイルを選択するとonChangeが発動しないためリセットする
    }
  };

  /* ユーザー情報を登録した時の処理 */
  const signUpEmail = async () => {
    /* authにユーザー情報を格納すると同時にauthに格納されているユーザー情報を取得している */
    const authUser = await auth.createUserWithEmailAndPassword(email, password);

    /* もしアバター画像が存在する場合の処理 */
    let url: string = "";
    if (avatarImage) {
      //ランダムな英数字を持ったファイルネームを作成
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;

      /* storageにファイルを格納している */
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      /* storageに格納されている画像のURLを取得している */
      url = await storage.ref(`avatars`).child(fileName).getDownloadURL();
    }

    /* authオブジェクトのuserにユーザーネームとアバター画像を反映させている */
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });

    /* 登録されたユーザーネームとアバター画像をreduxのstateに登録している */
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
  };

  /* Googleアカウントのサインインの処理 */
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLogin ? "Sign in" : "Register"}
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {!isLogin && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <Box textAlign={"center"}>
                    <IconButton>
                      <label>
                        <AccountCircle fontSize="large" />
                        <input type="file" onChange={onChangeImageHandler} />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />
              <Grid container>
                <Grid item xs>
                  <span onClick={() => setOpenModal(true)}>
                    Forgot password ?
                  </span>
                </Grid>
                <Grid item>
                  <span onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Create new account ?" : "Back to login"}
                  </span>
                </Grid>
              </Grid>
              <Button
                disabled={
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6 || !avatarImage
                }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={
                  isLogin
                    ? async () => {
                        try {
                          await signInEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        try {
                          await signUpEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                }
              >
                {isLogin ? "Login" : "Register"}
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signInGoogle}
              >
                Sign In with Google
              </Button>
            </Box>
          </Box>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div>
              <div>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                  style={{ backgroundColor: "#fff" }}
                />
                <IconButton onClick={sendResetEmail}>
                  <Send />
                </IconButton>
              </div>
            </div>
          </Modal>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Auth;
