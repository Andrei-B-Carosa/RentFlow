<?php

namespace App\Helpers;

class DTServerSide {

    protected $request;
    protected $data;
    protected $searchableColumns;
    protected $sortableColumns;
    protected $appendArray;

    public function __construct($request, $data, $searchableColumns = [], $sortableColumns = [], $appendArray=[]) {
        $this->request = $request;
        $this->data = $data;
        $this->searchableColumns = $searchableColumns;
        $this->sortableColumns = $sortableColumns;
        $this->appendArray = $appendArray;
    }

    public function renderTable()
    {
        $validated = validator($this->request->all(), [
            'search' => ['nullable', 'string'],
            'sortColumn' => array_filter([
                'nullable',
                !empty($this->sortableColumns)
                    ? 'in:' . implode(',', array_keys($this->sortableColumns))
                    : null,
            ]),
            'sortDirection' => ['nullable', 'in:asc,desc'],
            'pageSize' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ])->validate();

        $search = $validated['search'] ?? null;
        // $sortColumn = $validated['sortColumn'] ?? 'row_number';
        $sortColumn = $validated['sortColumn'] ?? null;
        $sortDirection = $validated['sortDirection'] ?? 'asc';
        $pageSize = $validated['pageSize'] ?? 10;
        $page = $validated['page'] ?? 1;

        $query = $this->data->clone();

        if ($search && !empty($this->searchableColumns)) {
            $query->where(function ($q) use ($search) {
                foreach ($this->searchableColumns as $column) {
                    $this->applySearch($q, $column, $search);
                }
            });
        }

        if ($sortColumn && isset($this->sortableColumns[$sortColumn])) {
            $query->orderBy($this->sortableColumns[$sortColumn], $sortDirection);
        }

        $result = $query->paginate($pageSize, ['*'], 'page', $page);

        $appendArray = $this->appendArray;

        $collection = $result->getCollection();

        $collection->transform(function ($item, $index) use ($page, $pageSize) {
            $item->row_number = ($page - 1) * $pageSize + $index + 1;
            return $item;
        });

        if (!empty($appendArray)) {
            $collection->each(function ($item) use($appendArray){
                foreach ($appendArray as $relation => $nestedRelations) {
                    $relationInstance = $item->$relation;
                    if (!$relationInstance) continue;

                    if ($relationInstance instanceof \Illuminate\Database\Eloquent\Model) {
                        foreach ($nestedRelations as $nestedRelation => $attributes) {
                            $relationInstance->$nestedRelation?->append($attributes);
                        }
                    }

                    if ($relationInstance instanceof \Illuminate\Database\Eloquent\Collection) {
                        $relationInstance->each(function ($related) use ($nestedRelations) {
                            foreach ($nestedRelations as $nestedRelation => $attributes) {
                                $related->$nestedRelation?->append($attributes);
                            }
                        });
                    }
                }
            });
        }

        return response()->json([
            'success' => true,
            'data' => $collection,
            'pagination' => [
                'total' => $result->total(),
                'per_page' => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
                'from' => $result->firstItem(),
                'to' => $result->lastItem(),
            ],
        ]);
    }

    private function applySearch($query, $column, $search)
    {
        if (str_contains($column, '.')) {
            [$relation, $relatedColumn] = explode('.', $column, 2);
            $query->orWhereHas($relation, function ($q) use ($relatedColumn, $search) {
                $q->where($relatedColumn, 'LIKE', "%$search%");
            });
        } else {
            $query->orWhere($column, 'LIKE', "%$search%");
        }
    }
}
