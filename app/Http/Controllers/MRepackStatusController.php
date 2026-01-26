<?php

namespace App\Http\Controllers;

use App\Models\MRepackStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MRepackStatusController extends Controller
{
    public function index()
    {
        $query = MRepackStatus::query();
        if ($search = request()->query('search')) {
            $query->where('repack_name', 'like', "%{$search}%");
        }

        $repackStatuses = $query->paginate(10)->withQueryString();

        return Inertia::render('MRepackStatus/Index', [
            'repack_statuses' => $repackStatuses,
            'filters' => request()->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'repack_code' => ['required', 'string', 'max:2', 'unique:m_repack_status,repack_code'],
            'repack_name' => ['required', 'string', 'max:10'],
        ]);
        $validated['created_by'] = auth()->id();

        MRepackStatus::create($validated);

        toast_success('Status Repack berhasil ditambahkan.');

        return redirect()->route('repack-status.index');
    }

    public function update(Request $request, MRepackStatus $repack_status)
    {
        $validated = $request->validate([
            'repack_code' => ['required', 'string', 'max:2', 'unique:m_repack_status,repack_code,'.$repack_status->id],
            'repack_name' => ['required', 'string', 'max:10'],
        ]);

        $repack_status->update($validated);

        toast_success('Status Repack berhasil diperbarui.');

        return redirect()->route('repack-status.index');
    }

    public function destroy(MRepackStatus $repack_status)
    {
        $repack_status->update(['deleted_by' => auth()->id()]);
        $repack_status->delete();

        toast_warning('Status Repack berhasil dihapus.');

        return redirect()->route('repack-status.index');
    }
}
