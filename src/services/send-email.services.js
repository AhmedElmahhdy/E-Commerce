import nodemailer from "nodemailer";


const sendEmail = async ({to ='', from='', text='', subject=''}) => {
    const transporter = nodemailer.createTransport({
        host:"localhost",
        port:587 , 
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        },
        service:"gmail",
    })

   const emailInfo = await transporter.sendMail({
        from:from,
        to,
        subject,
        html:text

    })

    return emailInfo;

}
export default sendEmail