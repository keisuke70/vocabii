import * as React from 'react';

interface EmailTemplateProps {
  userName: string;
  verificationLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  verificationLink,
}) => (
  <div>
    <h1>Welcome, {userName}!</h1>
    <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
    <p><a href={verificationLink}>Verify Email</a></p>
  </div>
);
