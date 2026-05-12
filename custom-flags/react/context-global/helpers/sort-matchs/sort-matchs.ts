import {T_schema_priority} from '../../_interfaces'

export class SortMatchs {
	public sort(a: number, b: number, isInverted: boolean, prioritySystemOnQuadrant: T_schema_priority): number {
		let result = 0

    return this.resolvePriorityByField(a, b,false)

		prioritySystemOnQuadrant === 'priorityByList'
			?
			result =
				this.resolvePriorityByField(a, b, isInverted)
			:
			result =
				this.resolvePriorityByList(isInverted)

		return result
	}

	private resolvePriorityByList(isInverted: boolean): number {
		if (isInverted) return -1

		return 1
	}

	private resolvePriorityByField(a: number, b: number, isInverted: boolean): number {
		if (isInverted) return a - b

		return b - a
	}
}