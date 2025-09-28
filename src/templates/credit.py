def credit_alert(
    first_name: str,
    amount: str,
    sender_acc: str,
    sender_name: str,
    description: str,
    new_balance: str,
    date: str,
    account_number: str,
):
    credit_html_message = f"""
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #4CAF50; text-align: center;">Credit Alert</h2>
    <p>Hi {first_name},</p>
    <p>Your SwiftPay account <b>{account_number}</b> has been <span style="color: #4CAF50;">credited</span>.</p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 15px;">
      <p><b>Amount:</b> ${amount}</p>
      <p><b>From:</b> {sender_acc}{" "}({sender_name})</p>
      <p><b>Description:</b> {description}</p>
      <p><b>Date:</b> {date}</p>
      <p><b>Status:</b> Successful </p>
    </div>
    <p style="margin-top: 20px;"> <b>Available Balance:</b> ${new_balance}</p>
    <p style="color: #777777; font-size: 12px; margin-top: 20px; text-align: center;">Thank you for using SwiftPay </p>
  </div>
</div>

"""
    return credit_html_message
