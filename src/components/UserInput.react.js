// @flow

import React from "react";
import { useState } from "react";

type Props = {
  username: string,
  setUsername: (string) => void,
  numGames: number,
  setNumGames: (number) => void,
  playedAs: "white" | "black",
  setPlayedAs: ("white" | "black") => void,
};

export default function UserInput(props: Props): React$Node {
  const [name, setName] = useState(props.username);
  const [numGames, setNumGames] = useState(props.numGames);
  const [playedAs, setPlayedAs] = useState(props.playedAs);

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        props.setUsername(name);
        props.setNumGames(numGames);
        props.setPlayedAs(playedAs);
      }}
    >
      <label>
        Username:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Number of games:
        <input
          type="number"
          value={numGames}
          onChange={(e) => setNumGames(e.target.value)}
        />
      </label>
      <label>
        Played as:
        <select value={playedAs} onChange={(e) => setPlayedAs(e.target.value)}>
          <option value="white">WHITE</option>
          <option value="black">BLACK</option>
        </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
