'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { updateProject } from '@/services/project.service';
import { ProjectCategory, type JProject } from '@/interfaces';
import { useProjectQuery } from '@/hooks/use-project-query';

const categories = [ProjectCategory.BUSINESS, ProjectCategory.MARKETING, ProjectCategory.SOFTWARE];

const settingsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  url: z.string(),
  category: z.nativeEnum(ProjectCategory),
  description: z.string(),
});

type SettingsFormValue = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: project } = useProjectQuery();

  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset, watch, formState } = useForm<SettingsFormValue>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      url: '',
      category: ProjectCategory.SOFTWARE,
      description: '',
    },
  });

  useEffect(() => {
    if (!project) {
      return;
    }

    reset({
      name: project.name,
      url: project.url,
      category: project.category,
      description: project.description,
    });
  }, [project, reset]);

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<JProject>) => updateProject(payload),
    onSuccess: async (updatedProject) => {
      await queryClient.setQueryData(['project'], updatedProject);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    },
  });

  function submitForm(values: SettingsFormValue) {
    saveMutation.mutate(values);
  }

  if (!project) {
    return <div className="p-8 text-[#5e6c84]">Loading...</div>;
  }

  const watchedName = watch('name');

  return (
    <div className="pr-6 py-8 pl-8 h-full w-full flex flex-col">
      <Breadcrumbs items={['Projects', project.name, 'Settings']} />
      <div className="mt-3 mb-6 text-2xl font-medium text-[#172b4d]">Project Settings</div>

      <form className="max-w-[640px]" onSubmit={handleSubmit(submitForm)}>
        <div className="form-group">
          <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Name</label>
          <input
            className="w-full rounded-[3px] border border-[#DFE1E6] px-3 py-[7px] text-[15px] text-[#172b4d] outline-none focus:border-[#4c9aff]"
            placeholder="Project Name"
            {...register('name')}
            autoFocus
          />
        </div>

        <div className="form-group mt-3">
          <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">URL</label>
          <input
            className="w-full rounded-[3px] border border-[#DFE1E6] px-3 py-[7px] text-[15px] text-[#172b4d] outline-none focus:border-[#4c9aff]"
            placeholder="Project URL"
            {...register('url')}
          />
        </div>

        <div className="form-group mt-3">
          <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Category</label>
          <select
            className="w-full rounded-[3px] border border-[#DFE1E6] px-3 py-[7px] text-[15px] text-[#172b4d] outline-none focus:border-[#4c9aff]"
            {...register('category')}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mt-3">
          <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Description</label>
          <textarea
            className="w-full min-h-[120px] rounded-[3px] border border-[#DFE1E6] px-3 py-[7px] text-[15px] text-[#172b4d] outline-none focus:border-[#4c9aff]"
            placeholder="Project Description"
            {...register('description')}
          />
        </div>

        <div className="form-group mt-3 flex items-center">
          <button
            type="submit"
            disabled={!watchedName?.trim() || !formState.isValid || saveMutation.isPending}
            className="mr-2 rounded-[3px] bg-[#0052cc] px-3 py-[6px] text-white text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0747a6]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/project/board')}
            className="rounded-[3px] border border-transparent px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#ebecf0]"
          >
            Cancel
          </button>

          {saved && (
            <span className="ml-3 text-[13px] text-[#006644]">Changes have been saved successfully.</span>
          )}
        </div>
      </form>
    </div>
  );
}
