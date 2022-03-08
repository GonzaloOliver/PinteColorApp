import { IsEnum, IsNotEmpty, IsNumberString } from "class-validator";
import { ProofType } from "src/shared/enums";

export class NextNumberDto {
    @IsEnum(ProofType)
    @IsNotEmpty()
    readonly proofType: ProofType;

    @IsNumberString()
    @IsNotEmpty()
    readonly posId: number;
}