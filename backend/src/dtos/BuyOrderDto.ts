import { ApiProperty } from "@nestjs/swagger";

export class BuyOrderDto{
       @ApiProperty()
       address: string
       @ApiProperty()
       sellOrderID: number;
       @ApiProperty()
       tokenId: string;
       @ApiProperty()
       amount: number;
}
