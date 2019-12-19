import _ from 'lodash'

enum ActionType {
	click = 'click',
	addGenerator = 'addGenerator'
}

interface Action {
	action: ActionType
	timestamp: Date
}

interface GameState {
  initialScore: number
  generators: number
  actions: Action[]
  lastSynced: Date
}

export default class Game {
  state: GameState

  constructor(state: Partial<GameState> = {}) {
    this.state = defaults({}, state, {
      initialScore: 0,
      generators: 0,
      actions: [],
      lastSynced: new Date(0)
    })

    if (this.state.lastSynced) {
      this.state.lastSynced = new Date(this.state.lastSynced)
    }
  }

  pushAction(type: ActionType) {
    const timestamp = new Date()
    this.state.actions.push({ action: type, timestamp })
  }

  click() {
    this.pushAction(ActionType.click)
  }

  addGenerator() {
    this.pushAction(ActionType.addGenerator)
  }

  getCurrentState(timestamp?: Date) {
    const ts = timestamp || new Date()
    const { lastSynced, actions, initialScore, generators } = this.state
    const currentActions = actions.filter(
      a => a.timestamp > lastSynced && a.timestamp <= ts
    )
    const clicks = currentActions.filter(a => a.action === ActionType.click).length

    const addGeneratorActions = currentActions.filter(
      a => a.action === ActionType.addGenerator
    )
    const generatorCount = addGeneratorActions.length + generators

    const generatorClickProduction =
      sum(
        addGeneratorActions.map(ga => {
          const interval = ts.getTime() - ga.timestamp.getTime()
          return toInteger(interval / 1000) // One click per second
        })
      ) +
      ((ts.getTime() - lastSynced.getTime()) * generators) / 1000

    const score = initialScore + clicks + generatorClickProduction
    return {
      score,
      generators: generatorCount
    }
  }

  validate() {
    return true
  }

  fastForward(game: Game) {
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

// module.exports = Game
