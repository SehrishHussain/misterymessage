 import dbConnect from "@/lib/dbConnect";
 import UserModel from "@/model/User";  
import bcrypt from "bcryptjs"; 

 import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";   


 export async function POST(request: Request) {
    console.log("Endpoint hit"); 
    await dbConnect()
    console.log("db connected");
    

    try {
        const {username, email, password} = await request.json()
        const existingUserVerificationByUsername =await 
         UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerificationByUsername) {
            return Response.json({
                success: false, //cz registration is done
                message: "Username is already taken"
            }, {status: 400})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                success: false,
                message: "User already exist with this email"
            }, {status: 400})                
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new 
                Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
            
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
            })
            await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success){
            console.error("Email error details:", emailResponse.message); 
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }
        return Response.json({
                success: true,
                message: "user registered successfully. Please verify your email"
            }, {status: 201})
    } catch (error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            message: "error registering user"
        },
    {
        status: 500
    })
        
    }
 }

 