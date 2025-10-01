# Production Database Setup for Vercel

## 🚀 **Database Solutions for Production**

Aplikasi ini menggunakan **adaptive database system** yang otomatis memilih storage berdasarkan environment:

- **Development:** File-based storage (`data/products.db.json`)
- **Production:** Vercel KV (Redis) untuk persistent storage

## 📋 **Setup Instructions**

### **Step 1: Setup Vercel KV**

1. **Login ke Vercel Dashboard**
   ```bash
   vercel login
   ```

2. **Create KV Database**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "KV" (Redis)
   - Name: `nugi-products-db`

3. **Get Environment Variables**
   Vercel akan generate environment variables:
   ```
   KV_REST_API_URL=https://...
   KV_REST_API_TOKEN=...
   ```

### **Step 2: Configure Environment Variables**

**Local Development (.env.local):**
```bash
# Optional: Add KV config for local testing
KV_REST_API_URL=your_kv_url_here
KV_REST_API_TOKEN=your_kv_token_here
```

**Production (Vercel):**
- Environment variables sudah otomatis tersedia
- No manual configuration needed

### **Step 3: Deploy & Migrate Data**

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Migrate Existing Data** (Optional)
   Call API endpoint to migrate local data ke KV:
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/migrate-kv \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

## 🔍 **Database Status Check**

Check current database configuration:
```bash
curl https://your-app.vercel.app/api/admin/db-status
```

**Response Examples:**

**Development:**
```json
{
  "databaseInfo": {
    "environment": "development",
    "storageType": "file",
    "persistent": true,
    "hasKV": false
  }
}
```

**Production with KV:**
```json
{
  "databaseInfo": {
    "environment": "production",
    "storageType": "vercel-kv",
    "persistent": true,
    "hasKV": true
  }
}
```

**Production without KV:**
```json
{
  "databaseInfo": {
    "environment": "production",
    "storageType": "memory",
    "persistent": false,
    "hasKV": false
  }
}
```

## ⚠️ **Important Notes**

### **Without KV Setup:**
- Data akan disimpan di memory (temporary)
- User akan mendapat warning: "*Changes are temporary and will be lost on restart*"
- Setiap restart Vercel function = data hilang

### **With KV Setup:**
- Data persistent dan aman
- No warnings untuk user
- High performance Redis storage

## 🛠️ **Troubleshooting**

### **KV Connection Issues:**
```bash
# Check environment variables
echo $KV_REST_API_URL
echo $KV_REST_API_TOKEN

# Test KV connection
curl https://your-app.vercel.app/api/admin/db-status
```

### **Migration Issues:**
```bash
# Force migration
curl -X POST https://your-app.vercel.app/api/admin/migrate-kv \
  -H "Content-Type: application/json"
```

## 📊 **Performance Comparison**

| Storage Type | Latency | Persistence | Scalability | Cost |
|--------------|---------|-------------|-------------|------|
| File (Dev)   | Low     | ✅ Yes      | Limited     | Free |
| Memory (Prod)| Very Low| ❌ No       | Limited     | Free |
| Vercel KV    | Low     | ✅ Yes      | High        | Paid |

## 🔧 **Advanced Configuration**

### **Custom KV Key Prefix:**
```typescript
// lib/store-production.ts
const KV_KEY = 'nugi_products_db_v2' // Custom key
```

### **Backup Strategy:**
```bash
# Export data before changes
curl https://your-app.vercel.app/api/admin/products/export
```

## 🎯 **Deployment Checklist**

- [ ] Vercel KV database created
- [ ] Environment variables configured
- [ ] Application deployed to production
- [ ] Database status verified (`/api/admin/db-status`)
- [ ] Data migration completed (if needed)
- [ ] Product form testing completed
- [ ] Backup strategy in place

## 📞 **Support**

Jika ada masalah dengan production database:

1. Check database status via API
2. Verify Vercel KV configuration
3. Check application logs di Vercel dashboard
4. Test dengan sample data

**Database sekarang production-ready dan akan berjalan optimal di Vercel! 🚀**