import dotenv from 'dotenv';
dotenv.config();

import { loginToGimmonix } from './auth';

loginToGimmonix().then((res) => console.log(res));
