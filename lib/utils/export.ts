/**
 * CSV Export Utilities
 * Handles conversion of data to CSV format and triggers browser downloads
 */

/**
 * Escapes special characters in CSV fields
 * Handles quotes, commas, and newlines according to RFC 4180
 */
function escapeCSVField(field: string | number | boolean | null | undefined): string {
  if (field === null || field === undefined) {
    return '';
  }

  const stringValue = String(field);
  
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Converts an array of objects to CSV format
 * @param data - Array of objects to convert
 * @param headers - Optional custom headers. If not provided, uses object keys
 * @returns CSV string
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) {
    return '';
  }

  // Determine headers
  let csvHeaders: { key: keyof T; label: string }[];
  
  if (headers) {
    csvHeaders = headers;
  } else {
    // Use keys from first object as headers
    const keys = Object.keys(data[0]) as (keyof T)[];
    csvHeaders = keys.map(key => ({ key, label: String(key) }));
  }

  // Build CSV header row
  const headerRow = csvHeaders.map(h => escapeCSVField(h.label)).join(',');

  // Build CSV data rows
  const dataRows = data.map(row => {
    return csvHeaders
      .map(header => escapeCSVField(row[header.key]))
      .join(',');
  });

  // Combine header and data rows
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Triggers a browser download of CSV data
 * @param csvContent - CSV string content
 * @param filename - Name of the file to download (without extension)
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports data to CSV and triggers download
 * @param data - Array of objects to export
 * @param filename - Name of the file to download
 * @param headers - Optional custom headers
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: { key: keyof T; label: string }[]
): void {
  const csvContent = convertToCSV(data, headers);
  downloadCSV(csvContent, filename);
}
