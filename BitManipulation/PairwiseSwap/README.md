# 5.7 Pairwise Swap

Swap odd and even bits (bit 0↔1, 2↔3, etc.).

**Algorithm:**
```javascript
oddBits = (n & 0xaaaaaaaa) >>> 1
evenBits = (n & 0x55555555) << 1
return oddBits | evenBits
```

**Complexity:** O(1)
