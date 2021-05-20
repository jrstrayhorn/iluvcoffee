import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'; // no magic string!!

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
