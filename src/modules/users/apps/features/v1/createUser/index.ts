// #region Controller

import { AesRequestDto } from '@/shared/models/request/aes.RequestDto';
import {
	Body,
	HttpCode,
	JsonController,
	OnUndefined,
	Post,
	Res,
	UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { RequestData, requestHandler, RequestHandler } from 'mediatr-ts';
import {
	DataResponse as ApiDataResponse,
	DataResponseFactory,
} from '@/shared/models/response/data.Response';
import { AesResponseDto } from '@/shared/models/response/aes.ResponseDto';
import medaitR from '@/shared/medaitR';
import { sealed } from '@/shared/utils/decorators/sealed';
import { CreateUserDecryptRequestService } from './services/decrypte';
import Container from 'typedi';
import { ENCRYPTION_KEY } from '@/config';
import {
	CreateUserRequestDto,
	CreateUserResponseDto,
} from '../../../contracts/v1/createUser/index.Contract';
import { CreateUserValidationRequestService } from './services/validations';
import { CreateUserDbService, ICreateUserDbServiceResults } from './services/db';
import { UserCreatedDomainEvent } from './events/domain/userCreated';
import { CreateUserEncryptResponseService } from './services/encrypt';

@JsonController(`/api/v1/users`)
@OpenAPI({ tags: ['users'] })
export class CreateUserController {
	@Post()
	@OpenAPI({ summary: 'Create a Users', tags: ['users'] })
	@HttpCode(StatusCodes.CREATED)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(AesRequestDto))
	public async handleAsync(@Body() request: AesRequestDto, @Res() res: Response) {
		const response = await medaitR.send<ApiDataResponse<AesResponseDto>>(
			new CreateUserCommand(request)
		);
		return res.status(response.StatusCode).json(response);
	}
}

//#endregion

// #region Command
export class CreateUserCommand extends RequestData<ApiDataResponse<AesResponseDto>> {
	private readonly _request: AesRequestDto;

	public constructor(request: AesRequestDto) {
		super();
		this._request = request;
	}

	public get request(): AesRequestDto {
		return this._request;
	}
}
// #endregion

// #region Command Handler
@sealed
@requestHandler(CreateUserCommand)
export class CreateUserCommandHandler
	implements RequestHandler<CreateUserCommand, ApiDataResponse<AesResponseDto>>
{
	private readonly _createUserDecryptRequestService: CreateUserDecryptRequestService;
	private readonly _createUserValidationRequestService: CreateUserValidationRequestService;
	private readonly _createUserDbService: CreateUserDbService;
	private readonly _createUserEncryptResponseService: CreateUserEncryptResponseService;

	public constructor() {
		this._createUserDecryptRequestService = Container.get(CreateUserDecryptRequestService);
		this._createUserValidationRequestService = Container.get(
			CreateUserValidationRequestService
		);
		this._createUserDbService = Container.get(CreateUserDbService);
		this._createUserEncryptResponseService = Container.get(CreateUserEncryptResponseService);
	}

	public async handle(value: CreateUserCommand): Promise<ApiDataResponse<AesResponseDto>> {
		try {
			if (!value)
				return DataResponseFactory.error<AesResponseDto>(
					StatusCodes.BAD_REQUEST,
					'Value parameter is required'
				);

			if (!value.request)
				return DataResponseFactory.error<AesResponseDto>(
					StatusCodes.BAD_REQUEST,
					'Request Object is required'
				);

			const aesRequestDto: AesRequestDto = value.request;

			// Decrypt Request Service
			const decryptRequestServiceResult =
				await this._createUserDecryptRequestService.handleAsync({
					data: aesRequestDto.body,
					key: ENCRYPTION_KEY,
				});
			if (decryptRequestServiceResult.isErr())
				return DataResponseFactory.error(
					decryptRequestServiceResult.error.httpCode,
					decryptRequestServiceResult.error.message
				);

			const createUserRequestDto: CreateUserRequestDto = decryptRequestServiceResult.value;

			// Validation Request Service
			const validationRequestServiceResult =
				await this._createUserValidationRequestService.handleAsync({
					dto: createUserRequestDto,
					dtoClass: CreateUserRequestDto,
				});
			if (validationRequestServiceResult.isErr())
				return DataResponseFactory.error(
					validationRequestServiceResult.error.httpCode,
					validationRequestServiceResult.error.message
				);

			// Db Service
			const createUserDbServiceResult = await this._createUserDbService.handleAsync({
				dto: createUserRequestDto,
			});
			if (createUserDbServiceResult.isErr())
				return DataResponseFactory.error(
					createUserDbServiceResult.error.httpCode,
					createUserDbServiceResult.error.message
				);

			const createUserDdbResultResponse: ICreateUserDbServiceResults =
				createUserDbServiceResult.value;

			// UserCreated Event
			await medaitR.publish(
				new UserCreatedDomainEvent(
					createUserRequestDto.email,
					createUserRequestDto.fullName
				)
			);

			// Response
			const response: CreateUserResponseDto = new CreateUserResponseDto();
			response.message = `User ${createUserRequestDto.email} created successfully`;

			const createUserEncryptResponseResult =
				await this._createUserEncryptResponseService.handleAsync({
					data: response,
					key: ENCRYPTION_KEY,
				});
			if (createUserEncryptResponseResult.isErr())
				return DataResponseFactory.error(
					createUserEncryptResponseResult.error.httpCode,
					createUserEncryptResponseResult.error.message
				);

			const aesResponseDto: AesResponseDto =
				createUserEncryptResponseResult.value.aesResponseDto;

			// Success
			return DataResponseFactory.success(
				StatusCodes.CREATED,
				aesRequestDto,
				`User ${createUserRequestDto.email} created successfully`
			);
		} catch (ex) {
			const error = ex as Error;
			return DataResponseFactory.error<AesResponseDto>(
				StatusCodes.INTERNAL_SERVER_ERROR,
				error.message
			);
		}
	}
}
// #endregion
