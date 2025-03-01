
interface EmailData {
    sendToEmail: string[];
    subject: string;
    message: string;
}

const sendEmail = async (data: EmailData) => {
    try {
        const token = localStorage.getItem("jwt");
        const dataWithFromEmail = {
            ...data,
            sendFromEmail: "telemedapp" 
        };
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_NAME}/email-service/send-email`, 
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(dataWithFromEmail),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to send email:', errorData);
        }
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};



// to use this function import sendEmail:
// import sendEmail from "@/utils/sendEmail";
// then use       await sendEmail(emailData);
// where emailData are:
// const emailData = {
//     sendToEmail: [reciver email],
//     subject: 'Subject text',
//     message: 'message text',
//   };
export default sendEmail;