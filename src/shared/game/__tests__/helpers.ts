
export const dateGen = function*(delta: number = 1) {
  let current = 0
  while(true) {
    const next = current + delta
    yield new Date(next)
    current = next 
  }
}