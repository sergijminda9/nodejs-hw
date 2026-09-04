import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    next(createHttpError(400, 'No file'));
    return;
  }

  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);

  req.user.avatar = result.secure_url;
  await req.user.save();

  res.status(200).json({
    url: result.secure_url,
  });
};
