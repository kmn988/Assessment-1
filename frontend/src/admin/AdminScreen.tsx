import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminScreen.css";
import TableBase from "../common/TableBase";
import {
  create_user,
  delete_user,
  get_users,
  update_user,
} from "../config/api";
import {
  PAGE_SIZE,
  USER_COLS,
  type SortDir,
  type UserSortKey,
} from "../config/value";

import DeleteAction from "../common/DeleteAction";
import CreateUserAction from "./CreateUserAction";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

type ModalMode = "create" | "edit" | null;

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
};

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  password: "",
  role: "USER",
};

export default function AdminScreen() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [sort, setSort] = useState<{ key: UserSortKey; dir: SortDir } | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  const navigate = useNavigate();
  const adminRaw = localStorage.getItem("user");

  const toggleSort = (key: UserSortKey) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const fetchUsers = async () => {
    const response = await get_users({
      page,
      size: PAGE_SIZE,
      ...(search && { search }),
      ...(sort && { sort_key: sort.key, sort_dir: sort.dir }),
    });
    setUsers(response.items);
    setTotalPages(response.pages);
    setTotal(response.total);
  };

  const handleSubmit = async () => {
    setFormError("");
    setFormLoading(true);
    try {
      if (modalMode === "create") {
        await create_user(formData);
      } else {
        await update_user(editUserId!, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
      }
      await fetchUsers();
    } catch (err) {
      if (err instanceof AxiosError) {
        setFormError(err.response?.data?.detail ?? "Operation failed.");
      } else {
        setFormError("Operation failed.");
      }
    } finally {
      setFormLoading(false);
    }
  };
  const actionButtons = [
    {
      title: "Delete",
      action: (item: ApiUser) => {
        setShowDeleteModal(true);
        setSelectedUser(item);
      },
    },
  ];

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await delete_user(deleteTargetId);
      if (selectedUserId === deleteTargetId) setSelectedUserId(null);
      setDeleteTargetId(null);
      await fetchUsers();
    } catch {
      setDeleteError("Failed to delete user. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sort, page, search]);

  return (
    <div className="m-3 md:m-7 flex flex-col gap-4 w-full">
      <div className="flex justify-end ">
        <button
          className="border-solid border-2 p-2 px-6 rounded-2xl hover:cursor-pointer bg-main hover:bg-hover text-black"
          type="button"
          onClick={() => setShowCreateModal(true)}
        >
          + Add User
        </button>
      </div>

      <div className=" gap-4 md:gap-7">
        <TableBase
          className="bg-gray-800 flex flex-col rounded-xl border-2 border-solid"
          filterComponent={
            <div className="flex flex-col sm:flex-row flex-wrap p-4 h-auto gap-3 justify-between items-start sm:items-center">
              <input
                type="text"
                placeholder="Search user"
                className="px-2 border-solid border-2 rounded-lg h-fit"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          }
          headerComponent={USER_COLS.map((col) => (
            <th
              key={col.key}
              className="p-3 hover:cursor-pointer select-none hover:text-main transition-colors"
              onClick={() => toggleSort(col.key)}
            >
              <div className="flex items-center gap-1">
                {col.label}
                <span className="text-xs text-gray-500">
                  {sort?.key === col.key
                    ? sort.dir === "asc"
                      ? "▲"
                      : "▼"
                    : "⇅"}
                </span>
              </div>
            </th>
          ))}
          bodyComponent={
            <>
              {users.map((item) => (
                <tr className=" border-t-2 h-20 border-solid" key={item.id}>
                  <td className="p-3">
                    <div className=" flex flex-col justify-center gap-1">
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="rounded-2xl border-2 border-solid w-fit px-2">
                      {item.email}
                    </div>
                  </td>
                  <td className="p-3">{item.role}</td>
                  <td className="p-3 ">
                    <div className=" flex justify-between items-center">
                      <div className="flex gap-2">
                        {actionButtons.map((button) => (
                          <div key={button.title}>
                            <button
                              className="border-solid border-2 rounded-full px-2 hover:cursor-pointer"
                              onClick={() => button.action(item)}
                            >
                              {button.title}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              <DeleteAction
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={`Delete ${selectedUser?.name}`}
                description="Are you sure you want to delete this user?"
                onConfirm={handleDelete}
              />
            </>
          }
          page={page}
          setPage={setPage}
          total={total}
          totalPages={totalPages}
        />
      </div>

      <CreateUserAction
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmit}
      />
      {/* Create / Edit modal */}
    </div>
  );
}
