import { Player, listedPlayers } from './model';
import { ContractPromiseBatch, context, u128 } from 'near-sdk-as';

export function setPlayer(player: Player): void {
    let storedPlayer = listedPlayers.get(player.id);
    if (storedPlayer !== null) {
        throw new Error(`a player with ${player.id} already exists`);
    }
    listedPlayers.set(player.id, Player.fromPayload(player));
}

export function getPlayer(id: string): Player | null {
    return listedPlayers.get(id);
}

export function getPlayers(): Player[] {
    return listedPlayers.values();
}

export function buyPlayer(playerId: string, new_owner: string): void {
  const player = getPlayer(playerId);
  if (player == null) {
      throw new Error("player not found");
  }
  if (player.price.toString() != context.attachedDeposit.toString()) {
      throw new Error("attached deposit should equal to the player's price");
  }
  if(player.on_sale == false){
     throw new Error("Can't buy selected player, as this NFT is not listed for sale at the moment.");
  }
  ContractPromiseBatch.create(player.owner).transfer(context.attachedDeposit);
  player.incrementSoldAmount();
  player.putOnSale(u128.from(0),false);
  player.changeOwner(new_owner);
  listedPlayers.set(player.id, player);
}

export function putPlayerOnSale(playerId: string, sell_price: u128): void{
    const player = getPlayer(playerId);
  if (player == null) {
      throw new Error("player not found");
  }
  if (player.price.toString() != context.attachedDeposit.toString()) {
      throw new Error("attached deposit should equal to the player's price");
  }
  player.putOnSale(sell_price,true);
  listedPlayers.set(player.id, player);

}