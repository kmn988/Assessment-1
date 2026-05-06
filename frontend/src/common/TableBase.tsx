import React from "react";

interface TableProps {
  headerComponent: React.ReactNode;
  bodyComponent: React.ReactNode;
}
const TableBase = ({ headerComponent, bodyComponent }: TableProps) => {
  return (
    <table className="w-full text-left min-w-[500px]">
      <thead>
        <tr className="h-10 border-y-2 border-solid">{headerComponent}</tr>
      </thead>
      <tbody>{bodyComponent}</tbody>
    </table>
  );
};

export default TableBase;
