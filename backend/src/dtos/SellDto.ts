import { ApiProperty } from "@nestjs/swagger";


export class SellDto{
    @ApiProperty()
    readonly address: string;
    @ApiProperty()
    readonly token: string;
    @ApiProperty()
    readonly amount: number;
    @ApiProperty()
    readonly exchangeToken: string;
    @ApiProperty()
    readonly unitAmount: number
}