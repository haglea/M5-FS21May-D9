/* ---------------- PUT /files/upload ----------------  */
/* ---------------- GET  /files/PDFDownload ----------------  */

import express from "express"
import multer from "multer"
import { getAuthors, writeAuthors, getBlogPosts, writeBlogPosts, saveBlogPostsCover, getAuthorsReadableStream } from "../../lib/fs-tools.js"
import { extname } from "path"
import { pipeline } from "stream" //core module
import { getPDFReadableStream } from "../../lib/pdf.js"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import json2csv from "json2csv"

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary, // grabs CLOUDINARY_URL from process.env.CLOUDINARY_URL
  params: {
    folder: "authorsavatar",
  },
})

const filesRouter = express.Router()

// PUT /files/:aID/uploadAvatar
filesRouter.put("/:aID/uploadAvatar", multer({ storage: cloudinaryStorage }).single("avatar"), async (req, res, next) => {
  try {
    console.log(req.file)
    const authors = await getAuthors()
    const authorIndex = authors.findIndex(
        (a) => a.id === req.params.aID
      );
      console.log(authorIndex)
      if (!authorIndex == -1) {
        res
          .status(404)
          .send({ message: `Author with ${req.params.aID} is not found!` });
      }
    const previousAuthorData = authors[authorIndex];
    //const fileName = `${req.params.aID}${extname(req.file.originalname)}`
    
    const updatedAuthor = { 
        ...previousAuthorData, 
        avatar: req.file.path, 
        updatedAt: new Date(), 
        id: req.params.aID 
    }
    authors[authorIndex] = updatedAuthor;
    //await saveAuthorsPicture(fileName, req.file.buffer)    
    
    const remainingAuthors = authors.filter(a => a.id !== req.params.aID)
    remainingAuthors.push(updatedAuthor)

    await writeAuthors(remainingAuthors)    
    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

// PUT /files/:blogPostID/uploadCover
filesRouter.put("/:blogPostID/uploadCover", multer().single("cover"), async (req, res, next) => {
  try {
    console.log(req.file)
    const blogPosts = await getBlogPosts()
    const blogPostIndex = blogPosts.findIndex(
        (b) => b.id === req.params.blogPostID
      );
      console.log(blogPostIndex)
      if (!blogPostIndex == -1) {
        res
          .status(404)
          .send({ message: `Blog post with ${req.params.blogPostID} is not found!` });
      }
    const previousBlogPostData = blogPosts[blogPostIndex];
    const fileName = `${req.params.blogPostID}${extname(req.file.originalname)}`
    
    const updatedBlogPost = { 
        ...previousBlogPostData, 
        cover: `http://localhost:3001/img/blogposts/${fileName}`, 
        updatedAt: new Date(), 
        id: req.params.blogPostID 
    }
    blogPosts[blogPostIndex] = updatedBlogPost;
    await saveBlogPostsCover(fileName, req.file.buffer)    
    
    const remainingBlogPosts = blogPosts.filter(b => b.id !== req.params.blogPostID)
    remainingBlogPosts.push(updatedBlogPost)

    await writeBlogPosts(remainingBlogPosts)    
    res.send(updatedBlogPost)
  } catch (error) {
    next(error)
  }
})


filesRouter.get("/PDFDownload/:blogID", async (req, res, next) => {
  try {
    const filename = "blogpost.pdf"
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`) // this header tells the browser to open the "save file as" dialog

    const blogPosts = await getBlogPosts()
    const blogPost = blogPosts.find(b => b.id === req.params.blogID)
    const source = await getPDFReadableStream(blogPost)
    const destination = res

    pipeline(source, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})

// GET CSV file
filesRouter.get("/CSVDownload", async (req, res, next) => {
  try {
    const filename = "test.csv"
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`) // this header tells the browser to open the "save file as" dialog
    const source = getAuthorsReadableStream()
    const transform = new json2csv.Transform({ fields: ["name", "surname", "email", "id"] })
    const destination = res

    pipeline(source, transform, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})


export default filesRouter