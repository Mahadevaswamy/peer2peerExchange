import { ApiProperty } from "@nestjs/swagger";


export class withdrawDto{
    @ApiProperty()
    readonly sellOrderID: number;
    @ApiProperty()
    readonly address: string;

}