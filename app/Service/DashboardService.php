<?php

namespace App\Service;

use App\Repository\DashboardRepository;

class DashboardService
{
    public function __construct(
        protected DashboardRepository $repository
    ) {}

    public function summary(): array
    {
        return [
            'total_barang' => $this->repository->totalBarang(),
            'total_stok' => $this->repository->totalStok(),
            'total_repack' => $this->repository->totalRepack(),
        ];
    }
}
