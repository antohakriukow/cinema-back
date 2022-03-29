import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/IdValidationPipe'
import { User } from 'src/user/decorators/user.decorator'
import { SetRatingDto } from './dto/set-rating.dto'
import { RatingService } from './rating.service'

@Controller('ratings')
export class RatingController {
	constructor(private readonly RatingService: RatingService) {}

	@Get('/:movieId')
	@Auth()
	async getMovieValueByUser(
		@Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User('_id') userId: Types.ObjectId
	) {
		return this.RatingService.getMovieValueByUser(movieId, userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@HttpCode(200)
	@Auth()
	async setRating(
		@User('_id') userId: Types.ObjectId,
		@Body() dto: SetRatingDto
	) {
		return this.RatingService.setRating(userId, dto)
	}
}
