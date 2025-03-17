import { CreateUserRequestDto } from "@/modules/users/apps/contracts/v1/createUser/index.Contract";
import { sealed } from "@/shared/utils/decorators/sealed";
import { DtoValidation } from "@/shared/utils/validations/dto";
import { Service } from "typedi";

@sealed
@Service()
export class CreateUserValidationRequestService extends DtoValidation<CreateUserRequestDto>{

  public constructor(){
    super();
  }

}
