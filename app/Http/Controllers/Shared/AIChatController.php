<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'sometimes|array|max:50',
            'history.*.role' => 'required|in:user,assistant',
            'history.*.content' => 'required|string',
        ]);

        $apiKey = env('OPENAI_API_KEY');

        // If OpenAI is not configured, use fallback AI
        if (!$apiKey) {
            return $this->fallbackAI($request->message);
        }

        try {
            // Build conversation history
            $messages = [];
            
            // System message to guide the AI
            $messages[] = [
                'role' => 'system',
                'content' => 'You are a helpful AI assistant for a Library Book Borrowing and Inventory Management System. You help users with questions about the system, library management, and general inquiries. Be friendly, professional, and concise. If asked about features not yet implemented, kindly mention they might be coming soon.'
            ];

            // Add conversation history
            if (isset($request->history) && is_array($request->history)) {
                foreach ($request->history as $msg) {
                    $messages[] = [
                        'role' => $msg['role'],
                        'content' => $msg['content'],
                    ];
                }
            }

            // Add current message
            $messages[] = [
                'role' => 'user',
                'content' => $request->message,
            ];

            // Call OpenAI API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => $messages,
                'max_tokens' => 500,
                'temperature' => 0.7,
            ]);

            if (!$response->successful()) {
                Log::error('OpenAI API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                // Fallback to simple AI if OpenAI fails
                return $this->fallbackAI($request->message);
            }

            $data = $response->json();
            $aiResponse = $data['choices'][0]['message']['content'] ?? 'I couldn\'t generate a response. Please try again.';

            // Simulate thinking process (optional - you can enhance this)
            $thinking = $this->generateThinking($request->message);

            return response()->json([
                'response' => trim($aiResponse),
                'thinking' => $thinking,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Chat Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Fallback to simple AI if exception occurs
            return $this->fallbackAI($request->message);
        }
    }

    private function fallbackAI(string $message): \Illuminate\Http\JsonResponse
    {
        $lowerMessage = strtolower($message);
        $thinking = $this->generateThinking($message);
        
        // Greeting responses
        if (preg_match('/\b(hi|hello|hey|greetings)\b/i', $lowerMessage)) {
            return response()->json([
                'response' => 'Hello! I\'m your AI assistant for the Library Management System. How can I help you today?',
                'thinking' => null,
            ]);
        }

        // How are you
        if (preg_match('/how are you|how\'s it going/i', $lowerMessage)) {
            return response()->json([
                'response' => 'I\'m doing great, thank you for asking! I\'m here to help you with the library management system. What would you like to know?',
                'thinking' => null,
            ]);
        }

        // Library management questions
        if (str_contains($lowerMessage, 'book') || str_contains($lowerMessage, 'library')) {
            return response()->json([
                'response' => 'This is a Library Book Borrowing and Inventory Management System. You can manage books, track borrowings, handle user accounts, and more. The book management features are currently being developed. Is there something specific you\'d like to know?',
                'thinking' => $thinking,
            ]);
        }

        // User management
        if (str_contains($lowerMessage, 'user') || str_contains($lowerMessage, 'account')) {
            return response()->json([
                'response' => 'You can manage users through the Users section in the menu. Admins can create, edit, and delete user accounts, assign roles (admin or staff), and manage permissions. Would you like to know more about a specific feature?',
                'thinking' => $thinking,
            ]);
        }

        // QR Scanner
        if (str_contains($lowerMessage, 'qr') || str_contains($lowerMessage, 'scan')) {
            return response()->json([
                'response' => 'The QR Scanner feature allows you to scan QR codes using your webcam or by uploading images. This will be useful for quickly checking out and returning books once the borrowing system is implemented.',
                'thinking' => $thinking,
            ]);
        }

        // Help/Features
        if (str_contains($lowerMessage, 'help') || str_contains($lowerMessage, 'feature') || str_contains($lowerMessage, 'can you do')) {
            return response()->json([
                'response' => 'I can help you with:\n\n• User Management - Create and manage user accounts\n• QR Code Scanning - Scan codes for quick access\n• Email Reminders - Schedule notifications\n• General questions about the system\n\nBook and borrowing management features are coming soon! What would you like to know more about?',
                'thinking' => $thinking,
            ]);
        }

        // Thank you
        if (str_contains($lowerMessage, 'thank') || str_contains($lowerMessage, 'thanks')) {
            return response()->json([
                'response' => 'You\'re welcome! If you have any other questions, feel free to ask. I\'m here to help!',
                'thinking' => null,
            ]);
        }

        // Bye
        if (preg_match('/\b(bye|goodbye|see you|exit)\b/i', $lowerMessage)) {
            return response()->json([
                'response' => 'Goodbye! Have a great day! Feel free to come back anytime you need assistance.',
                'thinking' => null,
            ]);
        }

        // Default response with helpful info
        return response()->json([
            'response' => 'I\'m here to help you with the Library Management System! You can ask me about:\n\n• Managing users and accounts\n• Using the QR scanner\n• Email reminder features\n• General system information\n\nNote: For better responses, consider configuring OpenAI API in your .env file. What would you like to know?',
            'thinking' => $thinking,
        ]);
    }

    private function generateThinking(string $message): ?string
    {
        // Simple thinking generation based on message content
        $lowerMessage = strtolower($message);

        if (str_contains($lowerMessage, 'how') || str_contains($lowerMessage, 'what')) {
            return 'Let me analyze your question and provide a helpful answer...';
        }

        if (str_contains($lowerMessage, 'why')) {
            return 'Considering the context and reasoning behind this...';
        }

        if (str_contains($lowerMessage, 'book') || str_contains($lowerMessage, 'library')) {
            return 'Processing your library management query...';
        }

        // Return null for simple greetings or short messages
        if (strlen($message) < 20) {
            return null;
        }

        return 'Analyzing your request...';
    }
}
