<?php

namespace App\Http\Controllers\Shared\Tools;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class QrScannerController extends Controller
{
    /**
     * Display the QR Scanner page
     */
    public function index(): Response
    {
        return Inertia::render('admin/QRScanner');
    }
}
