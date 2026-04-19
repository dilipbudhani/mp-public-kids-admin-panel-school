import React from 'react';

interface DisclosureTableProps {
    title?: string;
    headers: string[];
    rows: (string | React.ReactNode)[][];
}

export const DisclosureTable: React.FC<DisclosureTableProps> = ({ title, headers, rows }) => {
    return (
        <div className="mb-8 overflow-x-auto">
            {title && (
                <h3 className="text-xl font-bold bg-primary text-white p-3 border-x border-t border-primary print:bg-gray-100 print:text-black">
                    {title}
                </h3>
            )}
            <table className="min-w-full border-collapse border border-primary print:border-black">
                <thead>
                    <tr className="bg-slate-100 print:bg-transparent">
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                className="border border-primary p-3 text-left font-bold text-primary print:border-black print:text-black"
                                style={{ width: idx === 0 ? '40%' : 'auto' }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50 transition-colors print:hover:bg-transparent">
                            {row.map((cell, cellIdx) => (
                                <td
                                    key={cellIdx}
                                    className="border border-primary p-3 text-sm text-text print:border-black print:text-black"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
