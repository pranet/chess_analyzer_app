// @flow

import React from "react";
import { useEffect, useState } from "react";

import fetchAllGames from "../logic/GameDataFetcher";
import ChessTree from "./ChessTree.react";
import UserInput from "./UserInput.react";

export default function Application(): React$Node {
  const [username, setUsername] = useState<string>("pranetverma");
  const [numGames, setNumGames] = useState<number>(50);
  const [playedAs, setPlayedAs] = useState<"white" | "black">("white");
  const [allGames, setAllGames] = useState([]);

  useEffect(() => {
    fetchAllGames(username).then((games) => setAllGames(games));
  }, [username]);
  return (
    <>
      <UserInput
        username={username}
        numGames={numGames}
        playedAs={playedAs}
        setUsername={setUsername}
        setNumGames={setNumGames}
        setPlayedAs={setPlayedAs}
      />
      <ChessTree
        allGames={allGames}
        numGames={numGames}
        playedAs={playedAs}
        username={username}
      />
    </>
  );
}
