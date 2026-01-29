<?php

namespace App\Service;

use App\DTOs\RecipeCreateDTO;
use App\Repository\RecipeRepository;
use Exception;

class RecipeService
{
    public function __construct(
        protected RecipeRepository $repository
    ) {}

    public function create(RecipeCreateDTO $dto)
    {
        return $this->repository->create($dto);
    }

    public function getSummary()
    {
        return $this->repository->getSummary();
    }

    public function getDetail(int $id)
    {
        return $this->repository->findById($id);
    }
}
