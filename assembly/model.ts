import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

@nearBindgen
export class Player {
    id: string;
    name: string;
    //description: string;
    image: string;
    //location: string;
    price: u128;
    owner: string;
    sold: u32;
    rarity: string;
    age: u8;
    position: string;
    on_sale: boolean;
    public static fromPayload(payload: Player): Player {
        const player = new Player();
        player.id = payload.id;
        player.name = payload.name;
        //player.description = payload.description;
        player.image = payload.image;
        //player.location = payload.location;
        player.price = payload.price;
        player.owner = context.sender;

        player.rarity = payload.rarity;
        player.age = payload.age;
        player.position = payload.position;
        player.on_sale = false;
        return player;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
    public putOnSale(sell_price: u128, on_sale: boolean): void {
        this.price = sell_price;
        this.on_sale = on_sale;
    }
    public changeOwner(new_owner: string): void {
        this.owner = new_owner;
    }
}

export const listedPlayers = new PersistentUnorderedMap<string, Player>("LISTED_PLAYERS_v2");
