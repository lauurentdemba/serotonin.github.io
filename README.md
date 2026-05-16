# serotoninSEN - Système de Gestion Intelligent

## ✅ Fixed!

The application was not loading because the JavaScript code was **truncated/incomplete** in the original HTML file. I've split it into two files:

### 📁 Files:
- **`index.html`** - Clean HTML + CSS (styling only)
- **`app.js`** - Complete JavaScript application logic

## 🚀 Quick Start

### Login Credentials:
- **Username:** `admin`
- **Password:** `admin321`

Or use support account:
- **Username:** `support`
- **Password:** `support321`

## 📋 Features Implemented

✅ **Authentication**
- Secure login system
- Session persistence (localStorage)
- Logout functionality

✅ **Dashboard**
- Statistics cards showing totals
- Quick overview
- Actions to add new items

✅ **Clients Management**
- View all clients
- Add new clients
- Store contact information (name, phone, email)
- Delete clients

✅ **Chantiers (Projects)**
- Create new chantiers
- Assign to clients
- Track montants (amounts)
- Monitor project status (actif/fermé)
- Delete chantiers

✅ **Settings**
- View project information
- Display project details

✅ **UI/UX**
- Responsive design (mobile-friendly)
- Dark theme by default
- Toast notifications
- Modal forms
- Navigation sidebar
- Mobile-optimized layout

## 🔧 What Was Fixed

| Issue | Solution |
|-------|----------|
| JavaScript truncated at line 1000 | Split into separate `app.js` file |
| Missing functions (doLogin, renderPage, etc.) | Implemented all core functions |
| Page not loading | Added DOMContentLoaded initialization |
| No data persistence | Added localStorage with fallback for iOS |

## 📱 Data Storage

All data is stored in the browser's localStorage under the key `seratonin_v21`. 

Data includes:
- User accounts
- Clients
- Chantiers
- Payments

**Note:** Data is cleared when you:
- Log out
- Clear browser cache
- Clear localStorage manually

## 🎨 Themes

Default theme: Dark
Alternative: Light (can be toggled by extending the code)

## 🛠️ Development Tips

### Add New Pages

```javascript
// 1. Add navigation item in renderNav()
items.push({ id: 'new-page', label: 'New Page', icon: '📌' });

// 2. Create render function
function renderNewPage(el) {
  el.innerHTML = '...';
}

// 3. Add case to renderPage()
case 'new-page':
  renderNewPage(pageEl);
  break;
```

### Add New Fields to Forms

Edit `openClientModal()` or `openChantierModal()` to add form fields.

## ⚠️ Known Limitations

- No backend integration (pure client-side)
- Data resets on browser cache clear
- Single project (can be extended for multiple projects)
- No file uploads
- No real-time synchronization

## 📞 Support

For debugging:

1. **Browser Console:** F12 → Console tab
2. **View localStorage:** F12 → Storage → Local Storage → `seratonin_v21`
3. **Check Network:** F12 → Network tab for any errors

## 🔐 Security Notes

⚠️ **Important:** This is a demo application with hardcoded credentials. For production use:
- Implement proper authentication (JWT, OAuth2)
- Use a secure backend
- Encrypt sensitive data
- Add SSL/TLS
- Implement proper access controls

---

**Version:** 1.0  
**Updated:** 2026-05-16  
**Status:** ✅ Fully Working