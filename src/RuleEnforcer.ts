var checker = require('check-word');
var words = checker('en');

import { Card } from './Card'
import { Clue } from './Clue'
import { SPlayer } from './SPlayer'
import { SOperative } from './SOperative';
import { SSpymaster } from './SSpymaster';
import { SLoiterer } from './SLoiterer';
import { Team, Turn } from './constants/Constants';
import { Game } from './Game'

export module RuleEnforcer {
  export function isValidName(name: string) { return /^[a-z_ ]+$/i.test(name); }
  
  export function isValidNumGuesses(guesses: number) {
    return guesses >= 0 && guesses <= 9;
  }

  export function isValidWord(word: string) {
    return words.check(word.toLocaleLowerCase());
  }

  export function isWordOnBoard(word: string, cards: Card[]): boolean {
    return cards.some(card => card.word.toLocaleLowerCase() === word.toLocaleLowerCase());
  }

  export function isLegalClue(clue: Clue, cards: Card[]): boolean {
    return isValidWord(clue.word) && isValidNumGuesses(clue.num) && !isWordOnBoard(clue.word, cards);
  }

  export function isPlayerTurn(game: Game, player: SPlayer) {
    return game.currTeam === player.team && game.turn === player.role;
  }

  export function isPlayerSpy(game: Game, player: SPlayer): boolean {
    return player.role === Turn.spy;
  }

  export function isSelectableCard(game: Game, cardIndex: number): boolean {
    return !game.board.cards[cardIndex].revealed;
  }

  export function canStartGame(sloitererRoster: [string[], string[]]) {
    let redTeam = sloitererRoster[1];
    let blueTeam = sloitererRoster[0];
    return blueTeam.length >= 2 && redTeam.length >= 2;
  }

  export function canSubmitGuess(game: Game): [boolean, number | null] {
    let ops: SOperative[] = game.findOperatives().filter(op =>
      op.team === game.currTeam
    );
    let selectedCard: Card | undefined = ops[0].selected;
    if(typeof selectedCard === 'undefined') { return [false, null] };

    let canGuess = ops.every((op: SOperative) => op.selected === selectedCard);
    return [canGuess, canGuess ? game.board.cards.indexOf(selectedCard) : null];
  }
}
