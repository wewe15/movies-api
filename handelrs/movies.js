const multer = require('multer');
const { Op } = require("sequelize");
const { Movie } = require('../models');
const { authAdmin } = require('../middlewares/authentication');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!');
            err.name = 'ExtensionError';
            return cb(err);
        }
    },
});

const allMovies = async (req, res) => {
    try {
        const where = {};
        const category_id = req.query.category_id;
        const rate = req.query.rate;
        const title = req.query.title;

        if(category_id || rate || title) {
            where[Op.and] = [];
            if(category_id) {
                where[Op.and].push({category_id})
            }

            if(rate) {
                where[Op.and].push({
                    rate: {
                        [Op.gte]: rate
                    }
                });
            }

            if(title) {
                where[Op.and].push({
                    title: {
                        [Op.substring]: title
                    }
                });
            }
        }

        const movies = await Movie.findAll({ where });

        if(movies.length === 0) {
            return res.json({massage: 'Movies not found'});
        }

        res.status(200).json(movies)

    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);

        if(!movie) {
            return res.json({message: 'Movie not found'});
        }

        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({error: 'Somthing went wrong'});
    }

}

const createMovie = async (req, res) => {
    try {
        const movie = {
            title: req.body.title,
            description: req.body.description,
            rate: req.body.rate,
            category_id: req.body.category_id,
            image: req.file.path,
        }

        if(
            !movie.title ||
            !movie.description ||
            !movie.rate ||
            !movie.image ||
            !movie.category_id
            ) {
                return res.status(404).json({message: 'fill all input please.'});
            }

        const newMovie = await Movie.create(movie);

        res.status(201).json(newMovie);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const updateMovie = async (req, res) => {
    try {
        const {title, description, rate, category_id} = req.body;
        const image = req.file?.path;
        let movie = await Movie.findByPk(req.params.id);

        if(!movie) {
            return res.json({message: 'Movie not found'});
        }

        if(title) movie.title = title;

        if(description) movie.description = description;

        if(rate) movie.rate = rate;

        if(category_id) movie.category_id = category_id;

        if(image) movie.image = image;

        movie = await movie.save();

        res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);

        if(!movie) {
            return res.json({message: 'Movie not found'});
        }

        await movie.destroy();

        res.status(200).json({message: 'Movie deleted!'});
    } catch (error) {
        res.status(500).json({error: 'Somthing went wrong'});
    }
}

const moviesRoutes = (app) => {
    app.get('/movies',authAdmin, allMovies)
    app.post('/movies',authAdmin, upload.single('image'), createMovie)
    app.get('/movies/:id',authAdmin, getMovieById)
    app.patch('/movies/:id',authAdmin, upload.single('image'), updateMovie)
    app.delete('/movies/:id',authAdmin, deleteMovie)
}

module.exports = moviesRoutes;
