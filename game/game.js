const defaults = require("lodash/defaults")

class Game {
  constructor(state = {}) {
    this.state = defaults({}, state, {
      score: 0,
	  actions: [],
	  lastSynced: null
    })
  }

  pushAction(action) {
    const timestamp = Date.now()
    this.state.actions.push({ action, timestamp })
  }

  click() {
    this.pushAction("click")
  }

  getCurrentState() {
    const score = this.state.score + this.state.actions.filter(a => a.action === "click").length
    return {
      score
    }
  }
}

module.exports = Game
