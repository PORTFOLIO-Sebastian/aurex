export function formatCurrency(value: number, currency: string = 'USD') {
  if (value === undefined || value === null) return '-';
  
  let minimumFractionDigits = 2;
  let maximumFractionDigits = 2;
  
  if (value < 1 && value > 0) {
    if (value < 0.0001) maximumFractionDigits = 8;
    else if (value < 0.01) maximumFractionDigits = 6;
    else maximumFractionDigits = 4;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
}

export function formatPercentage(value: number) {
  if (value === undefined || value === null) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    signDisplay: 'always',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

export function formatCompactNumber(value: number) {
  if (value === undefined || value === null) return '-';
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2
  }).format(value);
}
