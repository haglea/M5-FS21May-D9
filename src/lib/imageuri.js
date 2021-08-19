import imageDataURI from "image-data-uri"

export const encodeImageUrl = async (blogUrl) => {
    const encodedUrl = await imageDataURI.encodeFromURL(blogUrl)
    return encodedUrl
}