# Menu Testing Guide

## Quick Test

### 1. Test Backend API
Open browser and visit:
```
http://localhost:5000/api/menu
```
You should see JSON with 111 menu items.

### 2. Test Search
```
http://localhost:5000/api/menu/search?q=chicken
```
Should return all chicken items.

### 3. Test Category Filter
```
http://localhost:5000/api/menu/category/fried-rice
```
Should return 21 fried rice items.

## Common Issues & Fixes

### Issue 1: Menu not loading
**Symptom:** Empty menu or "Loading..." forever
**Fix:**
1. Check backend is running: `cd backend && npm run dev`
2. Check port 5000 is not blocked
3. Open browser console (F12) and check for errors

### Issue 2: Search not working
**Symptom:** Search returns no results
**Fix:**
1. Type slowly - search is case-insensitive
2. Try partial words: "chick" instead of "chicken"
3. Clear search and try again

### Issue 3: Category filter not working
**Symptom:** Clicking category shows no items
**Fix:**
1. Check browser console for errors
2. Verify backend is returning data
3. Try refreshing the page

### Issue 4: CORS errors
**Symptom:** "CORS policy" error in console
**Fix:**
1. Ensure backend has CORS enabled (already configured)
2. Check Vite proxy in `vite.config.ts`
3. Restart both backend and frontend

## Manual Testing Steps

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Should see: "Server running on port 5000"

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Should see: "Local: http://localhost:5173"

3. **Test Menu:**
   - Open http://localhost:5173
   - Scroll to "Our Menu" section
   - Should see 111 items initially

4. **Test Filters:**
   - Click "Fried Rice" → Should show 21 items
   - Click "Noodles" → Should show 16 items
   - Click "Momos" → Should show 19 items
   - Click "Starters" → Should show 22 items
   - Click "Kathi Rolls" → Should show 13 items
   - Click "Others" → Should show 20 items
   - Click "All" → Should show all 111 items

5. **Test Search:**
   - Type "chicken" → Should show ~30 items
   - Type "paneer" → Should show ~20 items
   - Type "egg" → Should show ~15 items
   - Clear search → Should show all items

6. **Test Combined:**
   - Click "Momos"
   - Type "chicken" in search
   - Should show only chicken momos (5 items)

## Expected Counts

- **All:** 111 items
- **Fried Rice:** 21 items
- **Noodles:** 16 items
- **Momos:** 19 items
- **Starters:** 22 items
- **Kathi Rolls:** 13 items
- **Others:** 20 items

## Debug Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok"}`

### Check menu endpoint:
```bash
curl http://localhost:5000/api/menu | jq length
```
Should return: `111`

### Check specific category:
```bash
curl http://localhost:5000/api/menu/category/momos | jq length
```
Should return: `19`

## Still Not Working?

1. **Clear browser cache:** Ctrl+Shift+Delete
2. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check browser console:** F12 → Console tab
4. **Check network tab:** F12 → Network tab → Look for failed requests
5. **Restart everything:**
   ```bash
   # Kill all processes
   pkill -f node
   
   # Restart backend
   cd backend && npm run dev
   
   # Restart frontend (new terminal)
   cd frontend && npm run dev
   ```
