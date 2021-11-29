// @flow

import React from "react";
import { useEffect, useState } from "react";

import TreeMenu from "react-simple-tree-menu";
// import default minimal styling or your own styling
import "../node_modules/react-simple-tree-menu/dist/main.css";

type TGameData = {
  played_as: "black" | "white",
  end_time: number,
  pgn: string,
};

const fakeTreeData = [
  {
    key: "first-level-node-1",
    label: "Node 1 at the first level",
    nodes: [
      {
        key: "second-level-node-1",
        label: "Node 1 at the second level",
        nodes: [
          {
            key: "third-level-node-1",
            label: "Last node of the branch",
            nodes: [], // you can remove the nodes property or leave it as an empty array
          },
        ],
      },
    ],
  },
  {
    key: "first-level-node-2",
    label: "Node 2 at the first level",
  },
];

async function fetchAllGames(username: string): Promise<Array<TGameData>> {
  const archive_response = await fetch(
    `https://api.chess.com/pub/player/${username}/games/archives`
  );

  const archive_json = await archive_response.json();
  const archive_urls: Array<string> = archive_json["archives"];
  const all_games = (
    await Promise.all(
      archive_urls.map(async (archive_url) => {
        const games_response = await fetch(archive_url);
        const games_json = await games_response.json();
        return games_json["games"];
      })
    )
  )
    .flat()
    .map((game_data) => {
      return {
        played_as:
          game_data["black"]["username"] === username ? "black" : "white",
        end_time: game_data["end_time"],
        pgn: game_data["pgn"],
      };
    })
    .sort((left, right) => right.end_time - left.end_time);
  return all_games;
}

export default function Application(): React$Node {
  const [username, setUsername] = useState("pranetverma");
  const [allGames, setAllGames] = useState(null);

  useEffect(() => {
    setAllGames(fetchAllGames(username));
  }, [username]);
  return <TreeMenu data={fakeTreeData} />;
}