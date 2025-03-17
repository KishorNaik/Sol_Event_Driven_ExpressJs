import { IsSafeString } from "@/shared/utils/validations/decorators/isSafeString";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

// #region Request DTO
export class CreateUserRequestDto{

  @IsNotEmpty()
  @IsString()
  @IsSafeString()
  @Type(()=> String)
  public fullName:string;

  @IsNotEmpty()
  @IsString()
  @IsSafeString()
  @IsEmail()
  @Type(()=> String)
  public email:string;
}
//#endregion

// #region Response DTO
export class CreateUserResponseDto{
  message:string;
}
//#endregion
