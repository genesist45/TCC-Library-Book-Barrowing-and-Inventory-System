<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Services\Reports\CatalogReportService;
use App\Services\Reports\CirculationReportService;
use App\Services\Reports\OverdueReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller for Report pages
 * Keeps methods thin - delegates to Services for business logic
 */
class ReportsController extends Controller
{
    public function __construct(
        private CatalogReportService $catalogReportService,
        private CirculationReportService $circulationReportService,
        private OverdueReportService $overdueReportService
    ) {}

    /**
     * Display the Catalog Reports page.
     * Shows inventory summary statistics and charts.
     */
    public function catalog(Request $request): Response
    {
        $data = $this->catalogReportService->generateReportData(
            $request->input('date_from'),
            $request->input('date_to')
        );

        return Inertia::render('features/Reports/Pages/CatalogReports', $data);
    }

    /**
     * Display the Circulation Reports page.
     * Shows borrowing transaction statistics and lending activity.
     */
    public function circulation(Request $request): Response
    {
        $data = $this->circulationReportService->generateReportData(
            $request->input('date_from'),
            $request->input('date_to')
        );

        return Inertia::render('features/Reports/Pages/CirculationReports', $data);
    }

    /**
     * Display the Overdue Reports page.
     * Shows late return statistics and overdue management.
     */
    public function overdue(Request $request): Response
    {
        $data = $this->overdueReportService->generateReportData(
            $request->input('date_from'),
            $request->input('date_to')
        );

        return Inertia::render('features/Reports/Pages/OverdueReports', $data);
    }
}
