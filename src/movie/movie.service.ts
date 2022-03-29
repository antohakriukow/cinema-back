import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieModel } from './movie.model'
import { Types } from 'mongoose'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel)
		private readonly MovieModel: ModelType<MovieModel>
	) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('actors genres')
			.exec()
	}

	async getMostPopular() {
		return this.MovieModel.find({ countOpened: { $gt: 0 } })
			.populate('genres')
			.sort({ countOpened: -1 })
			.exec()
	}

	async bySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!doc) throw new NotFoundException('Movie not found')
		return doc
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = await this.MovieModel.find({ actors: actorId }).exec()
		if (!docs) throw new NotFoundException('Movies not found')
		return docs
	}

	async byGenres(genresIds: Types.ObjectId[]) {
		const docs = await this.MovieModel.find({
			genres: { $in: genresIds },
		}).exec()
		if (!docs) throw new NotFoundException('Movies not found')
		return docs
	}

	async updateCountOpened(slug: string) {
		return this.MovieModel.findOneAndUpdate(
			{ slug },
			{ $inc: { countOpened: 1 } },
			{ new: true }
		).exec()
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.MovieModel.findByIdAndUpdate(
			id,
			{
				rating: newRating,
			},
			{
				new: true,
			}
		).exec()
	}

	// Admin place

	async byId(_id: string) {
		const doc = await this.MovieModel.findById(_id)
		if (!doc) throw new NotFoundException('Model not found')

		return doc
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			poster: '',
			bigPoster: '',
			actors: [],
			genres: [],
			title: '',
			slug: '',
			videoUrl: '',
		}
		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true,
		}).exec()

		if (!updateDoc) throw new NotFoundException('Actor not found')

		return updateDoc
	}

	async delete(_id: string) {
		const deleteDoc = this.MovieModel.findByIdAndDelete(_id).exec()

		if (!deleteDoc) throw new NotFoundException('Actor not found')

		return deleteDoc
	}
}
