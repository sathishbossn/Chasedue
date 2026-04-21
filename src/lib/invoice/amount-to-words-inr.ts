/** Indian numbering — rupees + paise for invoice PDFs */
export function amountToWordsInr(amount: number): string {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  function convertHundreds(n: number): string {
    if (n === 0) return ''
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    return (
      ones[Math.floor(n / 100)] +
      ' Hundred' +
      (n % 100 ? ' ' + convertHundreds(n % 100) : '')
    )
  }
  function convertIndian(n: number): string {
    if (n === 0) return 'Zero'
    let result = ''
    let x = n
    const crore = Math.floor(x / 10000000)
    x %= 10000000
    const lakh = Math.floor(x / 100000)
    x %= 100000
    const thou = Math.floor(x / 1000)
    x %= 1000
    if (crore) result += convertHundreds(crore) + ' Crore '
    if (lakh) result += convertHundreds(lakh) + ' Lakh '
    if (thou) result += convertHundreds(thou) + ' Thousand '
    if (x) result += convertHundreds(x)
    return result.trim()
  }
  const rupees = Math.floor(amount)
  const paise = Math.round((amount - rupees) * 100)
  let words = 'Rupees ' + convertIndian(rupees)
  if (paise > 0) words += ' and ' + convertIndian(paise) + ' Paise'
  return words + ' Only'
}
