# 📋 Laravel + InertiaJS Backend Coding Rules

> Quick reference guide for AI coders to maintain clean, consistent Laravel + InertiaJS backend code.
> **Focus: Backend only (app/, database/, routes/)**

---

## 📁 Backend Folder Structure

```
project/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # Handle requests, return Inertia responses
│   │   ├── Middleware/         # Request filters (auth, HandleInertiaRequests)
│   │   └── Requests/           # Form validation classes
│   ├── Models/                 # Database models & relationships
│   ├── Services/               # 💡 Business logic lives here
│   ├── Providers/              # Service providers
│   │
│   │   # 📧 OPTIONAL FOLDERS (create when needed):
│   ├── Jobs/                   # ⏳ Background tasks
│   ├── Mail/                   # ✉️ Email templates
│   ├── Notifications/          # 🔔 Multi-channel alerts
│   ├── Events/                 # 📡 Event classes
│   ├── Listeners/              # 👂 Event handlers
│   ├── Policies/               # 🔐 Authorization rules
│   └── Rules/                  # ✅ Custom validation
│
├── database/
│   ├── migrations/             # Table structure definitions
│   ├── seeders/                # Sample/default data
│   └── factories/              # Fake data for testing
│
├── routes/
│   ├── web.php                 # ⭐ Main routes (Inertia uses this)
│   └── auth.php                # Authentication routes
```

---

## 🎯 Core Principle

**"Everything has its place."** — Each folder has ONE responsibility.

---

## 📍 Where Code Belongs

| Code Type | Put In | NOT In |
|-----------|--------|--------|
| Validation | `Http/Requests/` | Controllers |
| Business logic | `Services/` | Controllers, Models |
| Database queries | `Services/` or `Models/` | Controllers |
| Authorization | `Policies/` or `Middleware/` | Controllers |
| Background tasks | `Jobs/` | Controllers, Services |
| Email templates | `Mail/` | Controllers |

---

## ✅ Controller Rules (InertiaJS)

### DO — Return Inertia Responses:
```php
// GET request - return Inertia page
public function index()
{
    $records = Model::with('relation')->paginate(10);
    
    return Inertia::render('{Model}/Index', [
        'records' => $records,
        'filters' => request()->only(['search', 'status']),
    ]);
}

// POST/PUT/DELETE - redirect with flash message
public function store(StoreModelRequest $request)
{
    $this->modelService->store($request->validated());
    
    return redirect()
        ->route('{models}.index')
        ->with('success', 'Record created successfully!');
}
```

### DON'T:
```php
// ❌ Never return JSON in Inertia controllers
return response()->json(['data' => $data]);

// ❌ Never put business logic in controllers
public function store(Request $request)
{
    $request->validate([...]); // ❌ Use Form Request
    // ❌ 50+ lines of business logic...
}
```

### Controller Checklist:
- [ ] Uses Form Request for validation
- [ ] Calls Service for business logic
- [ ] Returns `Inertia::render()` for GET requests
- [ ] Returns `redirect()->with()` for POST/PUT/DELETE
- [ ] Under 20 lines per method

---

## ✅ Service Rules

### DO:
```php
class ModelService
{
    public function store(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            $record = Model::create($data);
            $this->handleRelations($data);
            $this->performAdditionalLogic($record);
            return $record;
        });
    }
}
```

### Service Checklist:
- [ ] One service per model (start simple)
- [ ] Contains complex business logic
- [ ] Uses database transactions when needed
- [ ] Can be reused by controllers, jobs, commands
- [ ] Throws exceptions for errors

---

## ✅ Form Request Rules

### DO:
```php
class StoreModelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'unique:models,email'],
            'status'      => ['required', 'in:active,inactive'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'Name is required.',
            'email.unique'   => 'This email already exists.',
        ];
    }
}
```

### Request Checklist:
- [ ] One request per action (Store, Update)
- [ ] All validation rules defined
- [ ] Custom error messages for UX
- [ ] Authorization check if needed

---

## ✅ Middleware Rules (HandleInertiaRequests)

### Share Global Data:
```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
        ],
    ]);
}
```

---

## 📦 Model Rules

### DO:
```php
class Model extends Model
{
    use SoftDeletes; // If needed
    
    protected $fillable = [
        'name',
        'email',
        'status',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
    ];
    
    // ✅ Relationships
    public function relation(): BelongsTo
    {
        return $this->belongsTo(OtherModel::class);
    }
    
    // ✅ Simple scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
```

### DON'T Put in Models:
```php
// ❌ Complex business logic
public function processPayment() { /* 50 lines */ }

// ❌ External API calls
public function sendToExternalService() { /* API call */ }

// ❌ Email sending
public function notifyUser() { /* Mail::send() */ }
```

### Model Checklist:
- [ ] Define `$fillable` for mass assignment
- [ ] Define `$hidden` for sensitive fields
- [ ] Define `$casts` for type casting
- [ ] Keep relationships simple and clear
- [ ] Use scopes for reusable query logic
- [ ] NO business logic in models

---

## 🚨 Error Handling Rules

### In Services - Throw Exceptions:
```php
public function store(array $data): Model
{
    if ($this->isDuplicate($data)) {
        throw new \Exception('Record already exists.');
    }
    
    return Model::create($data);
}
```

### In Controllers - Catch and Redirect:
```php
public function store(StoreModelRequest $request)
{
    try {
        $this->modelService->store($request->validated());
        
        return redirect()
            ->route('{models}.index')
            ->with('success', 'Record created successfully!');
    } catch (\Exception $e) {
        return redirect()
            ->back()
            ->with('error', $e->getMessage());
    }
}
```

### Error Handling Checklist:
- [ ] Services throw exceptions for business rule violations
- [ ] Controllers catch exceptions and redirect with flash messages
- [ ] Never expose sensitive error details
- [ ] Log errors for debugging

---

## 💬 Flash Messages Rules

### Setting Flash Messages:
```php
// Success
return redirect()->route('...')->with('success', 'Operation completed!');

// Error
return redirect()->back()->with('error', 'Something went wrong.');

// Warning
return redirect()->back()->with('warning', 'Please review your input.');
```

### Sharing via Middleware (Required):
```php
// app/Http/Middleware/HandleInertiaRequests.php
'flash' => [
    'success' => $request->session()->get('success'),
    'error' => $request->session()->get('error'),
    'warning' => $request->session()->get('warning'),
],
```

### Flash Message Checklist:
- [ ] Always share flash in HandleInertiaRequests middleware
- [ ] Use consistent keys: `success`, `error`, `warning`
- [ ] POST/PUT/DELETE always redirect with flash message
- [ ] Never forget to handle flash in middleware

---

## 🛤️ Routes Rules (web.php)

### Structure Template:
```php
<?php

use Illuminate\Support\Facades\Route;

// ══════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════

Route::get('/', fn() => Inertia::render('Welcome'));

// ══════════════════════════════════════════════════════════════
// AUTHENTICATED ROUTES
// ══════════════════════════════════════════════════════════════

Route::middleware(['auth', 'verified'])->group(function () {

    // ─────────────────────────────────────────────────────────
    // DASHBOARD
    // ─────────────────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ─────────────────────────────────────────────────────────
    // FEATURE A
    // ─────────────────────────────────────────────────────────
    Route::resource('feature-a', FeatureAController::class);

    // ─────────────────────────────────────────────────────────
    // FEATURE B
    // ─────────────────────────────────────────────────────────
    Route::resource('feature-b', FeatureBController::class);

    // ─────────────────────────────────────────────────────────
    // ADMIN ONLY
    // ─────────────────────────────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::resource('users', UserController::class);
        Route::get('/settings', [SettingsController::class, 'index']);
    });
});

require __DIR__.'/auth.php';
```

### Rules:
| ✅ DO | ❌ DON'T |
|-------|----------|
| Use `web.php` for Inertia routes | Use `api.php` for Inertia |
| Use `Route::resource()` for CRUD | Define each route manually |
| Group by feature with comments | Mix unrelated routes |
| Apply middleware at group level | Repeat middleware on each route |
| Always use `->name()` for routes | Leave routes unnamed |

---

## 📝 Naming Conventions

### Backend Files
| Type | Pattern | Example |
|------|---------|---------|
| Controller | `{Model}Controller` | `CustomerController.php` |
| Service | `{Model}Service` | `CustomerService.php` |
| Request (Store) | `Store{Model}Request` | `StoreCustomerRequest.php` |
| Request (Update) | `Update{Model}Request` | `UpdateCustomerRequest.php` |
| Model | `{Singular}` | `Customer.php` |
| Migration | `create_{plural}_table` | `create_customers_table.php` |
| Seeder | `{Model}Seeder` | `CustomerSeeder.php` |
| Policy | `{Model}Policy` | `CustomerPolicy.php` |
| Job | `{Action}{Model}` | `ProcessCustomerData.php` |
| Mail | `{Model}{Action}Mail` | `CustomerWelcomeMail.php` |

### Controller Methods
| Action | Method | Returns |
|--------|--------|---------|
| List | `index()` | `Inertia::render()` |
| Create Form | `create()` | `Inertia::render()` |
| Store | `store()` | `redirect()->with()` |
| Show | `show()` | `Inertia::render()` |
| Edit Form | `edit()` | `Inertia::render()` |
| Update | `update()` | `redirect()->with()` |
| Delete | `destroy()` | `redirect()->with()` |

---

## 🗄️ Database Migration Rules (Development)

### Always Use:
```bash
php artisan migrate:fresh --seed
```

### Rules:
| ✅ DO | ❌ DON'T |
|-------|----------|
| Modify existing migration files | Create `add_column_to_table.php` |
| Run `migrate:fresh --seed` | Create `update_table_name.php` |
| Keep one migration per table | Accumulate multiple migrations |

> ⚠️ **Development Only!** In production, use proper migrations.

---

## 🚫 Anti-Patterns (Never Do These)

```php
// ❌ Return JSON in Inertia controller
return response()->json(['data' => $data]);

// ❌ Validation in controller
$request->validate(['name' => 'required']);

// ❌ Business logic in controller
public function store(Request $request) {
    // 100 lines of logic...
}

// ❌ Forget to share flash messages in middleware
// Users won't see success/error messages!

// ❌ Use api.php for Inertia routes
// Inertia uses sessions, not tokens!
```

---

## ✅ Best Practices

### 1. Use Route Model Binding
```php
public function show(Model $model)  // ✅ Auto-finds or 404
```

### 2. Preserve Query String in Pagination
```php
$records->withQueryString();  // ✅ Keeps filters on page change
```

### 3. Eager Load Relationships
```php
$records = Model::with('relation', 'anotherRelation')->paginate(10);
```

### 4. Always Use findOrFail()
```php
$record = Model::findOrFail($id);  // Throws 404 if not found
```

### 5. Use Transactions for Multiple Operations
```php
DB::transaction(function () {
    // Multiple database operations
});
```

---

## ⚡ Quick Artisan Commands

```bash
# Create model with migration, factory, seeder, controller
php artisan make:model {Model} -mfsc

# Create Form Request
php artisan make:request Store{Model}Request

# Create Service (manual - no artisan command)
# Create: app/Services/{Model}Service.php

# Create Policy
php artisan make:policy {Model}Policy --model={Model}

# Create Job
php artisan make:job {Action}{Model}

# Create Mail
php artisan make:mail {Model}{Action}Mail

# Fresh database
php artisan migrate:fresh --seed
```

---

## 📊 Backend Data Flow

```
Request → Middleware → FormRequest → Controller → Service → Model
                                         ↓
                            Inertia::render('Page', $data)
```

---

## 📝 Summary

| Rule | Description |
|------|-------------|
| **Thin Controllers** | Max 20 lines per method |
| **Fat Services** | All business logic here |
| **Form Requests** | All validation here |
| **Inertia::render()** | For GET requests |
| **redirect()->with()** | For POST/PUT/DELETE |
| **web.php** | All Inertia routes here |
| **HandleInertiaRequests** | Share auth & flash data |

---

## 🆚 Key Differences from REST API

| Aspect | REST API | InertiaJS |
|--------|----------|-----------|
| Routes file | `api.php` | `web.php` |
| GET Response | `response()->json()` | `Inertia::render()` |
| POST Response | Return JSON | `redirect()->with()` |
| Auth | Token (Sanctum) | Session (cookies) |
| Resources folder | Always use | Usually not needed |

---

## 🔒 Security Rules

### Must Follow:
- [ ] Never trust user input — always validate via Form Requests
- [ ] Use `$fillable` in models (never `$guarded = []`)
- [ ] Hide sensitive fields in models (`$hidden`)
- [ ] Use session-based auth (not tokens for Inertia)
- [ ] Apply middleware for route protection
- [ ] Use Policies for authorization logic
- [ ] Validate file uploads (type, size)

### Environment Variables:
```php
// ✅ Good - use env() or config()
$apiKey = config('services.external.api_key');

// ❌ Bad - hardcoded secrets
$apiKey = 'sk_live_abc123...';
```

---

## 📊 Quick Decision Tree

```
Where does this code go?

Is it validation?
  └─ YES → Http/Requests/

Is it checking who can do what?
  └─ YES → Policies/ or Middleware/

Is it business logic?
  └─ YES → Services/

Is it a background task?
  └─ YES → Jobs/

Is it sending an email?
  └─ YES → Mail/

Is it a multi-channel notification?
  └─ YES → Notifications/

Is it handling HTTP request/response?
  └─ YES → Controllers/
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- [ ] All routes are protected with appropriate middleware
- [ ] Validation exists for all user inputs (Form Requests)
- [ ] Sensitive data is hidden in models (`$hidden`)
- [ ] Flash messages are shared in HandleInertiaRequests
- [ ] Error messages don't expose system details
- [ ] Database migrations are finalized
- [ ] Seeders create necessary default data
- [ ] All services use transactions where needed
- [ ] File uploads are validated and stored securely

---

> 💡 **Remember:** Keep controllers thin, use Services for logic, and always share flash messages via HandleInertiaRequests middleware!