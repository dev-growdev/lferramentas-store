export const compare = (value?: string | number): string => {
	if (!value) {
		return ''
	}

	return String(value)?.toString()?.toLowerCase()
}

export const GenerateHTMLKey = (key: string, isDefault = true): string => `data-${isDefault
	?
	'default--'
	:
	'custom--'}${normalizeString(key, isDefault)}`

export const normalizeString = (text?: string, isDefault = true): string => {
	if (!text) return ''
	const preValue = String(text).replace(/-/g, ' ')

	const format =
		preValue
			?.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/([A-Z])/g, '-$1')
			.replace(/[\s-]+/g, '-')
			.toLowerCase()

	if (!isDefault) {
		return format
			.replace(/-name/g, '--name')
			.replace(/-value/g, '--value')
	}

	return format
}