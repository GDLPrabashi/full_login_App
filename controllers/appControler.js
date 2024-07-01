import UserModel from "../model/User.model.js"
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";
import ENV from "../config.js";



/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

 
export async function register(req,res){

    try {
        const { username, password, profile, email } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send(error);
    }

}

/**POST: "http://localhost:8080/api/login"
 * @param :{
 * "username":"example123",
 * "password":"admin123"
 * }
 * 
 */

export async function login (req,res){
    const {username ,password} = req.body;
    try {
        UserModel.findOne({username})
        .then(user =>{
            bcrypt.compare(password,user.password)
            .then(passwordCheck =>{

                if(!passwordCheck) return res.status(400).send({error :"Don't have password"})
            
                    //create JWD token
                    const token=jwt.sign({
                                userId :user._id,
                                username:user.username
                            },ENV.JWT_SECRET,{expiresIn :"24h"})

                        return res.status(200).send({
                           msg: "Login succcessfil...!",
                           username:user.username,
                           token
                        
                        });
                })
            .catch(error =>{
                return res.status(400).send({error:"Password does not match"})
            })


        }).catch(error =>{
            return res.status(404).send({error :"Username not found"});
        })
        
    } catch (error) {
         return res.status(500).send({error})
        
    }
}

/**GET : http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    const {username} = req.params;

    try {
        if(!username) return res.status(501).send({error:"Invalid Username"});
        
            UserModel.findOne({username},function(err,user){
                if(err) return res.status(500).send({err});
                if(!user) return res.status(501).send({error:"Couldn't find the user"})
                
                const {password , ...rest} = Object.assign({},user.toJSON());
                return res.status(201).send(user)
            })
        
    } catch (error) {
        return res.status(404).send({error :"Cannot find user details"});
    }
    
}

/**PUT : http://localhost:8080/api/updateuser 
 * @param:{
 * "id":"<userid>"
 * }
 * body:{
 * firstname :"".
 * address:"",
 * profile:""
 * }
*/
export async function updateUser(req,res){
    try {
    
        const id = req.query.id;

        if(id){

            //update the data
            UserModel.updateOne({_id:id},body,function(err,data){
                if(err) throw err;
                return res.status(201).send({msg:"Record updated...!"});
            })

        }else{
            return res.status(401).send({error :"User nnot found...!"})
        }
        
    } catch (error) {
        return res.status(401).send({error})
        
    }
}

/**GET :http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    res.json("updateUser route")
}

/**GET :http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    res.json("verifyOTP route")
}

// successfully refirect user when OTP is valid
/**GET :http://localhost:8080/api/createResetSession*/
export async function createResetSession(req,res){
   res.json("createResetSession route")
}

//update the passwod when we have valid sesssion
/**PUT :http://localhost:8080/api/resetPassword */
export async function resetPaasword(req,res){
    res.json("resetPaasword route")
}