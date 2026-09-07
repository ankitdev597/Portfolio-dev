<?php

namespace App\Http\Controllers\Admin;

use App\DTOs\SkillData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillRequest;
use App\Models\Skill;
use App\Services\SkillService;
use Illuminate\Http\RedirectResponse;

/**
 * No index() here on purpose - skills are always viewed nested under their
 * category on Admin/SkillCategories/Index.tsx (see SkillCategoryController).
 * This controller only handles the write actions for that page's forms.
 */
class SkillController extends Controller
{
    public function __construct(private readonly SkillService $skills) {}

    public function store(SkillRequest $request): RedirectResponse
    {
        $this->skills->create(
            SkillData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Skill created.');
    }

    public function update(SkillRequest $request, Skill $skill): RedirectResponse
    {
        $this->skills->update(
            $skill,
            SkillData::fromValidated($request->validated()),
            $request->user(),
        );

        return back()->with('success', 'Skill updated.');
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $this->authorize('delete', $skill);

        $this->skills->delete($skill, request()->user());

        return back()->with('success', 'Skill deleted.');
    }
}
