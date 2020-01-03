import { Entity, PrimaryColumn, Column, BaseEntity, VersionColumn } from "typeorm"
import { GameState } from "clicker-game"

@Entity()
export default class PlayerGameState extends BaseEntity {
  @PrimaryColumn()
  name: string

  @VersionColumn()
  version: number

  @Column({ type: "jsonb" })
  gameState: GameState

  static async getOrCreate(name: string) {
    return (await this.findOne(name)) || (await this.init(name))
  }

  static async init(name: string) {
    return await this.create({
      gameState: {lastSynced: new Date()},
      name,
    }).save()
  }
}
