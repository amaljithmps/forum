module.exports = (app,ForumModel) => {
    app.post('/new', (req,res) => {
        try{
            let entry = new ForrumModel({
                author: req.body.author,
                message: req.body.message
            });
            entry.save().then(() => {
                return res.status(201).json({
                    success: true,
                    message: 'Posted!'
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: 'Error Occured!'
                });
            });
        } catch(Error) {
            res.send(Error);
        }
    });

}