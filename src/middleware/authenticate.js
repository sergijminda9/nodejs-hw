import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  if (!sessionId || !accessToken) {
    next(createHttpError(401, 'Missing access token'));
    return;
  }

  const session = await Session.findOne({ _id: sessionId, accessToken });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  if (new Date() > session.accessTokenValidUntil) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await User.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;
  next();
};
