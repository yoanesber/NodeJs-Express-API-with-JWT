import Router from 'express';

import AuthController from '../controllers/auth.controller';
import CatchAsync from '../utils/catchAsync.util';
import Validate from '../middlewares/validator.middleware';
import { LoginRequestSchema } from '../dtos/loginRequest.dto';
import { RefreshTokenRequestSchema } from '../dtos/refreshTokenRequest.dto';

const router = Router();

router.post('/login', Validate(LoginRequestSchema), CatchAsync(AuthController.login));
router.post('/refresh-token', Validate(RefreshTokenRequestSchema), CatchAsync(AuthController.refreshToken));

export default router;
