import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserModel } from './user.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		ConfigModule,
	],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {}
