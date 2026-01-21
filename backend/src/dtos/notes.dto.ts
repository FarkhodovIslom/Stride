import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsMongoId,
    MaxLength,
    MinLength,
    IsJSON,
} from 'class-validator';

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    @MinLength(1, { message: 'Title cannot be empty' })
    @MaxLength(200, { message: 'Title must not exceed 200 characters' })
    title!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500000, { message: 'Content must not exceed 500KB' })
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
    @MinLength(1, { message: 'Title cannot be empty' })
    @MaxLength(200, { message: 'Title must not exceed 200 characters' })
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500000, { message: 'Content must not exceed 500KB' })
    content?: string;

    @IsOptional()
    @IsMongoId({ message: 'Invalid lesson ID' })
    lessonId?: string | null;

    @IsOptional()
    @IsMongoId({ message: 'Invalid category ID' })
    categoryId?: string | null;
}
