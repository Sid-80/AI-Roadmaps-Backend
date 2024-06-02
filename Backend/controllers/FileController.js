import { File } from "../models/FileModel.js";
import { User } from "../models/UserModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const CreateFileController = asyncHandler(async (req, res) => {
  const { userId, fileName, fileDescription } = req.body();

  if (!userId || !fileName || !fileDescription)
    return res.status(406).json({ message: "Invalid input data!" });

  const user = await User.findById(userId);

  if (!user) return res.status(401).json({ message: "Unauthorized User" });

  const f1 = await File.create({
    name: fileName,
    description: fileDescription,
    public: false,
    archive: false,
    createdBy: userId
  });

  return res.status(201).json({File:f1});
  
});
