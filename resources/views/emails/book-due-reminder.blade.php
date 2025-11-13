<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Due Reminder</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 30px;
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            margin: -30px -30px 20px -30px;
        }
        .content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .highlight {
            background-color: #fef3c7;
            padding: 15px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">📚 Book Due Reminder</h1>
        </div>
        
        <div class="content">
            <p>Dear Borrower,</p>
            
            <p>This is a friendly reminder that your borrowed book is due for return.</p>
            
            <div class="highlight">
                <strong>📅 Due Date:</strong> {{ $emailData['return_date'] }}<br>
                <strong>🕐 Due Time:</strong> {{ $emailData['return_time'] }}
            </div>
            
            <p>Please return the book to the library on or before the due date to avoid any late fees.</p>
            
            <p>If you need to extend your borrowing period, please contact the library as soon as possible.</p>
            
            <p style="margin-top: 30px;">Thank you for using our library services!</p>
            
            <p>Best regards,<br>
            <strong>TCC Library</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>Scheduled at: {{ $emailData['scheduled_at'] }}</p>
        </div>
    </div>
</body>
</html>

