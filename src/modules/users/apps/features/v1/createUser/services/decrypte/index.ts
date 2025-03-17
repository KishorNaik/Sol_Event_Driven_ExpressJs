import { CreateUserRequestDto } from "@/modules/users/apps/contracts/v1/createUser/index.Contract";
import { sealed } from "@/shared/utils/decorators/sealed";
import { AesDecryptWrapper } from "@/shared/utils/helpers/aes";
import { Service } from "typedi";

@sealed
@Service()
export class CreateUserDecryptRequestService extends AesDecryptWrapper<CreateUserRequestDto>{
  public constructor(){
    super();
  }
}
