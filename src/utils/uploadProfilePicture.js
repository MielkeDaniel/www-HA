import * as path from "https://deno.land/std@0.171.0/path/mod.ts";
import * as mediaTypes from "https://deno.land/std@0.171.0/media_types/mod.ts";
import * as changeUserModel from "../model/changeUserModel.js";
import * as readUserModel from "../model/readUserModel.js";

const uploadProfilePicture = async (ctx, image) => {
  // delete old porfilepicture from the server
  const user = await readUserModel.getUser(ctx.db, ctx.user);
  if (user.profilePicture && user.profilepicture !== "images/standard-pp.png") {
    try {
      await Deno.remove(path.join(Deno.cwd(), "assets", user.profilePicture));
    } catch {
      console.log("no image to remove");
    }
  }

  const filename = generateFilename(image);
  changeUserModel.imageUpload(ctx.db, ctx.user, filename);
  const destFile = await Deno.open(path.join(Deno.cwd(), "assets", filename), {
    create: true,
    write: true,
    truncate: true,
  });
  await image.stream().pipeTo(destFile.writable);
};

export function generateFilename(file) {
  return (
    "profilepictures/" +
    crypto.randomUUID() +
    "." +
    mediaTypes.extension(file.type)
  );
}

export default uploadProfilePicture;
