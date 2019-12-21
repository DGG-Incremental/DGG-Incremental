const some = require("lodash/some")
const orderBy = require("lodash/orderBy")

const exceedsRateLimit = (game, rateLimit = 15) => {
  const timeline = orderBy(game.state.actions, ["timestamp"])
  return some(timeline, (action, i, actions) => {
    const start = action.timestamp
    const end = new Date(start.getTime() + 1000)
    let k
    for (k = i + 1; k < actions.length; k++) {
      if (actions[k].timestamp.getTime() > end.getTime()) {
        return rateLimit <= k - i - 1
      }
    }
    return rateLimit <= k - i - 1
  })
}

module.exports = {
  exceedsRateLimit
}
