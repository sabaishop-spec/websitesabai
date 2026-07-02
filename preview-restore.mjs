import fs from 'fs';
import { categories } from './temp_data/products.js';
import { testimonials } from './temp_data/testimonials.js';

console.log("=== BẢN XEM TRƯỚC DỮ LIỆU SẼ KHÔI PHỤC ===");
console.log(`\n1. Danh mục sản phẩm (sẽ khôi phục ${categories.length} danh mục):`);
categories.forEach(c => {
  console.log(` - ID: ${c.id} | Tên: ${c.title} | Số sản phẩm con: ${c.products?.length || 0}`);
});

console.log(`\n2. Lời tâm sự của đồng niềng (sẽ khôi phục ${testimonials.length} lời tâm sự):`);
testimonials.forEach(t => {
  console.log(` - Khách hàng: ${t.name} | Sản phẩm: ${t.productName} | Đánh giá: ${t.content.substring(0, 30)}...`);
});
