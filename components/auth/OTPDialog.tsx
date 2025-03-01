import { Dialog } from "primereact/dialog";
import { useState, useEffect } from "react";
import stylesButton from "../navbarComp/navbar.module.css";
import sendEmail from "@/utils/sendEmail";

interface OTPDialogProps {
  visible: boolean;
  onHide: () => void;
  onVerificationComplete: () => Promise<void>;
  loading: boolean;
  userEmail: string;
  onDialogClose: () => void;
}

const OTPDialog: React.FC<OTPDialogProps> = ({
  visible,
  onHide,
  onVerificationComplete,
  loading: formLoading,
  userEmail,
  onDialogClose
}) => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [verifying, setVerifying] = useState(false);

  const OTP_EXPIRY_MINUTES = 10;

  useEffect(() => {
    if (visible) {
      handleGenerateAndSendOTP();
    }
  }, [visible]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPEmail = async (email: string, otp: string) => {
    const emailData = {
      sendToEmail: [email],
      subject: 'Email Verification Code',
      message: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
    };

    await sendEmail(emailData);
  };

  const handleGenerateAndSendOTP = async () => {
    try {
      const newOTP = generateOTP();
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + OTP_EXPIRY_MINUTES);
      
      setGeneratedOTP(newOTP);
      setOtpExpiry(expiryTime);
      
      await sendOTPEmail(userEmail, newOTP);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Failed to send verification code. Please try again.');
    }
  };

  const isOTPExpired = () => {
    if (!otpExpiry) return true;
    return new Date() > otpExpiry;
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      
      if (isOTPExpired()) {
        setOtpError(true);
        setErrorMessage('Verification code has expired. Please request a new one.');
        return;
      }

      if (otp !== generatedOTP) {
        setOtpError(true);
        setErrorMessage('Invalid verification code. Please try again.');
        return;
      }

      await onVerificationComplete();
    } catch (error) {
      setOtpError(true);
      setErrorMessage('An error occurred during verification. Please try again.');
    } finally {
      setVerifying(false);
      setOtp('');
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setOtpError(false);
    setErrorMessage('');
    await handleGenerateAndSendOTP();
  };

  const handleHide = () => {
    setOtp('');
    setOtpError(false);
    setErrorMessage('');
    onDialogClose(); // Call this new function to reset parent state
    onHide();
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleHide}
      className="w-[90vw] max-w-md"
      header="Email Verification"
      dismissableMask={false}
      contentClassName="bg-white rounded-lg shadow-xl"
      headerClassName="bg-white rounded-t-lg border-b pb-4 px-6 pt-6"
    >
      <div className="flex flex-col items-center p-6">
        <p className="text-gray-600 mb-6 text-center">
          We've sent a verification code to <span className="font-medium text-gray-900">{userEmail}</span>. 
          Please enter it below. The code will expire in {OTP_EXPIRY_MINUTES} minutes.
        </p>
        <input
          type="text"
          maxLength={6}
          className="w-full px-4 py-3 text-center text-2xl tracking-widest border rounded-lg mb-4 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            setOtpError(false);
          }}
          placeholder="000000"
        />
        {otpError && (
          <p className="text-red-500 mb-4 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        )}
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={handleVerify}
            disabled={otp.length !== 6 || verifying}
            className={`${stylesButton.gradient_button} w-full px-6 py-2.5 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all`}
          >
            {verifying ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify"
            )}
          </button>
          <button
            onClick={handleResendOTP}
            disabled={verifying}
            className="text-sky-600 hover:text-sky-700 text-sm font-medium py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Resend Code
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default OTPDialog; 