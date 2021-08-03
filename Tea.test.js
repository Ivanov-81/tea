import sum from "./js/ts";

test('first test', () => {
    expect(sum(5, 6)).toBe(11);
});

test('return value correctly comparing to other', () => {
    expect(sum(2,3)).toBeGreaterThan(4)
    expect(sum(2,3)).toBeLessThan(6)
})
