
export const dateGen = function*(delta: number = 1) {
  let current = 0
  while(true) {
    yield new Date(current)
    current = current + delta
  }
}