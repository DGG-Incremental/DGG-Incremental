const defaults = require("lodash/defaults")

class Game {
  constructor(state = {}) {
    this.state = defaults({}, state, {
      initialScore: 0,
      passiveIncome: 0,
      actions: [],
      lastSynced: null
    })
    this.state.lastSynced = new Date(this.state.lastSynced)
  }

  pushAction(action) {
    const timestamp = new Date()
    this.state.actions.push({ action, timestamp })
  }

  click(action) {

    if(!this.validate(action)) return false;
    this.state.passiveIncome += action.incomeGained;
    this.state.initialScore += action.moneyAdded - action.cost;
    this.pushAction(action);
    return true;
  }



  applyIncome() {

  }

  getCurrentState() {
    return this.state.initialScore;
  }

  validate(action) {
    if(action.cost === 0) return true;
    if(action.cost > this.state.initialScore) return false;
  }

  fastForward(game) {
    // Return a game object that is passed game + actions in current game that
    // have a time stamp after passed game
    const actions = this.state.actions.filter(
      a => a.timestamp > game.state.lastSynced
    )
    return new Game({
      ...game.state,
      actions
    })
  }
}

export default Game
