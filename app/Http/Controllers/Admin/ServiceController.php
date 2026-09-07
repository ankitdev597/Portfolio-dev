<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\ServiceData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Models\Service;
use App\Services\ServiceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Small, bounded list (like batch 1's taxonomies) - modal-based CRUD, one
 * ordered collection, no pagination.
 */
class ServiceController extends Controller
{
    public function __construct(private readonly ServiceService $services) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Service::class);

        return Inertia::render('Admin/Services/Index', [
            'services' => Service::query()
                ->orderBy('display_order')
                ->orderBy('title')
                ->get(),
        ]);
    }

    public function store(ServiceRequest $request): RedirectResponse
    {
        $this->services->create(
            ServiceData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Service created.');
    }

    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $this->services->update(
            $service,
            ServiceData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Service updated.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $this->authorize('delete', $service);

        $this->services->delete($service, request()->user());

        return back()->with('success', 'Service deleted.');
    }
}
