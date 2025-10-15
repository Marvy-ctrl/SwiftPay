def verify_email(first_name: str, url: str):
    html_message = f"""
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h1 style="color: #164E63;">Verify Your Email for SwiftPay</h1>
            <p>Hi {first_name},</p>
            <p>Thank you for signing up! Please verify your email address to activate your account.</p>
            <a href='{url}' style="display: inline-block; background-color: #164E63; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; margin-top: 20px;">Verify Email</a>
            <p style="margin-top: 20px;">If you did not create this account, please ignore this email.</p>
            <p style="color: #777777; font-size: 12px; margin-top: 20px;">This verification link will expire in 1 hour.</p>
        </div>
    </div>
    """

    return html_message
