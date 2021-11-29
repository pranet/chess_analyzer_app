// @flow

import React from "react";
import { useEffect, useState } from "react";

import TreeMenu from "react-simple-tree-menu";
// import default minimal styling or your own styling
import "../node_modules/react-simple-tree-menu/dist/main.css";

type TGameData = {
  played_as: "black" | "white",
  end_time: number,
  moves: Array<string>,
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

function convertPGNToMoves(raw_pgn: string): Array<string> {
  const maybe_pgn = raw_pgn.match(/1\. .*/);
  if (maybe_pgn === null) {
    return [];
  }
  const pgn_without_timestamps = maybe_pgn.toString().replace(/{.*?}/g, "");
  const moves = pgn_without_timestamps.match(/[a-zA-Z]+[\d]?[#\+]?[\-]?[O]?/g);
  if (moves === null) {
    return [];
  }
  if (moves.length % 2 === 1) {
    moves.push("NAN");
  }
  const result = [];
  for (var i = 0; i < moves.length / 2; i += 1) {
    result.push(`${i + 1}. ${moves[2 * i]} ${moves[2 * i + 1]} `);
  }
  return result;
}

async function fetchAllGames(username: string): Promise<Array<TGameData>> {
  const archive_response = await fetch(
    `https://api.chess.com/pub/player/${username}/games/archives`
  );

  const archive_json = await archive_response.json();
  const archive_urls: Array<string> = archive_json["archives"];

  // this is deliberately sequential because parallel fetches are missing cors
  // headers for some reason.
  // https://www.chess.com/clubs/forum/view/cors-error-while-requesting-games
  const all_games = [];
  for (const archive_url of archive_urls) {
    const games_response = await fetch(archive_url);
    const games_json = await games_response.json();
    all_games.push(...games_json["games"]);
  }
  return all_games
    .map((game_data) => {
      return {
        played_as:
          game_data["black"]["username"] === username ? "black" : "white",
        end_time: game_data["end_time"],
        moves: convertPGNToMoves(game_data["pgn"]),
      };
    })
    .sort((left, right) => right.end_time - left.end_time);
}

export default function Application(): React$Node {
  const [username, setUsername] = useState("pranetverma");
  const [allGames, setAllGames] = useState(null);

  useEffect(() => {
    setAllGames(fetchAllGames(username));
  }, [username]);
  return <TreeMenu data={fakeTreeData} />;
}
