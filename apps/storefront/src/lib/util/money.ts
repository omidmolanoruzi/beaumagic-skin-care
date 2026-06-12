import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

const localeForCurrency = (currency_code: string) => {
  switch (currency_code.toLowerCase()) {
    case "cad":
      return "en-CA"
    case "usd":
      return "en-US"
    default:
      return "en-US"
  }
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: ConvertToLocaleParams) => {
  const resolvedLocale = locale ?? localeForCurrency(currency_code)

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(resolvedLocale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}
