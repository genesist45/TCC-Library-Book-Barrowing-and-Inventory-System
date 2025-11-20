<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Request Approved</title>
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
            background-color: #16a34a; /* Green for approval */
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
            background-color: #dcfce7;
            padding: 15px;
            border-left: 4px solid #16a34a;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">✅ Book Request Approved</h1>
        </div>
        
        <div class="content">
            <p>Dear {{ $bookRequest->full_name }},</p>
            
            <p>Your book request for <strong>{{ $bookRequest->catalogItem?->title ?? $bookRequest->catalog_item?->title ?? 'the requested book' }}</strong> has been approved.</p>
            
            <div class="highlight">
                <strong>📅 Return Date:</strong> {{ \Carbon\Carbon::parse($bookRequest->return_date)->format('F j, Y') }}<br>
                <strong>🕐 Return Time:</strong> {{ $bookRequest->return_time }}
            </div>
            
            <p>Please return the book on your scheduled return date.</p>
            
            <p>Thank you for using our library services!</p>
            
            <p>Best regards,<br>
            <strong>TCC Library</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
