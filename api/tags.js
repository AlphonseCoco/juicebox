const express = require('express');
const tagsRouter = express.Router();
const { getAllTags} = require('../db');
const { getPostsByTagName} = require('../db');


tagsRouter.use((req, res, next) =>{
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/', async (req, res) =>{
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) =>{
    const { tagName } = req.params;
    try {
       const posts = await getPostsByTagName(tagName);
       const tagPost = posts.filter( post =>{
        if (post.active) {
            return true;
        }
        if (req.user && post.author.id === req.user.id){
            return true;
        }
        return false;
       })
       if(tagPost) {
            res.send(tagPost)
        } else {
            next({
                name: "TagRetrievalError",
                message: "Could not find tag"
            })
        }

    } catch({ name, message}) {
        console.error({ name, message});
    }
})

module.exports = tagsRouter;