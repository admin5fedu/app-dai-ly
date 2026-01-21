/**
 * Products API and utilities
 */

export type Product = {
  ID: string
  id_san_pham_cha: string
  ma_san_pham_cha: string
  ten_san_pham_cha: string
  ma_vach: string
  ma_san_pham: string
  ten_san_pham: string
  do_vi_tinh: string
  link_anh_san_pham: string
  gia_ban: string
  ten_khac: string
}

export type ProductType = 'parent' | 'child' | 'standalone'

/**
 * Parse products from Google Sheets data
 */
export function parseProducts(rows: any[][]): Product[] {
  if (!rows || rows.length < 2) return []

  // Skip header row
  return rows.slice(1).map(row => ({
    ID: String(row[0] || ''),
    id_san_pham_cha: String(row[1] || ''),
    ma_san_pham_cha: String(row[2] || ''),
    ten_san_pham_cha: String(row[3] || ''),
    ma_vach: String(row[4] || ''),
    ma_san_pham: String(row[5] || ''),
    ten_san_pham: String(row[6] || ''),
    ten_khac: String(row[7] || ''),
    do_vi_tinh: String(row[8] || ''),
    link_anh_san_pham: String(row[9] || ''),
    gia_ban: String(row[10] || ''),
  })).filter(p => p.ID && p.ten_san_pham) // Filter out empty rows
}

/**
 * Group products by parent ID
 */
export function groupProductsByParent(products: Product[]): Map<string, Product[]> {
  const grouped = new Map<string, Product[]>()

  products.forEach(product => {
    if (product.id_san_pham_cha && product.id_san_pham_cha.trim()) {
      const parentId = product.id_san_pham_cha.trim()
      if (!grouped.has(parentId)) {
        grouped.set(parentId, [])
      }
      grouped.get(parentId)!.push(product)
    }
  })

  return grouped
}

/**
 * Filter products by search term
 */
export function filterProducts(products: Product[], searchTerm: string): Product[] {
  if (!searchTerm.trim()) {
    // Only show parents and standalone products (no children)
    return products.filter(p => !p.id_san_pham_cha || !p.id_san_pham_cha.trim())
  }

  const term = searchTerm.toLowerCase().trim()
  return products.filter(product =>
    product.ten_san_pham.toLowerCase().includes(term) ||
    product.ma_san_pham.toLowerCase().includes(term) ||
    product.ma_vach.toLowerCase().includes(term) ||
    product.ten_san_pham_cha.toLowerCase().includes(term) ||
    product.ten_khac.toLowerCase().includes(term)
  )
}

/**
 * Get product type
 */
export function getProductType(product: Product, hasChildren: boolean): ProductType {
  if (product.id_san_pham_cha && product.id_san_pham_cha.trim()) {
    return 'child'
  }
  return hasChildren ? 'parent' : 'standalone'
}

/**
 * Format price
 */
export function formatPrice(price: string): string {
  if (!price || !price.trim()) return ''
  return price.trim()
}

