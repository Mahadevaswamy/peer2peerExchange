import { ApiProperty } from "@nestjs/swagger";


export class SellerListDto{
    requestId: number;
    @ApiProperty()
    address: string;
    @ApiProperty()
    token: string;
    @ApiProperty()
    amount: number;
    @ApiProperty()
    exchangeToken: string;
    @ApiProperty()
    unitAmount: number
}