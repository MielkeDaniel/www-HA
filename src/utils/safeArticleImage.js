import * as path from "https://deno.land/std@0.171.0/path/mod.ts";
import * as mediaTypes from "https://deno.land/std@0.171.0/media_types/mod.ts";

const uploadProfilePicture = async (image) => {
  if (image) {
    const filename = generateFilename(image);

    const destFile = await Deno.open(
      path.join(Deno.cwd(), "assets", filename),
      {
        create: true,
        write: true,
        truncate: true,
      },
    );
    await image.stream().pipeTo(destFile.writable);
    return filename;
  }
  return null;
};

export function generateFilename(file) {
  return (
    "articleimages/" +
    crypto.randomUUID() +
    "." +
    mediaTypes.extension(file.type)
  );
}

export default uploadProfilePicture;
