  
module.exports = (app, ForumModel) => {

    //create post
    app.post('/new', (req, res) => {
        try {

            let entry = new ForumModel({
                author: req.body.author,
                message: req.body.message
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
    app.get('/posts', (req, res) => {
        try {
            
            ForumModel.find().then((resp) => {
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
     app.get('/posts/:id', (req, res) => {
        try {
            ForumModel.findById(req.params._id).then((resp) => {
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

    //delete one post
    app.delete('/posts/:id', (req, res) => {
        try {
            ForumModel.findById(req.params._id).then((resp) => {
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
