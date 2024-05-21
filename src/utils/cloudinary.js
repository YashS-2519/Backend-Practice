import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { resourceLimits } from 'worker_threads';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uplodeOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    console.log("File is uploded on cloudinary", response.url);
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath)  //remove locally saved temporary file as the uplode operation got failed.
    return null;
  }
}

export { uplodeOnCloudinary }


// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) { console.log(result); });