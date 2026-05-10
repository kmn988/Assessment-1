import React from "react";
import Pagination, { type PaginationProps } from "./Pagination";

interface TableProps extends PaginationProps {
  filterComponent?: React.ReactNode;
  headerComponent: React.ReactNode;
  bodyComponent: React.ReactNode;
  className?: string;
}
const TableBase = ({
  className,
  filterComponent,
  headerComponent,
  bodyComponent,
  page,
  setPage,
  total,
  totalPages,
}: TableProps) => {
  return (
    <div className={className}>
      {filterComponent}
      <div className="flex flex-col h-full justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="h-10 border-y-2 border-solid">
                {headerComponent}
              </tr>
            </thead>
            <tbody>{bodyComponent}</tbody>
          </table>
        </div>
        <Pagination
          page={page}
          setPage={setPage}
          total={total}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default TableBase;
