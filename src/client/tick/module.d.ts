declare module "timesync" {
  export interface ITimeSyncOptions {
    server: string
  }

  export interface ITimeSyncCallback {
    (offset: number, options: ITimeSyncOptions): void
  }

  export interface ITimeSyncClient {
    destroy(): void
    now(): number
    on(event: string, callback: ITimeSyncCallback): void
    off(event: string, callback: ITimeSyncCallback[]): void
    sync(): void
  }

  export function create(options?: ITimeSyncOptions): ITimeSyncClient
}
