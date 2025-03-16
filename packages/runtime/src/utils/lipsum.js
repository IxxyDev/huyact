import { h, hFragment } from "../h";

const PHRASE = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis"

export function lipsum(repeats) {
	return hFragment(Array(repeats).fill(h('p', {}, PHRASE)))
}
