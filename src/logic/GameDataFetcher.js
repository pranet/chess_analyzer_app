// @flow

export type TGameData = {
  played_as: "black" | "white",
  end_time: number,
  moves: Array<string>,
};

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

export default async function fetchAllGames(
  username: string
): Promise<Array<TGameData>> {
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
