import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/IdValidationPipe'
import { ActorDto } from './actor.dto'
import { ActorService } from './actor.service'

@Controller('actors')
export class ActorController {
	constructor(private readonly ActorService: ActorService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.ActorService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.ActorService.getAll(searchTerm)
	}

	@Get(':_id')
	@Auth('admin')
	async get(@Param('_id', IdValidationPipe) _id: string) {
		return this.ActorService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.ActorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':_id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('_id', IdValidationPipe) _id: string,
		@Body() dto: ActorDto
	) {
		return this.ActorService.update(_id, dto)
	}

	@Delete(':_id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('_id', IdValidationPipe) _id: string) {
		return this.ActorService.delete(_id)
	}
}
