"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { ProductList } from "@/components/admin/ProductList";
import { defaultProducts } from "@/lib/products";
import {
  estimateProductsStorageBytes,
  loadProducts,
  resetProducts,
  saveProducts,
} from "@/lib/productStorage";
import { Product } from "@/lib/types";
import { formatFileSize } from "@/src/lib/imageCompression";

const STORAGE_WARNING_THRESHOLD = 4.5 * 1024 * 1024;

const findProductById = (products: Product[], productId: string) =>
  products.find((product) => product.id === productId);

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [savedProducts, setSavedProducts] = useState<Product[]>(defaultProducts);
  const [selectedProductId, setSelectedProductId] = useState(defaultProducts[0]?.id ?? "");
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    const storedProducts = loadProducts();
    setProducts(storedProducts);
    setSavedProducts(storedProducts);
    setSelectedProductId(storedProducts[0]?.id ?? "");
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedProduct = useMemo(
    () => findProductById(products, selectedProductId) ?? products[0],
    [products, selectedProductId],
  );

  const savedSelectedProduct = useMemo(
    () => findProductById(savedProducts, selectedProductId),
    [savedProducts, selectedProductId],
  );

  const hasUnsavedChanges = useMemo(() => {
    if (!selectedProduct || !savedSelectedProduct) {
      return false;
    }

    return JSON.stringify(selectedProduct) !== JSON.stringify(savedSelectedProduct);
  }, [savedSelectedProduct, selectedProduct]);

  const storageBytes = useMemo(() => estimateProductsStorageBytes(products), [products]);
  const storageWarning =
    storageBytes > STORAGE_WARNING_THRESHOLD
      ? `Total product data is around ${formatFileSize(storageBytes)}. Since this MVP stores images in localStorage, browser limits may be hit soon.`
      : "";

  const updateProduct = (productId: string, updater: (product: Product) => Product) => {
    setProducts((current) =>
      current.map((product) => (product.id === productId ? updater(product) : product)),
    );
    setToast("");
  };

  const updateSelectedProduct = <Key extends keyof Product>(key: Key, value: Product[Key]) => {
    if (!selectedProduct) {
      return;
    }

    updateProduct(selectedProduct.id, (product) => ({
      ...product,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const success = saveProducts(products);
    if (success) {
      setSavedProducts(products);
      setToast("تم حفظ تعديلات المنتج بنجاح.");
    } else {
      setToast("⚠️ فشل الحفظ! مساحة التخزين في المتصفح ممتلئة. يرجى تقليل حجم الصور المرفوعة.");
    }
  };

  const handleResetCurrent = () => {
    if (!selectedProduct) {
      return;
    }

    const fallback = findProductById(savedProducts, selectedProduct.id) ?? findProductById(defaultProducts, selectedProduct.id);
    if (!fallback) {
      return;
    }

    updateProduct(selectedProduct.id, () => fallback);
    setToast("تمت إعادة المنتج الحالي إلى آخر نسخة محفوظة.");
  };

  const handleAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: "New Product",
      slug: `new-product-${Date.now()}`,
      description: "Enter product description here...",
      price: 0,
      salePrice: 0,
      images: [],
      sizes: ["37", "38", "39", "40", "41"],
      active: true, // Make active by default so it shows up
      featured: false,
      reviews: [],
      faq: []
    };

    // Ensure we are working with the latest products state
    setProducts((current) => {
      const updated = [newProduct, ...current];
      const success = saveProducts(updated);
      
      if (success) {
        setSavedProducts(updated);
        setSelectedProductId(newId);
        setToast("تم إضافة منتج جديد بنجاح. ابدأ بتعديله الآن.");
        return updated;
      } else {
        setToast("⚠️ فشل الإضافة! مساحة التخزين ممتلئة.");
        return current;
      }
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = findProductById(products, productId);
    if (!productToDelete) return;

    if (!window.confirm(`هل أنت متأكد من حذف المنتج "${productToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return;
    }

    const updatedProducts = products.filter((p) => p.id !== productId);
    
    // If we deleted the selected one, pick another
    if (selectedProductId === productId) {
      setSelectedProductId(updatedProducts[0]?.id ?? "");
    }

    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    setSavedProducts(updatedProducts);
    setToast(`تم حذف المنتج "${productToDelete.name}" بنجاح.`);
  };

  const handleResetAll = () => {
    if (!window.confirm("سيتم حذف كل التعديلات المحلية والرجوع للمنتجات الافتراضية. هل تريد المتابعة؟")) {
      return;
    }

    const defaults = resetProducts();
    setProducts(defaults);
    setSavedProducts(defaults);
    setSelectedProductId(defaults[0]?.id ?? "");
    setToast("تمت إعادة كل المنتجات إلى القيم الافتراضية.");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Product Control</p>
            <h1 className="headline mt-4 text-3xl text-white sm:text-4xl">Manage Products</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              واجهة إدارة سريعة للمنتجات. اختار موديل من القائمة لتعديل بياناته أو صوره مباشرة.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/40 px-5 py-3 text-sm font-bold text-white/80">
            Storage: {formatFileSize(storageBytes)}
          </div>
        </div>
      </div>

      {toast ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {toast}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <ProductList
          products={products}
          selectedProductId={selectedProduct?.id ?? ""}
          onSelect={setSelectedProductId}
          onDelete={handleDeleteProduct}
          onAdd={handleAddProduct}
        />
        <ProductEditor
          product={selectedProduct}
          hasUnsavedChanges={hasUnsavedChanges}
          storageWarning={storageWarning}
          onChange={updateSelectedProduct}
          onImagesChange={(images) => updateSelectedProduct("images", images)}
          onSave={handleSave}
          onResetCurrent={handleResetCurrent}
          onResetAll={handleResetAll}
        />
      </div>
    </div>
  );
}
