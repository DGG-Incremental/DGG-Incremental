import React from "react"

import somaImage from '../../skelington.svg'

interface SomaProps {}
const Soma = ({ }: SomaProps) => {
  return (
    <div className="soma">
      <img src={somaImage} style={{ maxWidth: '300px', margin: '0 auto', display: 'block' }} alt="" />
    </div>
  )
}
export default Soma;