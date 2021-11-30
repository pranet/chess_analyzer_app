// @flow

import type { TTreeMenuData } from "../logic/ChessTrie";
import type { TGameData } from "../logic/GameDataFetcher";

import ChessTrie from "../logic/ChessTrie";

import React from "react";
import { useEffect, useState } from "react";
import Tree from "react-d3-tree";

type Props = {
  allGames: Array<TGameData>,
  username: string,
  numGames: number,
  playedAs: "white" | "black",
};

export default function ChessTree(props: Props): React$Node {
  const [treeData, setTreeData] = useState<TTreeMenuData>({});
  const [translate, setTranslate] = useState<{ x: number, y: number }>({
    x: 0,
    y: 0,
  });
  const ref = React.createRef();
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

  useEffect(() => {
    const dimensions = ref.current?.getBoundingClientRect();
    if (dimensions == null) {
      return;
    }
    setTranslate({
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    });
  }, []);

  return (
    <div id="treeWrapper" style={{ width: "50em", height: "20em" }} ref={ref}>
      <Tree
        data={treeData}
        initialDepth={1}
        orientation={"vertical"}
        translate={translate}
        zoom={0.5}
      />
    </div>
  );
}
