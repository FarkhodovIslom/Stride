import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsMongoId,
    MaxLength,
} from 'class-validator';

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MaxLength(200, { message: 'Title must not exceed 200 characters' })
    title!: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsMongoId({ message: 'Invalid lesson ID' })
    lessonId?: string;

    @IsOptional()
    @IsMongoId({ message: 'Invalid category ID' })
    categoryId?: string;
}

export class UpdateNoteDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Title cannot be empty' })
    @MaxLength(200, { message: 'Title must not exceed 200 characters' })
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsMongoId({ message: 'Invalid lesson ID' })
    lessonId?: string | null;

    @IsOptional()
    @IsMongoId({ message: 'Invalid category ID' })
    categoryId?: string | null;
}
