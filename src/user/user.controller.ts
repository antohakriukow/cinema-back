import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Types } from 'mongoose'
import { IdValidationPipe } from 'src/pipes/IdValidationPipe'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'
import { UserModel } from './user.model'

@Controller('users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.UserService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.UserService.updateProfile(_id, dto)
	}

	@Get('profile/favorites')
	@Auth()
	async getFavorites(@User('_id') _id: Types.ObjectId) {
		return this.UserService.getFavoriteMovies(_id)
	}

	@Put('profile/favorites')
	@HttpCode(200)
	@Auth()
	async toggleFavorites(
		@Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User() user: UserModel
	) {
		return this.UserService.toggleFavorite(movieId, user)
	}

	@Get('count')
	@Auth('admin')
	async getCountUsers() {
		return this.UserService.getCount()
	}

	@Get()
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.UserService.getAll(searchTerm)
	}

	@Get(':_id')
	@Auth('admin')
	async getUser(@Param('_id', IdValidationPipe) _id: string) {
		return this.UserService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':_id')
	@HttpCode(200)
	@Auth('admin')
	async updateUser(
		@Param('_id', IdValidationPipe) _id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.UserService.updateProfile(_id, dto)
	}

	@Delete(':_id')
	@HttpCode(200)
	@Auth('admin')
	async deleteUser(
		@Param('_id', IdValidationPipe) _id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.UserService.delete(_id)
	}
}
