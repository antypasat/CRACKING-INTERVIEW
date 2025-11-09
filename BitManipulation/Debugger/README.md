# 5.5 Debugger

**Question:** What does `(n & (n-1)) == 0` do?

**Answer:** Checks if n is a power of 2 (or 0)

**Explanation:**
- `n & (n-1)` clears the lowest set bit
- If result is 0, n had at most one bit set
- This means n is 0 or power of 2

**Uses:**
- Check power of 2
- Count set bits
- Clear lowest bit
