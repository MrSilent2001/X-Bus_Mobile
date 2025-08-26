// utils/cloudinary.ts
export const uploadToCloudinary = async (fileUri: string) => {
    const cloudName = "<YOUR_CLOUDINARY_CLOUD_NAME>";
    const uploadPreset = "<YOUR_UPLOAD_PRESET>";

    const data = new FormData();
    data.append("file", {
        uri: fileUri,
        type: "image/jpeg",
        name: "profile.jpg",
    } as any);
    data.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: data,
        });
        const result = await response.json();
        return result.secure_url; // URL of uploaded image
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        return null;
    }
};
