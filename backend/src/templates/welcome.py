def welcome_email(first_name: str, account_number: str):
    html = f"""
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h1 style="color: #164E63;">Welcome to SwiftPay!</h1>
            <p>Hi {first_name},</p>
            <p>We’re thrilled to have you on board. SwiftPay is here to make your transactions smooth, fast, and secure. This is your generated account number {account_number}</p>
            <p>Start exploring your account today and enjoy seamless payments at your fingertips!</p>
            <p>Cheers,<br>
            Marvel<br>
            Founder of SwiftPay</p>
        </div>
    </div>
    """
    return html
