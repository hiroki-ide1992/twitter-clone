# プロジェクトの説明

Redux Toolkit と Firebase の学習を目的とした プロジェクト<br>
機能を体系的に知るための学習であるためペルソナ設定などは行ってないが、認証を実装する都合上デザインテンプレートが必要だったため、MaterialUI のテンプレートを用いてページ実装をしている。<br>
またこの PJ に関しては反復学習としても使用する前提なので、ツイート画面に関してはだわったスタイリングなどは省略している。

## 完成サンプル URL

https://twitter-clone.hiroki-ide.site/

## 技術目標

・Firebase の Authentication、Storage、Database を React と連携して利用すること<br>

## 一周後の所感

■ 出来たこと<br>
・技術目標については達成した、特に Authentication でユーザーの状態を監視する onAuthStateChanged の仕組みについてはよく理解できたと思う<br>
・Storage に画像を保存する際、同名ファイルをアップすると上書きされる仕様を発見したため、アップロードの際にはユニークな接頭辞を自動で付与する仕組みを実装した<br>
・Redux Toolkit の Slice、Store の連携については概ね理解が進めていると実感<br>
・環境変数を利用する事の意義について、機密保持、という新しい優位性を知ることが出来た<br>
・これはついでの成果となるが Webpack5 の build 環境設定についても改めて理解が進んだ

<br>
■ 今後の課題に感じること<br>
・Firebaseの機能に関しては一通りの理解はしたものの、まだ知識として定着しているという実感が無い<br>
・実装すること自体に多くの時間的リソースが割かれているので、コンテンツやサービスとしての面白味を追加する余裕が生まれていない<br>
・データベースのデータ構造を建て増しで構築していったので、構造がかなり冗長になってしまった
