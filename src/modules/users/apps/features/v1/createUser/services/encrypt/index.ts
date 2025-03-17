import { CreateUserResponseDto } from "@/modules/users/apps/contracts/v1/createUser/index.Contract";
import { sealed } from "@/shared/utils/decorators/sealed";
import { AesEncryptWrapper } from "@/shared/utils/helpers/aes";
import { Service } from "typedi";

@sealed
@Service()
export class CreateUserEncryptResponseService extends AesEncryptWrapper<CreateUserResponseDto> {
  public constructor(){
    super();
  }
}
