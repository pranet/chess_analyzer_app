// @flow

export type TTreeMenuData = {
  name: string,
  children: Array<TTreeMenuData>,
};

class ChessTrieNode {
  label: string;
  children: Map<string, ChessTrieNode>;
  frequency: number;

  constructor(label: string) {
    this.label = label;
    this.children = new Map();
    this.frequency = 0;
  }

  addMove(move: string): ChessTrieNode {
    this.frequency += 1;
    if (this.children.get(move) == null) {
      this.children.set(move, new ChessTrieNode(move));
    }
    const ret = this.children.get(move);
    if (ret == null) {
      throw new Error("Impossible, but needed to keep Flow happy");
    }
    return ret;
  }
}

export default class ChessTrie {
  root: ChessTrieNode;

  constructor() {
    this.root = new ChessTrieNode("*");
  }

  addGame(moves: Array<string>) {
    var curr = this.root;
    for (const move of moves) {
      curr = curr.addMove(move);
    }
    curr.frequency += 1;
  }

  convertToTreeMenu(
    curr: ChessTrieNode = this.root,
    depth: number = 0
  ): TTreeMenuData {
    const children_as_tree_menu = [];
    const children_sorted = [...curr.children.values()].sort(
      (a, b) => b.frequency - a.frequency
    );
    for (const val of children_sorted) {
      children_as_tree_menu.push(this.convertToTreeMenu(val, depth + 1));
    }
    return {
      children: children_as_tree_menu,
      name: `${curr.label} -> ${curr.frequency}`,
    };
  }
}
