<?php

namespace App\Http\Controllers;

use App\Exports\MRepackStatusTemplateExport;
use App\Imports\MRepackStatusImport;
use App\Models\MRepackStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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

    public function downloadTemplate()
    {
        return Excel::download(new MRepackStatusTemplateExport(), 'template_import_status_repack.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        try {
            $import = new MRepackStatusImport(auth()->id());
            Excel::import($import, $request->file('file'));

            $successCount = $import->getSuccessCount();
            $errors = $import->getErrors();

            if ($successCount > 0 && count($errors) > 0) {
                toast_success("{$successCount} status repack berhasil diimport.");
            } elseif (count($errors) > 0) {
                toast_error('Import gagal. ' . implode(' | ', array_slice($errors, 0, 5)));
            } else {
                toast_success("{$successCount} status repack berhasil diimport.");
            }

            return redirect()->route('repack-status.index');
        } catch (\Exception $e) {
            Log::error('Import repack status failed: ' . $e->getMessage());
            toast_error('Import gagal: ' . $e->getMessage());

            return back();
        }
    }
}
