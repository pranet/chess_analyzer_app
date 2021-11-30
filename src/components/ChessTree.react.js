// @flow

import type { TTreeMenuData } from "../logic/ChessTrie";
import type { TGameData } from "../logic/GameDataFetcher";

import ChessTrie from "../logic/ChessTrie";

import React from "react";
import { useEffect, useState } from "react";
import TreeMenu from "react-simple-tree-menu";
// import default minimal styling or your own styling
import "../../node_modules/react-simple-tree-menu/dist/main.css";

type Props = {
  allGames: Array<TGameData>,
  username: string,
  numGames: number,
  playedAs: "white" | "black",
};

export default function ChessTree(props: Props): React$Node {
  const [treeData, setTreeData] = useState<TTreeMenuData>({});

  useEffect(() => {
    const chessTrie = new ChessTrie();
    props.allGames
      .filter((game) => {
        return game.played_as === props.playedAs;
      })
      .slice(0, props.numGames)
      .forEach((game) => chessTrie.addGame(game.moves));

    setTreeData(chessTrie.convertToTreeMenu());
  }, [props.allGames, props.playedAs, props.numGames]);
  return <TreeMenu data={treeData.nodes} hasSearch={false} />;
}
