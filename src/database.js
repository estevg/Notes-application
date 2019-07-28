const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI 
? process.env.MONGODB_URI : 'mongodb://localhost/notes-db-app';

mongoose.connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('Conectado a la bd'))
    .catch(err => console.log(err))