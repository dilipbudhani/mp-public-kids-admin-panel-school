import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    filename: string,
    folder: string
) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: folder,
                public_id: filename.split('.')[0], // Use filename without extension as public_id
                overwrite: true,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result?.secure_url,
                    publicId: result?.public_id,
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;
