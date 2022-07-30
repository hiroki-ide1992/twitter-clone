import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar } from "@mui/material/";
import { Message, Send } from "@mui/icons-material";

interface PROPS {
  postId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
}

interface COMMENT {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
}

const Post: React.FC<PROPS> = (props) => {
  /* コメント一覧のstateを保持する */
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: "",
      avatar: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("posts") //取得したいデータベースのコレクション名
      .doc(props.postId)
      .collection("comments")
      .orderBy("timestamp", "desc") //取得したpostsのデータをtimestampの降順にしている
      .onSnapshot(
        //firebaseにあるコレクションが変化した時に走る処理
        (snapshot) => {
          setComments(
            //.collection("posts")のドキュメントをdocsで全て取得しmap関数で繰り返し処理をしている
            snapshot.docs.map((doc) => ({
              id: doc.id,
              avatar: doc.data().avatar,
              text: doc.data().text,
              timestamp: doc.data().timestamp,
              username: doc.data().username,
            }))
          );
        }
      );

    return () => {
      unSub();
    };
  }, [props.postId]);

  /* コメントを打ち込んだユーザーの情報を取得 */
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* コメントが付いたTweetに"comments"というコレクションを追加して、コメントした内容とユーザー情報を格納する */
    db.collection("posts").doc(props.postId).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
  };

  return (
    <div className={"post"}>
      <div className="post_avatar">
        <Avatar src={props.avatar} />
      </div>
      <div className="post_body">
        <div>
          <div className="post_header">
            <h3>
              <span className="post_headerUser">@{props.username}</span>
              <span className="post_headerTime">
                {/* firebaseで取得したtimestampのデータを通常の日時になるようにJSで処理している */}
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className="post_tweet">
            <p>{props.text}</p>
          </div>
        </div>

        {props.image && (
          <div className="post_tweetImage">
            <img src={props.image} alt="tweet" />
          </div>
        )}

        {comments.map((com) => (
          <div key={com.id} className="post_comment">
            <Avatar src={com.avatar} />

            <span className="post_commentUser">@{com.username}</span>
            <span className="post_commentText">@{com.text}</span>
            <span className="post_headerTime">
              {new Date(com.timestamp?.toDate()).toLocaleString()}
            </span>
          </div>
        ))}

        <form onSubmit={newComment}>
          <div className="post_form">
            <input
              className="post_input"
              type="text"
              placeholder="Type new comment..."
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
            />
            <button
              disabled={!comment}
              className={comment ? "post_button" : "post_buttonDisable"}
              type="submit"
            >
              <Send className={"post_sendOcon"} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
