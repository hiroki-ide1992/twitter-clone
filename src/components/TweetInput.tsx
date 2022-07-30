import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth, storage, db } from "../firebase";
import { Avatar, Button, IconButton } from "@mui/material";
import firebase from "firebase/app";
import AddAPhotoIcon from "@mui/icons-material/LockOutlined";

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  /* ユーザーがアップロードした時の処理 */
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = ""; //連続して同じファイルを選択するとonChangeが発動しないためリセットする
    }
  };

  /* Tweetボタンを押したときの処理 */
  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tweetImage) {
      //ランダムな英数字を持ったファイルネームを作成
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;

      /* images/というフォルダに画像を保存している */
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        //storageの内容に変化が起きた時の処理、3つの引数を受け取る
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {}, //プログレス状態で行いたい処理
        (err) => {
          //エラーが起きた時の処理
          alert(err.message);
        },
        async () => {
          //storageへ画像が保存できた時の処理
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              //URLの取得に成功した時の処理
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url, //strageにあるURLをデータベースへ保存している
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(), //firebaseのサーバーからタイムスタンプを取得
                username: user.displayName,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), //firebaseのサーバーからタイムスタンプを取得
        username: user.displayName,
      });
    }
    setTweetMsg("");
    setTweetImage(null);
  };

  return (
    <>
      <form onSubmit={sendTweet}>
        <div className="tweet_form">
          {/* アバター画像をクリックしたらログアウトする */}
          <Avatar
            className="tweet_avatar"
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
        </div>
        <input
          className={"tweet_input"}
          placeholder="What's happening?"
          type="text"
          autoFocus
          value={tweetMsg}
          onChange={(e) => setTweetMsg(e.target.value)}
        />
        <IconButton>
          <label>
            <AddAPhotoIcon className="tweet_addIcon" />
            <input
              type="file"
              className="tweet_hiddenIcon"
              onChange={onChangeImageHandler}
            />
          </label>
        </IconButton>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={tweetMsg ? "tweet_sendBtn" : "tweet_sendDisableBtn"}
        >
          Tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
