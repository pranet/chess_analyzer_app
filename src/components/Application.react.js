// @flow

import React from "react";
import { useEffect, useState } from "react";

import fetchAllGames from "../logic/GameDataFetcher";
import ChessTree from "./ChessTree.react";

export default function Application(): React$Node {
  const [username, setUsername] = useState("pranetverma");
  const [numGames, setNumGames] = useState(50);
  const [playedAs, setPlayedAs] = useState("white");
  const [allGames, setAllGames] = useState([]);

  useEffect(() => {
    fetchAllGames(username).then((games) => setAllGames(games));
  }, [username]);

  return (
    <ChessTree
      allGames={allGames}
      numGames={numGames}
      playedAs={playedAs}
      username={username}
    />
  );
}
