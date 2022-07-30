import * as React from "react";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { Button } from "@mui/material/";
import TweetInput from "./TweetInput";
import Post from "./Post";

const Feed: React.FC = () => {
  /* Tweetの情報を受け取るstate */
  const [posts, setPosts] = useState([
    {
      id: "",
      avatar: "",
      image: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("posts") //取得したいデータベースのコレクション名
      .orderBy("timestamp", "desc") //取得したpostsのデータをtimestampの降順にしている
      .onSnapshot(
        //firebaseにあるコレクションが変化した時に走る処理
        (snapshot) =>
          setPosts(
            //.collection("posts")のドキュメントをdocsで全て取得しmap関数で繰り返し処理をしている
            snapshot.docs.map((doc) => ({
              id: doc.id,
              avatar: doc.data().avatar,
              image: doc.data().image,
              text: doc.data().text,
              timestamp: doc.data().timestamp,
              username: doc.data().username,
            }))
          )
      );

    return () => {
      unSub();
    };
  }, []);

  return (
    <>
      <div className="feed">
        <TweetInput />
        {posts[0]?.id && (
          <>
            {/* firebaseのデータベースにあるデータをmap関数でPost関数のpropsに渡している */}
            {posts.map((post) => (
              <Post
                key={post.id}
                postId={post.id}
                avatar={post.avatar}
                image={post.image}
                text={post.text}
                timestamp={post.timestamp}
                username={post.username}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Feed;
