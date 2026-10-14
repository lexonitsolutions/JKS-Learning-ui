"use client";

import { addStudentsToAssessment, fetchEligibleStudents, type IndividualTask } from "@/lib/data/tasks-api";
import { StudentPickerModal } from "./student-picker-modal";

interface Props {
  /** Any existing assignment of the assessment being extended. */
  task: IndividualTask | null;
  onClose: () => void;
  onAdded: (result: { added: number; skipped: number; tasks: IndividualTask[] }) => void;
}

/** "+ Add students": appends to an existing assessment, never replaces assignments. */
export function AddStudentsModal({ task, onClose, onAdded }: Props) {
  return (
    <StudentPickerModal
      open={!!task}
      resetKey={task?.id ?? ""}
      title="Add students"
      subtitle={task ? `${task.title}${task.courseTitle ? ` · ${task.courseTitle}` : ""}` : undefined}
      note="Adds to the current assignments. Existing students and their work are not changed."
      confirmVerb="Add"
      load={(search) => (task ? fetchEligibleStudents(task.id, search) : Promise.resolve([]))}
      onConfirm={async (ids) => {
        if (!task) return;
        const res = await addStudentsToAssessment(task.id, ids);
        onAdded({ added: res.added, skipped: res.skipped.length, tasks: res.tasks });
      }}
      onClose={onClose}
    />
  );
}
