import { convert } from "html-to-text"

export const convertHtml = (html) => {
  const htmlText = convert(html, {
      wordwrap: 130
  })
  return htmlText
}
