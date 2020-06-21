  
module.exports = (app, ForumModel) => {

    //create post
    app.post('/new', (req, res) => {
        try {
            
            let entry = new ForumModel({
                name: req.body.name,
                address: req.body.address
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
    app.get('/fetch', (req, res) => {
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

   
}
