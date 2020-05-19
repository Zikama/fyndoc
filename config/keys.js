module.exports = {
    mongoURI: process.env.MONGODB_URI || `mongodb+srv://zikamaSadja:kampala2@@sadjadev-rg6yy.mongodb.net/sadja?retryWrites=true&w=majority&useUnifiedTopology=true ` || "mongodb://localhost:27017/sadja",
    dbname: `sadja`,
    sessionsURI: process.env.MONGODB_URI || `mongodb+srv://zikamaSadja:kampala2@@sadjadev-rg6yy.mongodb.net/mySessions?retryWrites=true&w=majority` || "mongodb://localhost:27017/mySessions" || "mongodb://localhost:27017/mySessions",
    autoPass: 'sadja@000',
    pass: "lLloovUY4HNw",
    user: "nemie@alenzone.com",
    defaultEmail: 'nemie@alenzone.com',
    altEmail: 'nehemiezikama@gmail.com'
};