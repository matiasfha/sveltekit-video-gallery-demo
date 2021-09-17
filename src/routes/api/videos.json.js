
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
	api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
	api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET
});


function getVideos() {
	return new Promise((resolve, reject) => {
		cloudinary.api.resources({ resource_type: 'video', }, function (error, result) {
			if (error) {
				reject(error);
			}
			resolve(result);
		});
	});
}

export async function get() {
    try {
        const videos = await getVideos()
		return {
            body: videos.resources
        }
    }
    catch(e) {
        console.error(e);
        return  {
            status: 500,
            body: e
        }
    }    
}
