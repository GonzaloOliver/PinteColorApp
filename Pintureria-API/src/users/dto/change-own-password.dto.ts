import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeOwnPasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly repeatNewPassword: string;
}
