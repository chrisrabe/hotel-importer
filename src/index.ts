import dotenv from 'dotenv';
dotenv.config();
import { importer } from './split-importer/v1';

importer().then();
