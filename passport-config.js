const bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const LocalStrategy = require('passport-local').Strategy;
ObjectId = require('mongodb').ObjectID;

function initialize (passport, getUserByEmail, getUserById) {

    const authenticateUser = async (email,password,done)  => {
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("pokerDB");
                    dbo.collection("Users").findOne({email:email}, async function(err, user) {
                        if (err) throw err;
                           if (user == null){
                                return done(null,false,{message: "No user with that email"})
                            }
                            try {
                               if(await bcrypt.compare(password,user.password)) {
                                    return done(null,user)
                                }
                                else {
                                    return done(null,false,{message: 'Password incorrect'})
                                }
                            }
                            catch(e) {
                                return done(e);
                            }
                            db.close();
                    });
                  })                    
        }
        passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
        try { 
            
            passport.serializeUser((user, done) => {
                
                done(null, user._id)
                }
            
            
            );
            
        }
        catch (e) {
            console.log(e);
        }

        passport.deserializeUser((id, done) => {
                    //return done(null, function (id) {
                        MongoClient.connect(url, function(err, db) {
                            if (err) throw err;
                            var dbo = db.db("pokerDB");
                            dbo.collection("Users").findOne({"_id":ObjectId(id)}, function(err, result) {
                              if (err) throw err;
                              return done(null,result);
                              db.close();
                            });
                          })

                    //})
                })
    
    }
module.exports = initialize