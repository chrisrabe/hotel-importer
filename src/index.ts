import dotenv from 'dotenv';
dotenv.config();
import { importer } from './stream-importer';

importer().then();
