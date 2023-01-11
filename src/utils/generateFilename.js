import * as mediaTypes from "https://deno.land/std@0.171.0/media_types/mod.ts";

export function generateFilename(file) {
  return (
    "profilepictures/" +
    crypto.randomUUID() +
    "." +
    mediaTypes.extension(file.type)
  );
}

export default generateFilename;
