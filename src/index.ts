import dotenv from 'dotenv';
dotenv.config();
import { importer } from './split-importer';

importer().then();
