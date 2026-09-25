"use client";

import type { AdminRole } from "@prisma/client";
import { KeyRound, Trash2, UserPlus, Users } from "lucide-react";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { PasswordInput } from "@/components/admin/PasswordInput";
import { useToast } from "@/components/admin/Toast";
import {
  cardPadded,
  fieldHint,
  fieldInput,
  fieldLabel,
  primaryButton,
  secondaryButton,
  sectionTitle,
  table,
  tableBody,
  tableCell,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableWrap,
} from "@/components/admin/ui";
import {
  changeAdminUserRoleAction,
  createAdminUserAction,
  deleteAdminUserAction,
  resetAdminUserPasswordAction,
  type UserActionState,
} from "./actions";

export type AdminUserRow = Readonly<{
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
}>;

const INITIAL_STATE: UserActionState = {};
const ROLES: readonly AdminRole[] = ["SUPER_ADMIN", "ADMIN", "AUTHOR"];

function CreateUserForm() {
  const [state, action, pending] = useActionState(createAdminUserAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) toast(state.error, "error");
    if (state.success) {
      toast(state.success);
      formRef.current?.reset();
    }
  }, [state.error, state.success, toast]);

  return (
    <form ref={formRef} action={action} className={`${cardPadded} space-y-4`}>
      <div>
        <div className="flex items-center gap-2">
          <UserPlus className="size-4 text-brand-primary" aria-hidden="true" />
          <h2 className={sectionTitle}>New user</h2>
        </div>
        <p className={fieldHint}>Set a temporary password of at least 12 characters for the new admin.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className={fieldLabel}>
          Full name
          <input name="name" required autoComplete="off" className={fieldInput} />
        </label>
        <label className={fieldLabel}>
          Email
          <input name="email" type="email" required autoComplete="off" className={fieldInput} />
        </label>
        <label className={fieldLabel}>
          Role
          <select name="role" defaultValue="ADMIN" className={fieldInput}>
            {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </label>
        <label className={fieldLabel}>
          Temporary password
          <PasswordInput name="password" autoComplete="new-password" required minLength={12} />
        </label>
      </div>

      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}

function PasswordResetForm({ user }: { user: AdminUserRow }) {
  const [state, action, pending] = useActionState(resetAdminUserPasswordAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) toast(state.error, "error");
    if (state.success) {
      toast(state.success);
      formRef.current?.reset();
    }
  }, [state.error, state.success, toast]);

  return (
    <form ref={formRef} action={action} className="mt-3 flex min-w-64 flex-wrap items-end gap-2">
      <input type="hidden" name="targetId" value={user.id} />
      <label className={`${fieldLabel} min-w-48 flex-1`}>
        New password
        <PasswordInput name="newPassword" autoComplete="new-password" required minLength={12} />
      </label>
      <button type="submit" disabled={pending} className={secondaryButton}>
        <KeyRound className="size-3.5" aria-hidden="true" />
        {pending ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}

function UserRow({ user, currentUserId }: { user: AdminUserRow; currentUserId: string }) {
  const [rolePending, startRoleTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const { toast } = useToast();
  const isCurrentUser = user.id === currentUserId;

  function changeRole(nextRole: string) {
    startRoleTransition(async () => {
      const result = await changeAdminUserRoleAction(user.id, nextRole);
      if (result.error) toast(result.error, "error");
      if (result.success) toast(result.success);
    });
  }

  function deleteUser() {
    startDeleteTransition(async () => {
      const result = await deleteAdminUserAction(user.id);
      if (result.error) toast(result.error, "error");
      if (result.success) toast(result.success);
    });
  }

  return (
    <tr className={tableRow}>
      <td className={tableCell}>
        <p className="font-semibold">{user.name}</p>
        {isCurrentUser ? <p className="mt-0.5 text-xs text-brand-muted">This is your account</p> : null}
      </td>
      <td className={tableCell}>{user.email}</td>
      <td className={tableCell}>
        <select
          value={user.role}
          onChange={(event) => changeRole(event.target.value)}
          disabled={isCurrentUser || rolePending}
          aria-label={`${user.name} role`}
          className={`${fieldInput} mt-0 min-w-40 py-1.5`}
        >
          {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      </td>
      <td className={`${tableCell} whitespace-nowrap`}>
        {new Date(user.createdAt).toLocaleDateString("en-US")}
      </td>
      <td className={`${tableCell} min-w-80`}>
        <ConfirmButton onConfirm={deleteUser} disabled={isCurrentUser || deletePending} confirmLabel="Delete">
          <Trash2 className="size-3.5" aria-hidden="true" />
          Delete
        </ConfirmButton>
        <PasswordResetForm user={user} />
      </td>
    </tr>
  );
}

export function UsersManager({ users, currentUserId }: { users: readonly AdminUserRow[]; currentUserId: string }) {
  return (
    <div className="space-y-6">
      <CreateUserForm />

      {users.length === 0 ? (
        <EmptyState icon={Users} title="No admin users yet" />
      ) : (
        <div className={tableWrap}>
          <table className={table}>
            <thead>
              <tr className={tableHeadRow}>
                <th className={tableHeadCell}>User</th>
                <th className={tableHeadCell}>Email</th>
                <th className={tableHeadCell}>Role</th>
                <th className={tableHeadCell}>Created</th>
                <th className={tableHeadCell}>Actions</th>
              </tr>
            </thead>
            <tbody className={tableBody}>
              {users.map((user) => <UserRow key={user.id} user={user} currentUserId={currentUserId} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
