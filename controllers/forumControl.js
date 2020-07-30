const { $where } = require("../models/forumModel");
const authenticate = require('../authenticate');
const cors = require('./cors');

module.exports = (app, ForumModel) => {
    ////////////
    //Posts
    ////////////
    //create post
    app.post('/new', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        try {

            let entry = new ForumModel({
                author: req.user._id,
                message: req.body.message,
                community: req.body.community
            });
            entry.save().then(() => {
                return res.status(201).json({
                    success: true,
                    message: 'Posted Successfully!'
                });
            }).catch((e) => {
                return res.status(400).json({
                    success: false,
                    message: 'Error occurred!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });

    //get all post
    app.get('/all', cors.cors, (req, res) => {
        try {
            
            ForumModel.find().populate('author').populate('comments.author').then((resp) => {
                return res.status(200).json({
                    success: true,
                    message: resp
                });
            }).catch((e) => {
                return res.status(400).json({
                    success: false,
                    message: 'Entry not found!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });

     //get one post
     app.get('/posts', cors.cors, (req, res) => {
        try {
            ForumModel.findById(req.body.f_id).populate('author').populate('comments.author').then((resp) => {
                if(resp != null){
                    return res.status(200).json({
                        success: true,
                        message: resp
                    });
                }
                else{
                    return res.status(404).json({
                        success: false,
                        message: 'Post not found'
                    });
                }
                
            }).catch((e) => {
                return res.status(400).json({
                    success: false,
                    message: 'Post does not Exist!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });

     //get all posts from one community
    app.get('/community', cors.cors, (req, res) => {
        try {
            let query = {community: req.body.community }
            ForumModel.find(query).populate('author').populate('comments.author').then((resp) => {
                if(resp != null){
                    return res.status(200).json({
                        success: true,
                        message: resp
                    });
                }
                else{
                    return res.status(404).json({
                        success: false,
                        message: 'No Posts'
                    });
                }
                
            }).catch((e) => {
                return res.status(400).json({
                    success: false,
                    message: 'Community does not Exist!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });

    //update a post
    app.patch('/update', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        try {
            let query = {_id: req.body.f_id};
            let newData = {$set:{message:req.body.message}}
            ForumModel.updateOne(query,newData).populate('author').then((resp) => {
                return res.status(200).json({
                    success: true,
                    message: resp
                });
            }).catch((e) => {
                return res.status(400).json({
                    success: false,
                    message: 'Post does not Exist!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });

    //delete one post
    app.delete('/delete', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        try {
            let query = {_id: req.body.f_id};
            ForumModel.deleteOne(query, () => {
                return res.status(200).json({
                    success: true,
                    message: 'Post deleted'
                });
            }).catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: 'Post does not Exist!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });


    //comments
    //new comment
    app.post('/comment', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        try {
            let query = {_id: req.body.f_id};
            let newComment = {$push:{comments:{commentAuthor: req.user._id, commentMessage: req.body.cmessage}}};
            ForumModel.findById(query).populate('author').populate('comments.author').then((resp) => {
                if(resp != null){
                    ForumModel.updateOne(query,newComment).then((resp) => {
                        return res.status(200).json({
                            success: true,
                            message: resp
                        });
                    }).catch((err) => {
                        return res.status(500).json({
                            message: 'Operation Failed'});
                    });
                }
                else{
                    return res.status(404).json({
                        success: false,
                        message: 'Post not found'
                    });
                }
                
            }).catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: 'Post does not Exist!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });

    //upVotes on post
    app.patch('/upvote', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        try {
            let query = {_id: req.body.f_id};
            let upData = {$inc:{upvotes:1}}
            ForumModel.updateOne(query,upData).populate('author').populate('comments.author').then((resp) => {
                return res.status(200).json({
                    success: true,
                    message: resp
                });
            }).catch((e) => {
                return res.status(400).json({
                    success: false,
                    message: 'Post does not Exist!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });

     //downVotes on post
     app.patch('/downvote', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        try {
            let query = {_id: req.body.f_id};
            let downData = {$inc:{downvotes:1}}
            ForumModel.updateOne(query,downData).populate('author').populate('comments.author').then((resp) => {
                return res.status(200).json({
                    success: true,
                    message: resp
                });
            }).catch((e) => {
                return res.status(400).json({
                    success: false,
                    message: 'Post does not Exist!'
                });
            });

        } catch (error) {
            res.send(error);
        }
    });
}