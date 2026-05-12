export const FormatText = (text: string | undefined) => {
    return text
      ? text
          .replace(/[ÀÁÂÃÄÅàáâãäå]/g, "a")
          .replace(/[ÈÉÊËéèê]/g, "e")
          .replace(/[ÌÍÎíìî]/g, "i")
          .replace(/[ÒÓÔÕòóôõ]/g, "o")
          .replace(/[ÚÙÛúùû]/g, "u")
          .replace(/[Çç]/g, "c")
          .replace(/[^a-z0-9]/gi, "")
          .toLowerCase()
      : ""
  }
  