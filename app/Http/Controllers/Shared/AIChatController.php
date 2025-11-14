<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\AiConversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIChatController extends Controller
{
    public function conversations()
    {
        $conversations = AiConversation::where('user_id', auth()->id())
            ->orderBy('updated_at', 'desc')
            ->get(['id', 'title', 'updated_at']);

        return response()->json($conversations);
    }

    public function getConversation($id)
    {
        $conversation = AiConversation::where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json($conversation);
    }

    public function saveConversation(Request $request)
    {
        $request->validate([
            'id' => 'sometimes|exists:ai_conversations,id',
            'title' => 'required|string|max:255',
            'messages' => 'required|array',
        ]);

        if (isset($request->id)) {
            $conversation = AiConversation::where('user_id', auth()->id())
                ->findOrFail($request->id);
            
            $conversation->update([
                'title' => $request->title,
                'messages' => $request->messages,
            ]);
        } else {
            $conversation = AiConversation::create([
                'user_id' => auth()->id(),
                'title' => $request->title,
                'messages' => $request->messages,
            ]);
        }

        return response()->json($conversation);
    }

    public function deleteConversation($id)
    {
        $conversation = AiConversation::where('user_id', auth()->id())
            ->findOrFail($id);

        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully']);
    }
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'sometimes|array|max:50',
            'history.*.role' => 'required|in:user,assistant',
            'history.*.content' => 'required|string',
        ]);

        $apiKey = env('OPENROUTER_API_KEY');

        if (!$apiKey) {
            return $this->fallbackAI($request->message);
        }

        try {
            $messages = [];
            
            $messages[] = [
                'role' => 'system',
                'content' => 'You are a helpful AI assistant. Be concise and friendly. Keep responses brief unless asked for details.'
            ];

            if (isset($request->history) && is_array($request->history)) {
                $recentHistory = array_slice($request->history, -10);
                foreach ($recentHistory as $msg) {
                    $messages[] = [
                        'role' => $msg['role'],
                        'content' => $msg['content'],
                    ];
                }
            }

            $messages[] = [
                'role' => 'user',
                'content' => $request->message,
            ];

            Log::info('Sending to OpenRouter API', ['message' => $request->message]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => env('APP_URL', 'http://localhost'),
                'X-Title' => 'Library Management System',
            ])->timeout(60)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'tngtech/deepseek-r1t2-chimera:free',
                'messages' => $messages,
                'max_tokens' => 1000,
                'temperature' => 0.7,
            ]);

            if (!$response->successful()) {
                Log::error('OpenRouter API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'message' => $request->message,
                ]);

                return $this->fallbackAI($request->message);
            }

            $data = $response->json();
            
            Log::info('OpenRouter API Response received', [
                'has_choices' => isset($data['choices']),
                'data' => $data
            ]);
            
            $aiResponse = $data['choices'][0]['message']['content'] ?? 'I couldn\'t generate a response. Please try again.';

            $thinking = null;
            if (isset($data['choices'][0]['message']['reasoning_content'])) {
                $thinking = $data['choices'][0]['message']['reasoning_content'];
            }

            return response()->json([
                'response' => trim($aiResponse),
                'thinking' => $thinking,
            ]);

        } catch (\Exception $e) {
            Log::error('AI Chat Exception', [
                'error' => $e->getMessage(),
                'message' => $request->message,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->fallbackAI($request->message);
        }
    }

    private function fallbackAI(string $message): \Illuminate\Http\JsonResponse
    {
        $lowerMessage = strtolower($message);
        $thinking = $this->generateThinking($message);
        
        // Greeting responses
        if (preg_match('/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i', $lowerMessage)) {
            return response()->json([
                'response' => "Hello! I'm your AI assistant. I can help you with programming, the library system, general questions, and much more. What would you like to know?",
                'thinking' => null,
            ]);
        }

        // How are you
        if (preg_match('/how are you|how\'s it going|what\'s up/i', $lowerMessage)) {
            return response()->json([
                'response' => "I'm doing great, thank you for asking! I'm ready to help you with any questions - whether it's coding, the library system, or general knowledge. What can I help you with?",
                'thinking' => null,
            ]);
        }

        // Python code requests
        if (preg_match('/python.*code|code.*python|python.*example|python.*program/i', $message)) {
            if (preg_match('/hello world|simple|basic|beginner/i', $lowerMessage)) {
                return response()->json([
                    'response' => "Here's a simple Python code example:\n\n```python\n# Hello World Program\nprint(\"Hello, World!\")\n\n# Variables and basic operations\nname = \"User\"\nage = 25\nprint(f\"My name is {name} and I am {age} years old.\")\n\n# Simple function\ndef greet(person):\n    return f\"Hello, {person}!\"\n\nprint(greet(\"Alice\"))\n```\n\nThis covers:\n• Basic print statements\n• Variables (strings and numbers)\n• String formatting (f-strings)\n• Functions with parameters and return values\n\nWould you like to see more examples?",
                    'thinking' => $thinking,
                ]);
            }
            
            if (preg_match('/calculator|math|add|subtract|multiply|divide/i', $lowerMessage)) {
                return response()->json([
                    'response' => "Here's a simple Python calculator:\n\n```python\ndef calculator():\n    print(\"Simple Calculator\")\n    print(\"1. Add\")\n    print(\"2. Subtract\")\n    print(\"3. Multiply\")\n    print(\"4. Divide\")\n    \n    choice = input(\"Enter choice (1-4): \")\n    \n    num1 = float(input(\"Enter first number: \"))\n    num2 = float(input(\"Enter second number: \"))\n    \n    if choice == '1':\n        print(f\"{num1} + {num2} = {num1 + num2}\")\n    elif choice == '2':\n        print(f\"{num1} - {num2} = {num1 - num2}\")\n    elif choice == '3':\n        print(f\"{num1} * {num2} = {num1 * num2}\")\n    elif choice == '4':\n        if num2 != 0:\n            print(f\"{num1} / {num2} = {num1 / num2}\")\n        else:\n            print(\"Error: Division by zero!\")\n    else:\n        print(\"Invalid choice\")\n\ncalculator()\n```\n\nThis calculator can add, subtract, multiply, and divide numbers!",
                    'thinking' => $thinking,
                ]);
            }
            
            // Default Python example
            return response()->json([
                'response' => "Here's a useful Python code example:\n\n```python\n# List operations\nfruits = ['apple', 'banana', 'orange', 'grape']\n\n# Print all fruits\nfor fruit in fruits:\n    print(f\"I like {fruit}\")\n\n# List comprehension\nuppercase_fruits = [fruit.upper() for fruit in fruits]\nprint(uppercase_fruits)\n\n# Dictionary example\nperson = {\n    'name': 'John',\n    'age': 30,\n    'city': 'New York'\n}\n\nprint(f\"{person['name']} is {person['age']} years old.\")\n\n# Function with default parameters\ndef greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\nprint(greet(\"Alice\"))\nprint(greet(\"Bob\", \"Good morning\"))\n```\n\nWhat specific Python topic would you like to learn more about?",
                'thinking' => $thinking,
            ]);
        }

        // JavaScript code requests
        if (preg_match('/javascript.*code|code.*javascript|js.*code|javascript.*example/i', $message)) {
            return response()->json([
                'response' => "Here's a JavaScript code example:\n\n```javascript\n// Variables (ES6+)\nconst name = \"John\";\nlet age = 25;\n\n// Template literals\nconsole.log(`My name is ${name} and I'm ${age} years old.`);\n\n// Arrow functions\nconst greet = (person) => {\n    return `Hello, ${person}!`;\n};\n\nconsole.log(greet(\"Alice\"));\n\n// Array methods\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconst evens = numbers.filter(num => num % 2 === 0);\n\nconsole.log(\"Doubled:\", doubled);\nconsole.log(\"Even numbers:\", evens);\n\n// Object\nconst person = {\n    firstName: \"Jane\",\n    lastName: \"Doe\",\n    getFullName() {\n        return `${this.firstName} ${this.lastName}`;\n    }\n};\n\nconsole.log(person.getFullName());\n```\n\nThis covers modern JavaScript features. Need help with something specific?",
                'thinking' => $thinking,
            ]);
        }

        // PHP code requests
        if (preg_match('/php.*code|code.*php|php.*example/i', $message)) {
            return response()->json([
                'response' => "Here's a PHP code example:\n\n```php\n<?php\n// Variables\n\$name = \"John\";\n\$age = 25;\n\necho \"My name is \$name and I'm \$age years old.\\n\";\n\n// Arrays\n\$fruits = ['apple', 'banana', 'orange'];\nforeach (\$fruits as \$fruit) {\n    echo \"I like \$fruit\\n\";\n}\n\n// Associative array\n\$person = [\n    'name' => 'Alice',\n    'age' => 30,\n    'city' => 'New York'\n];\n\necho \$person['name'] . \" lives in \" . \$person['city'] . \"\\n\";\n\n// Functions\nfunction greet(\$name, \$greeting = \"Hello\") {\n    return \"\$greeting, \$name!\";\n}\n\necho greet(\"Bob\") . \"\\n\";\necho greet(\"Charlie\", \"Good morning\") . \"\\n\";\n\n// Class example\nclass User {\n    public \$name;\n    public \$email;\n    \n    public function __construct(\$name, \$email) {\n        \$this->name = \$name;\n        \$this->email = \$email;\n    }\n    \n    public function getInfo() {\n        return \"\$this->name (\$this->email)\";\n    }\n}\n\n\$user = new User(\"John\", \"john@example.com\");\necho \$user->getInfo();\n?>\n```\n\nWould you like to see more PHP examples?",
                'thinking' => $thinking,
            ]);
        }

        // HTML/CSS requests
        if (preg_match('/html.*code|css.*code|webpage|website.*code/i', $message)) {
            return response()->json([
                'response' => "Here's a simple HTML/CSS example:\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>My Website</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            max-width: 800px;\n            margin: 0 auto;\n            padding: 20px;\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            color: white;\n        }\n        .card {\n            background: white;\n            color: #333;\n            padding: 30px;\n            border-radius: 10px;\n            box-shadow: 0 10px 30px rgba(0,0,0,0.3);\n        }\n        h1 {\n            color: #667eea;\n        }\n        button {\n            background: #667eea;\n            color: white;\n            border: none;\n            padding: 10px 20px;\n            border-radius: 5px;\n            cursor: pointer;\n        }\n        button:hover {\n            background: #764ba2;\n        }\n    </style>\n</head>\n<body>\n    <div class=\"card\">\n        <h1>Welcome!</h1>\n        <p>This is a simple, beautiful webpage.</p>\n        <button onclick=\"alert('Hello!')\">Click Me</button>\n    </div>\n</body>\n</html>\n```\n\nThis creates a modern-looking page with gradients and hover effects!",
                'thinking' => $thinking,
            ]);
        }

        // Library management questions
        if (str_contains($lowerMessage, 'book') || str_contains($lowerMessage, 'library')) {
            return response()->json([
                'response' => "This is a Library Book Borrowing and Inventory Management System built with Laravel and React.\n\nCurrent features:\n• User Management - Create and manage users with different roles\n• QR Scanner - Scan QR codes for quick access\n• Email Reminders - Schedule notifications for book returns\n• Profile Management - Update user profiles and avatars\n\nUpcoming features:\n• Book catalog and inventory\n• Borrowing and return tracking\n• Due date management\n• Reports and analytics\n\nWhat would you like to know more about?",
                'thinking' => $thinking,
            ]);
        }

        // User management
        if (str_contains($lowerMessage, 'user') && !str_contains($lowerMessage, 'code')) {
            return response()->json([
                'response' => "You can manage users through the Users section in the admin menu.\n\nFeatures:\n• Create new users with first name, last name, email\n• Assign roles: Admin or Staff\n• Edit user information\n• Delete user accounts\n• Upload profile pictures\n• Search users by name or email\n\nAdmins have full access, while Staff have limited permissions. Would you like to know more about a specific feature?",
                'thinking' => $thinking,
            ]);
        }

        // QR Scanner
        if (str_contains($lowerMessage, 'qr') || str_contains($lowerMessage, 'scan')) {
            return response()->json([
                'response' => "The QR Scanner feature lets you scan QR codes in two ways:\n\n1. **Webcam Scanning** - Use your device camera to scan in real-time\n2. **Image Upload** - Upload a photo containing a QR code\n\nThis will be integrated with the book borrowing system to quickly check out and return books by scanning their QR codes.\n\nYou can access it from the QR Scanner menu item!",
                'thinking' => $thinking,
            ]);
        }

        // Math questions
        if (preg_match('/what is|calculate|solve/i', $lowerMessage) && preg_match('/\d+/', $lowerMessage)) {
            preg_match_all('/\d+/', $lowerMessage, $matches);
            if (count($matches[0]) >= 2) {
                $num1 = (int)$matches[0][0];
                $num2 = (int)$matches[0][1];
                
                if (str_contains($lowerMessage, 'plus') || str_contains($lowerMessage, '+')) {
                    $result = $num1 + $num2;
                    return response()->json([
                        'response' => "$num1 + $num2 = $result",
                        'thinking' => 'Calculating...',
                    ]);
                }
                if (str_contains($lowerMessage, 'minus') || str_contains($lowerMessage, '-')) {
                    $result = $num1 - $num2;
                    return response()->json([
                        'response' => "$num1 - $num2 = $result",
                        'thinking' => 'Calculating...',
                    ]);
                }
                if (str_contains($lowerMessage, 'times') || str_contains($lowerMessage, '*') || str_contains($lowerMessage, 'multiply')) {
                    $result = $num1 * $num2;
                    return response()->json([
                        'response' => "$num1 × $num2 = $result",
                        'thinking' => 'Calculating...',
                    ]);
                }
            }
        }

        // Help/Features
        if (str_contains($lowerMessage, 'help') || str_contains($lowerMessage, 'what can you do')) {
            return response()->json([
                'response' => "I can help you with:\n\n**Programming:**\n• Python code examples\n• JavaScript/React examples\n• PHP/Laravel code\n• HTML/CSS\n\n**Library System:**\n• User management\n• QR scanner\n• Email reminders\n• System navigation\n\n**General:**\n• Answer questions\n• Solve math problems\n• Provide explanations\n• Give suggestions\n\nJust ask me anything!",
                'thinking' => null,
            ]);
        }

        // Thank you
        if (str_contains($lowerMessage, 'thank') || str_contains($lowerMessage, 'thanks')) {
            return response()->json([
                'response' => "You're very welcome! I'm happy to help. If you have any other questions - whether it's about coding, the system, or anything else - feel free to ask!",
                'thinking' => null,
            ]);
        }

        // Bye
        if (preg_match('/\b(bye|goodbye|see you|exit)\b/i', $lowerMessage)) {
            return response()->json([
                'response' => "Goodbye! It was great chatting with you. Come back anytime you need help!",
                'thinking' => null,
            ]);
        }

        // General question attempt
        if (preg_match('/what is|who is|how to|why|when|where/i', $lowerMessage)) {
            return response()->json([
                'response' => "That's an interesting question! While I can provide basic assistance, for the most comprehensive answers to general knowledge questions, I recommend configuring the OpenAI API key in your .env file.\n\nHowever, I can definitely help you with:\n• Programming and code examples (Python, JavaScript, PHP, HTML/CSS)\n• Library management system questions\n• Math calculations\n• Technical explanations\n\nCould you rephrase your question to be more specific about what you'd like to know?",
                'thinking' => $thinking,
            ]);
        }

        // Default response
        return response()->json([
            'response' => "I'm your AI assistant! I can help you with:\n\n• **Code examples** - Just ask for Python, JavaScript, PHP, or HTML code\n• **Library system** - User management, QR scanner, features\n• **Math** - Simple calculations\n• **Questions** - Ask me anything!\n\nWhat would you like to know?",
            'thinking' => null,
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
