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
import { CreateGenreDto } from './dto/create-genre.dto'
import { GenreService } from './genre.service'

@Controller('genres')
export class GenreController {
	constructor(private readonly GenreService: GenreService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.GenreService.bySlug(slug)
	}

	@Get('/collections')
	async getCollections() {
		return this.GenreService.getCollections()
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.GenreService.getAll(searchTerm)
	}

	@Get(':_id')
	@Auth('admin')
	async get(@Param('_id', IdValidationPipe) _id: string) {
		return this.GenreService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.GenreService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':_id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('_id', IdValidationPipe) _id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.GenreService.update(_id, dto)
	}

	@Delete(':_id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('_id', IdValidationPipe) _id: string) {
		return this.GenreService.delete(_id)
	}
}
