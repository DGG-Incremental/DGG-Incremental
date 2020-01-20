import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  VersionColumn
} from "typeorm"
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
      gameState: { lastSynced: new Date() },
      name
    }).save()
  }

  static async getLeaderboard() {
    return await this.createQueryBuilder()
      .select("name")
      .addSelect(`"gameState"->>'yees'`, "yees")
      .addSelect(`"gameState"->>'pepes'`, "pepes")
      .where(`"gameState"->>'pepes' IS NOT NULL`)
      .where(`"gameState"->>'yees' IS NOT NULL`)
      .orderBy(
        `(cast("gameState"->>'yees' as int) + cast("gameState"->>'pepes' as int))`,
        "DESC"
      )
      .limit(50)
      .getRawMany()
  }

  static async getTotals() {
    return await this.createQueryBuilder()
      .select(`sum(cast("gameState"->>'pepes' as int))`, 'pepes')
      .addSelect(`sum(cast("gameState"->>'yees' as int))`, 'yees')
      .getRawOne()
  }
}
