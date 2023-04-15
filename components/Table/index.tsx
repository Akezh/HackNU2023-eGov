import React from "react";

interface TableProps<GenericData> {
  columns: Array<keyof GenericData>;
  data: GenericData[];
}

export function Table<AvoidShadowedGenericdata>({
  columns,
  data,
}: TableProps<AvoidShadowedGenericdata>) {
  return (
    <div className="relative my-16 overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((c, i) => (
              <th scope="col" className="px-6 py-3" key={i}>
                {String(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={
                i % 2 === 0 ? "bg-white border-b" : "border-b bg-gray-50"
              }
            >
              {columns.map((c, j) => (
                <th
                  key={j}
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {String(row[c])}
                </th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
