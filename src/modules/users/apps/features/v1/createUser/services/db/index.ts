import { CreateUserRequestDto } from '@/modules/users/apps/contracts/v1/createUser/index.Contract';
import { sealed } from '@/shared/utils/decorators/sealed';
import { ResultError, ResultExceptionFactory } from '@/shared/utils/exceptions/results';
import { IServiceHandlerAsync } from '@/shared/utils/helpers/services';
import { StatusCodes } from 'http-status-codes';
import { Ok, Result } from 'neverthrow';
import { Service } from 'typedi';

interface ICreateUserDbServiceParameters {
	dto: CreateUserRequestDto;
}

export interface ICreateUserDbServiceResults {
	message: string;
}

interface ICreateUserDbService
	extends IServiceHandlerAsync<ICreateUserDbServiceParameters, ICreateUserDbServiceResults> {}

@sealed
@Service()
export class CreateUserDbService implements ICreateUserDbService {
	public async handleAsync(
		params: ICreateUserDbServiceParameters
	): Promise<Result<ICreateUserDbServiceResults, ResultError>> {
		try {
			if (!params)
				return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST, 'param is required');

			if (!params.dto)
				return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST, 'dto is required');

			// Db Code......

			const message: string = 'User Created Successfully';

			const result: ICreateUserDbServiceResults = {
				message: message,
			};

			return new Ok(result);
		} catch (ex) {
			const error = ex as Error;
			return ResultExceptionFactory.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
		}
	}
}
