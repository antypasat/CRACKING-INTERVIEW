# 5.8 Draw Line

Draw horizontal line on monochrome screen (byte array).

**Algorithm:**
1. Calculate start/end byte positions
2. Create masks for partial bytes
3. Set full bytes to 0xFF
4. Apply masks to edge bytes

**Complexity:** O(w) where w = line width in bytes
