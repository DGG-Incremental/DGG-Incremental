import { Entity, PrimaryColumn, Column, BaseEntity, VersionColumn } from "typeorm";
import { GameState, Game } from "@game";

@Entity()
export default class PlayerGameState extends BaseEntity {
	@PrimaryColumn()
	name: string;

	@VersionColumn()
	version: number;

	@Column({ type: "jsonb" })
	gameState: GameState;

	static async getOrCreate(name: string): Promise<PlayerGameState> {
		const existing = await this.findOne(name);
		if (existing) {
			const { state } = new Game(existing.gameState);
			existing.gameState = state;
			return existing;
		}
		return await this.init(name);
	}

	static async init(name: string) {
		const game = new Game({ lastSynced: new Date() });
		return await this.create({
			gameState: game.state,
			name,
		}).save();
	}

	static async getLeaderboard() {
		return await this.createQueryBuilder()
			.select("name")
			.addSelect(`"gameState"->>'yees'`, "yees")
			.addSelect(`"gameState"->>'pepes'`, "pepes")
			.where(`"gameState"->>'pepes' IS NOT NULL`)
			.where(`"gameState"->>'yees' IS NOT NULL`)
			.orderBy(`(cast("gameState"->>'yees' as int) + cast("gameState"->>'pepes' as int))`, "DESC")
			.limit(50)
			.getRawMany();
	}

	static async getTotals() {
		return await this.createQueryBuilder()
			.select(`sum(cast("gameState"->>'pepes' as int))`, "pepes")
			.addSelect(`sum(cast("gameState"->>'yees' as int))`, "yees")
			.getRawOne();
	}
}
